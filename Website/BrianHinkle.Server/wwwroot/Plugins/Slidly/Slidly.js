class Slidly
{
    constructor(inWrapperID = "SlidlyWrapper", inParallaxContainerClass = ".ParallaxContainer", inParallaxElementClass = ".ParallaxElement", inWrapperScrollEase = 1/*0.075*/, allowOnMobile = true)
    {
        this.WrapperID = inWrapperID;
        this.ParallaxContainerClass = inParallaxContainerClass;
        this.TargetClass = inParallaxElementClass;
		this.WrapperScrollEase = inWrapperScrollEase;

        if (this.IsSupported())
        {
            const notOnMobile = this.Window.matchMedia("screen and (min-width: 40em)").matches; // using this query as a way to see if we are on mobile
            if (notOnMobile || allowOnMobile)
            {
                this.Init();
            }
        }
    }

    IsSupported() // ensures all features we use are supported
    {
        this.Window = window; // store our window so we can make call to raf
        this.RAF = this.Window.requestAnimationFrame
            || this.Window.mozRequestAnimationFrame
            || this.Window.oRequestAnimationFrame
            || this.Window.webkitRequestAnimationFrame
            || this.Window.msRequestAnimationFrame;
        this.Window.requestAnimationFrame = this.RAF;
        this.CAF = this.Window.cancelAnimationFrame || this.Window.mozCancelAnimationFrame;

        const scrollingEl = document.documentElement || document.body;
        const dummyAnimation = new Animation();
        const dummyKeyframeEffect = new KeyframeEffect(null, { }, { });
        const scrollTop = window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop);
        return this.Window !== undefined
            && this.Window.innerHeight !== undefined
            && scrollTop !== undefined
            && document.getElementById !== undefined
            && document.querySelectorAll !== undefined
            && scrollingEl !== undefined
            && scrollingEl.offsetHeight !== undefined
            && scrollingEl.offsetTop !== undefined
            && scrollingEl.dataset !== undefined
            && addEventListener !== undefined
            && ResizeObserver !== undefined
            && this.RAF !== undefined
            && this.RAF.call !== undefined
            && this.Tick.bind !== undefined
            && this.CAF !== undefined
            && Animation !== undefined
            && dummyAnimation !== undefined
            && dummyAnimation.effect !== undefined
            && dummyAnimation.currentTime !== undefined
            && dummyKeyframeEffect.setKeyframes !== undefined
            && this.Window.matchMedia !== undefined;
    }

    Init()
    {
        this.WrapperEl = document.getElementById(this.WrapperID);
        if (this.WrapperEl === null || this.WrapperEl === undefined)
        {
            console.warn(`Slidly did not find a wrapper div of id ${this.WrapperID}`);
            return;
        }
        
        
        this.CurrentScrollPos = 0; // Current scroll position
        this.fakeScroll = document.createElement("div"); // The `fakeScroll` is an element to make the page scrollable
        this.fakeScroll.style.position = "absolute";
        this.fakeScroll.style.top = "0";
        this.fakeScroll.style.width = "1px";
        this.UpdateFakeScrollHeight(); // sets the div's height to the SlidlyWrapper's height
        document.body.appendChild(this.fakeScroll); // Here we are creating it and appending it to the body


        this.ParallaxContainers = document.querySelectorAll(this.ParallaxContainerClass);
        
        // ---------- BEGIN Init things ----------
        addEventListener("resize", this.UpdateFakeScrollHeight.bind(this));  // update the body height on window resize/zoom
        this.FakeScrollResizeObserver = new ResizeObserver(this.OnWrapperResizeObserved.bind(this)); // update the FakeScroll div height on Wrapper height changes
        this.FakeScrollResizeObserver.observe(this.WrapperEl);

        this.WrapperEl.style.width = "100%";
        this.WrapperEl.style.position = "fixed";

        // Create the animations for parallax
        for (let i = 0; i < this.ParallaxContainers.length; i++)
        {
            const ParallaxContainer = this.ParallaxContainers[i];

            let OwnedParallaxAnimations = new Array();
            const OwnedParallaxElements = ImmediateChildrenQuerySelectAll(ParallaxContainer, function (elem) { return elem.matches(".ParallaxElement"); }); // get all ParallaxElements that are immediate decendents of this ParallaxContainter
            OwnedParallaxElements.forEach((ParallaxElement) =>
            {
                const animation = new Animation();
                // Get data attributes and attatch them to our animation
                let dataParallaxSpeed = ParallaxElement.dataset.parallaxspeed;
                dataParallaxSpeed = dataParallaxSpeed ? dataParallaxSpeed : .5; // if not specified, give default value of .5
                animation.speedMultiplier = 1 - dataParallaxSpeed

                
                animation.effect = new KeyframeEffect(
                    ParallaxElement,    // target
                    this.GetKeyframesForParallaxAnimation(animation),
                    {
                        duration: 1, // 1 allows us to easily scrub through the animation as if it was a percentage
                        iterations: Infinity,
                        direction: "normal",
                        fill: "both",
                        easing: "linear",
                    }
                );
                OwnedParallaxAnimations.push(animation);
            });

            ParallaxContainer.OwnedParallaxAnimations = OwnedParallaxAnimations;
        }
        addEventListener("resize", this.RefreshAnimationKeys.bind(this)); // Also need to do this on zoom/resize since keyframes will be outdated

        // ---------- END Init things ----------

        // Now lets animate
        this.tickID = this.RAF.call(this.Window, this.Tick.bind(this));
    }

    OnWrapperResizeObserved(entries)
    {
        entries.forEach((entry) =>
        {
            if (entry.target == this.WrapperEl)
            {
                this.UpdateFakeScrollHeight();
            }
            
        });
    }

    UpdateFakeScrollHeight()
    {
        this.fakeScroll.style.height = `${this.WrapperEl.getBoundingClientRect().height || this.WrapperEl.clientHeight}px`;
    }
    // Important since WAAPI keys can't be dynamic
    RefreshAnimationKeys()
    {
        const ParallaxContainersLength = this.ParallaxContainers.length;
        for (let i = 0; i < ParallaxContainersLength; i++)
        {
            const ParallaxContainer = this.ParallaxContainers[i];
            const OwnedParallaxAnimationsLength = ParallaxContainer.OwnedParallaxAnimations.length;
            for (let j = 0; j < OwnedParallaxAnimationsLength; j++)
            {
                const ParallaxAnimation = ParallaxContainer.OwnedParallaxAnimations[j];
                ParallaxAnimation.effect.setKeyframes(this.GetKeyframesForParallaxAnimation(ParallaxAnimation));
            }
        }
    }

    Tick(timestamp)
    {
        const TargetScrollPos = window.scrollY || window.pageYOffset || document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);
        const diff = TargetScrollPos - this.CurrentScrollPos;
        const delta = Math.abs(diff) < 0.1 ? 0 : diff * this.WrapperScrollEase; // delta is the value for adding to the current scroll position. If diff < 0.1, just set it to 0 to prevent endless scrolling animation (in the case of easing)
        if (delta !== 0)
        {
            // Update current scroll position for this tick
            this.CurrentScrollPos += delta; 
            this.CurrentScrollPos = parseFloat(this.CurrentScrollPos.toFixed(2)); // round value for better performance
            if (this.CurrentScrollPos == 0) // if we are about to translate to 0
            {
                this.CurrentScrollPos = .00001; // translate to something else since it thinks it can optimize and do nothing when we tell it 0 somereason
            }



            // Scroll the wrapper (whole page)
            this.TranslateElement(this.WrapperEl, 0, -this.CurrentScrollPos, 0);
            
            // Scroll the parallax elements by an offset
            const ParallaxContainersLength = this.ParallaxContainers.length;
            for (let i = 0; i < ParallaxContainersLength; i++)
            {
                const ParallaxContainer = this.ParallaxContainers[i];

                const WrapperScrollTopToBotomOfViewport = (this.CurrentScrollPos + this.Window.innerHeight); // get scroll distance to bottom of viewport.
                const elPositionRelativeToBottomOfViewport = (WrapperScrollTopToBotomOfViewport - ParallaxContainer.offsetTop); // get element's position relative to bottom of viewport.
                const elTravelDistance = (this.Window.innerHeight + ParallaxContainer.offsetHeight);
                const currentProgress = (elPositionRelativeToBottomOfViewport / elTravelDistance); // calculate tween progresss.

                const OwnedParallaxAnimationsLength = ParallaxContainer.OwnedParallaxAnimations.length;
                for (let j = 0; j < OwnedParallaxAnimationsLength; j++)
                {
                    ParallaxContainer.OwnedParallaxAnimations[j].currentTime = currentProgress;
                }
            }
        } 
        else
        {
            this.CurrentScrollPos = TargetScrollPos; // update current scroll position for this tick
        }

        this.tickID = this.RAF.call(this.Window, this.Tick.bind(this));
    }

    TranslateElement(inEl, inX, inY, inZ)
    {
        if (inX == 0 && inY == 0 && inZ == 0)
        {
            return;
        }

        const styleString = `translate3d(${inX}px, ${inY}px, ${inZ}px)`;


        inEl.style.msTransform = styleString;       // IE
        inEl.style.webkitTransform = styleString;   // Chrome and Safari
        inEl.style.MozTransform = styleString;      // Firefox
        inEl.style.OTransform = styleString;        // Opera
        inEl.style.transform = styleString;         // Someday this may get adopted and become a standard
    }

    // Way to define the parallax animation in one spot for all parallax animations regardless of their speed multipliers
    GetKeyframesForParallaxAnimation(animation)
    {
        const windowInnerHeight = this.Window.innerHeight;
        const viewportDistanceToTravelMultiplier = animation.speedMultiplier;
        return { transform: [`translate3d(0, ${-windowInnerHeight * viewportDistanceToTravelMultiplier}px, 0)`, `translate3d(0, ${windowInnerHeight * viewportDistanceToTravelMultiplier}px, 0)`] };
    }
}

/*!
 * Get all direct descendant elements that match a test condition
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Node}   elem     The element to get direct descendants for
 * @param  {Function} callback The test condition
 * @return {Array}           The matching direct descendants
 */
function ImmediateChildrenQuerySelectAll(elem, callback)
{
    return Array.from(elem.children).filter(callback);
}

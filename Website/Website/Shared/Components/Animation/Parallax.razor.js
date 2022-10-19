class Parallaxer
{
    constructor(inWrapperID = "ParallaxWrapper", inParallaxContainerClass = ".ParallaxContainer", inParallaxElementClass = ".ParallaxElement", inWrapperSpeed = 1, allowOnMobile = true)
    {
        this.WrapperID = inWrapperID;
        this.ParallaxContainerClass = inParallaxContainerClass;
        this.TargetClass = inParallaxElementClass;
		this.WrapperSpeed = inWrapperSpeed;

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

        return this.Window !== undefined
            && this.Window.innerHeight !== undefined
            && document.getElementById !== undefined
            && document.querySelectorAll !== undefined
            && scrollingEl !== undefined
            && scrollingEl.scrollTop !== undefined
            && scrollingEl.offsetHeight !== undefined
            && scrollingEl.offsetTop !== undefined
            && scrollingEl.dataset !== undefined
            && addEventListener !== undefined
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
        this.Wrapper = document.getElementById(this.WrapperID);
        this.ParallaxContainers = document.querySelectorAll(this.ParallaxContainerClass);
        this.WapperOffset = 0; // how offset it is from the top
        this.WrapperScrollTop = 0; // Our version of scroll top. This tells us how far we have scrolled through our page (or at least how far the content inside the wrapper was scrolled)
        /*this.prevTimestamp = -1; // -1 will indicate the first paint we are ticking on*/
        
        // ---------- BEGIN Init things ----------
        document.body.style.height = `${this.Wrapper.clientHeight}px`; // document body will determine the height/scrolling of our page
        addEventListener("resize", this.UpdateBodyHeight.bind(this));  // update the body height on window resize/zoom
        this.BodyResizeObserver = new ResizeObserver(this.OnWrapperResizeObserved.bind(this)); // update the body height on Wrapper height changes
        this.BodyResizeObserver.observe(this.Wrapper);

        this.Wrapper.style.width = "100%";
        this.Wrapper.style.position = "fixed";

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
            if (entry.target == this.Wrapper)
            {
                this.UpdateBodyHeight();
            }
            
        });
    }

    UpdateBodyHeight()
    {
        document.body.style.height = `${this.Wrapper.clientHeight}px`;
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
        /*let DeltaTime = 0;
        if (this.prevTimestamp != -1)
        {
            DeltaTime = Math.min(1, (timestamp - this.prevTimestamp) / 1000);
        }*/

        // Scroll the wrapper (whole page)
        const documentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        this.WapperOffset += (documentScrollTop - this.WapperOffset) * this.WrapperSpeed;
        this.WrapperScrollTop = (Math.round(this.WapperOffset * 100) / 100);
        this.TranslateElement(this.Wrapper, 0, -this.WrapperScrollTop, 0);

        // Offset the parallax elements
        const ParallaxContainersLength = this.ParallaxContainers.length;
        for (let i = 0; i < ParallaxContainersLength; i++)
        {
            const ParallaxContainer = this.ParallaxContainers[i];

            const WrapperScrollTopToBotomOfViewport = (this.WrapperScrollTop + this.Window.innerHeight);                                   // get scroll distance to bottom of viewport.
            const elPositionRelativeToBottomOfViewport = (WrapperScrollTopToBotomOfViewport - ParallaxContainer.offsetTop);    // get element's position relative to bottom of viewport.
            const elTravelDistance = (this.Window.innerHeight + ParallaxContainer.offsetHeight);
            const currentProgress = (elPositionRelativeToBottomOfViewport / elTravelDistance);                          // calculate tween progresss.

            const OwnedParallaxAnimationsLength = ParallaxContainer.OwnedParallaxAnimations.length;
            for (let j = 0; j < OwnedParallaxAnimationsLength; j++)
            {
                ParallaxContainer.OwnedParallaxAnimations[j].currentTime = currentProgress;
            }
        }

        /*this.prevTimestamp = timestamp;*/
        this.tickID = this.RAF.call(this.Window, this.Tick.bind(this));
    }

    TranslateElement(inEl, inX, inY, inZ)
    {
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

export function OnAfterRenderAsync(wrapperID, parallaxContainerClass, parallaxElementClass, wrapperSpeed, allowOnMobile)
{
    new Parallaxer(wrapperID, parallaxContainerClass, parallaxElementClass, wrapperSpeed, allowOnMobile);
}

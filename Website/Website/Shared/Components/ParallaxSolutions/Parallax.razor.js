class Parallaxer
{
    constructor(inWrapperID = "ParallaxWrapper", inParallaxContainerClass = ".ParallaxContainer", inTargetClass = ".ParallaxElement", inWrapperSpeed = 1)
    {
        this.WrapperID = inWrapperID;
        this.ParallaxContainerClass = inParallaxContainerClass;
        this.TargetClass = inTargetClass;
		this.WrapperSpeed = inWrapperSpeed;



        if (this.IsSupported())
        {
            this.Init();
        }
    }

    IsSupported() // ensures all features we use are supported
    {
        this.RAF = window.requestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.msRequestAnimationFrame;
        window.requestAnimationFrame = requestAnimationFrame; // ?
        this.CAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
        this.Window = window; // store our window so we can make call to raf


        return document.getElementById
            && document.querySelectorAll
            && window.cancelAnimationFrame
            && window.requestAnimationFrame
            && this.RAF
            && this.CAF
            && this.Window;
    }

    Init()
    {
        // BEGIN CSS styling
            // Get rid of annoying stuff
            const htmlEl = document.documentElement;
            htmlEl.style.overflowX = "hidden";
            htmlEl.style.padding = "0px";
            htmlEl.style.margin = "0px";
            const bodyEl = document.body;
            bodyEl.style.overflowX = "hidden";
            bodyEl.style.padding = "0px";
            bodyEl.style.margin = "0px";
        // END CSS styling

        this.Wrapper = document.getElementById(this.WrapperID);
        this.ParallaxContainers = document.querySelectorAll(this.ParallaxContainerClass);
        this.TargetElements = document.querySelectorAll(this.TargetClass);
        this.WapperOffset = 0; // how offset it is from the top
        this.WrapperScrollTop = 0; // Our version of scroll top. This tells us how far we have scrolled through our page (or at least how far the content inside the wrapper was scrolled)
        this.prevTimestamp = -1; // -1 will indicate the first paint we are ticking on



        document.body.style.height = `${this.Wrapper.clientHeight}px`; // document body will determine the height/scrolling of our page
        //this.attachEvent(); // something about resizing

        // ---------- BEGIN Init things ----------
        this.Wrapper.style.width = '100%';
        this.Wrapper.style.position = 'fixed';

        const ParallaxContainersLength = this.ParallaxContainers.length;
        for (let i = 0; i < ParallaxContainersLength; i++)
        {
            const ParallaxContainer = this.ParallaxContainers[i];

            let OwnedParallaxAnimations = new Array();
            const OwnedParallaxElements = ImmediateChildrenQuerySelectAll(ParallaxContainer, function (elem) { return elem.matches(".ParallaxElement"); }); // get all ParallaxElements that are immediate decendents of this ParallaxContainter
            OwnedParallaxElements.forEach((ParallaxElement) =>
            {
                let dataParallaxSpeed = ParallaxElement.dataset.parallaxspeed;
                dataParallaxSpeed = dataParallaxSpeed ? dataParallaxSpeed : .5; // if not specified, give default value of .5
                const speedMultiplier = 1 - dataParallaxSpeed;

                const animationOptions = {
                    duration: 1,
                    iterations: Infinity,
                    direction: "normal",
                    fill: "both",
                    easing: "linear",
                };
                const animation = new Animation(
                    new KeyframeEffect(
                        ParallaxElement,
                        {
                            transform: [`translate3d(0, ${-window.innerHeight * speedMultiplier}px, 0)`, `translate3d(0, ${window.innerHeight * speedMultiplier}px, 0)`]
                        },
                        animationOptions
                    )
                );
                OwnedParallaxAnimations.push(animation);
            });

            ParallaxContainer.OwnedParallaxAnimations = OwnedParallaxAnimations;
        }
        // ---------- END Init things ----------

        // Now lets animate
        this.RAF.call(this.Window, this.Tick.bind(this));
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
        this.Wrapper.style.transform = `translate3d(0, ${-this.WrapperScrollTop}px, 0)`;

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
                const ParallaxAnimation = ParallaxContainer.OwnedParallaxAnimations[j];

                ParallaxAnimation.currentTime = currentProgress * 1;
            }
        }

        /*this.prevTimestamp = timestamp;*/
        this.RAF.call(this.Window, this.Tick.bind(this));
    }

}

export function OnAfterRenderAsync()
{
    const p = new Parallaxer("ParallaxWrapper", ".ParallaxContainer", ".ParallaxElement");
}

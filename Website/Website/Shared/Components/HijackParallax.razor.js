class Parallaxer
{
    constructor(inWrapperID = "ParallaxWrapper", inParallaxContainerClass = ".ParallaxContainer", inTargetClass = ".ParallaxElement", inWrapperSpeed = .08, inTargetSpeed = .02, inTargetPercentage = 0.1)
    {
        this.WrapperID = inWrapperID;
        this.ParallaxContainerClass = inParallaxContainerClass;
        this.TargetClass = inTargetClass;
		this.WrapperSpeed = inWrapperSpeed;
        this.TargetSpeed = inTargetSpeed;
        this.TargetPercentage = inTargetPercentage;

        this.Init();
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
        this.WindowHeight = window.clientHeight; // ?
        this.WapperOffset = 0; // how offset it is from the top

        this.RAF = window.requestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.msRequestAnimationFrame;
        window.requestAnimationFrame = requestAnimationFrame; // ?
        this.CAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;



        document.body.style.height = `${this.Wrapper.clientHeight}px`; // document body will determine the height/scrolling of our page
        //this.attachEvent(); // something about resizing

        // ---------- BEGIN Init things ----------
        this.Wrapper.style.width = '100%';
        this.Wrapper.style.position = 'fixed';

        for (let i = 0; i < this.ParallaxContainers.length; i++)
        {
            const ParallaxContainer = this.ParallaxContainers[i];

            const OwnedParallaxElements = ImmediateChildrenQuerySelectAll(ParallaxContainer, function (elem) { return elem.matches(".ParallaxElement"); }); // get all ParallaxElements that are immediate decendents of this ParallaxContainter
            OwnedParallaxElements.forEach((ParallaxElement) =>
            {
                let dataParallaxSpeed = ParallaxElement.dataset.parallaxspeed;
                dataParallaxSpeed = dataParallaxSpeed ? dataParallaxSpeed : .5; // if not specified, give default value of .5
                const speedMultiplier = 1 - dataParallaxSpeed;
                ParallaxElement.speedMultiplier = speedMultiplier;
            });

            ParallaxContainer.OwnedParallaxElements = OwnedParallaxElements;
        }
        // ---------- END Init things ----------

        // Now lets animate
        this.Window = window; // store our window so we can make call to raf
        this.RAF.call(this.Window, this.Tick.bind(this));
    }

    Tick(timestamp)
    {
        const documentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        // Scroll the wrapper (whole page)
        this.WapperOffset += (documentScrollTop - this.WapperOffset) * this.WrapperSpeed;
        const ScrollAmt = Math.round(this.WapperOffset * 100) / 100;
        this.Wrapper.style.transform = `translate3d(0, ${-ScrollAmt}px, 0)`;

        // Offset the parallax elements
        for (let i = 0; i < this.ParallaxContainers.length; i++)
        {
            const ParallaxContainer = this.ParallaxContainers[i];

            const ScrollAmtToBotomOfViewport = (ScrollAmt + this.Window.innerHeight);                                   // get scroll distance to bottom of viewport.
            const elPositionRelativeToBottomOfViewport = (ScrollAmtToBotomOfViewport - ParallaxContainer.offsetTop);    // get element's position relative to bottom of viewport.
            const elTravelDistance = (this.Window.innerHeight + ParallaxContainer.offsetHeight);
            const currentProgress = (elPositionRelativeToBottomOfViewport / elTravelDistance);                          // calculate tween progresss.

            for (let j = 0; j < ParallaxContainer.OwnedParallaxElements.length; j++)
            {
                const ParallaxElement = ParallaxContainer.OwnedParallaxElements[j];

                const A = -this.Window.innerHeight * ParallaxElement.speedMultiplier;
                const B = this.Window.innerHeight * ParallaxElement.speedMultiplier;
                const amt = Lerp(A, B, currentProgress);
                ParallaxElement.style.transform = `translate3d(0, ${amt}px, 0)`;
            }
        }

        this.RAF.call(this.Window, this.Tick.bind(this));
    }

}

export function OnAfterRenderAsync()
{
    const p = new Parallaxer("ParallaxWrapper", ".ParallaxContainer", ".ParallaxElement", .08);
}

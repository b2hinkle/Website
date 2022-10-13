class Parallaxer
{
    constructor()
    {
        // Defaults (maybe make way to override defaults in future)
        this.WrapperID = "ParallaxWrapper";
        this.TargetClass = ".ParallaxElement";
		this.WrapperSpeed = 0.08;
		this.TargetSpeed = 0.02;
        this.TargetPercentage = 0.1;

        this.Wrapper = document.getElementById(this.WrapperID);
        this.TargetElements = document.querySelectorAll(this.TargetClass);
        this.WindowHeight = window.clientHeight; // ?
        this.WapperOffset = 0;

        this.RAF = window.requestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.oRequestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.msRequestAnimationFrame;
        //window.requestAnimationFrame = requestAnimationFrame; // ?
        this.CAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;



        document.body.style.height = `${this.Wrapper.clientHeight}px`; // document body will determine the height/scrolling of our page
        //this.attachEvent(); // something about resizing

        // ---------- BEGIN Init things ----------
        this.Wrapper.style.width = '100%';
        this.Wrapper.style.position = 'fixed';

        // Build our Targets array which stores the targets along with their attributes set in HTML
        this.Targets = [];
        const TargetElementsLength = this.TargetElements.length;
        for (let i = 0; i < TargetElementsLength; i++)
        {
            const TargetEl = this.TargetElements[i];
            const offset = TargetEl.getAttribute('data-offset');
            const speedX = TargetEl.getAttribute('data-speed-x');
            const speedY = TargetEl.getAttribute('data-speed-Y');
            const percentage = TargetEl.getAttribute('data-percentage');
            const horizontal = TargetEl.getAttribute('data-horizontal');

            this.Targets.push(
            {
                elm: TargetEl,
                offset: offset ? offset : 0,
                horizontal: horizontal ? horizontal : 0,
                top: 0,
                left: 0,
                speedX: speedX ? speedX : 1,
                speedY: speedY ? speedY : 1,
                percentage: percentage ? percentage : 0
            });

        }
        // ---------- END Init things ----------

        // Now lets animate
        this.Window = window; // store our window so we can make call to raf
        this.RAF.call(this.Window, this.Tick.bind(this));




    }

    Tick(timestamp)
    {
        const documentScrollTop = document.documentElement.scrollTop || document.body.scrollTop;

        // Scroll wrapper
        this.WapperOffset += (documentScrollTop - this.WapperOffset) * this.WrapperSpeed;
        this.Wrapper.style.transform = `translate3d(0, ${Math.round(-this.WapperOffset * 100) / 100}px, 0)`;
        //this.Wrapper.style.transform = `translate3d(' + 0 + ',' + Math.round(-this.WapperOffset * 100) / 100 + 'px ,' + 0 + ')`;

        // Parallax targets
        /*for (var i = 0; i < this.Targets.length; i++)
        {
            this.targetsUpdate(this.Targets[i]);
        }*/

        this.RAF.call(this.Window, this.Tick.bind(this));
    }

}

export function OnAfterRenderAsync()
{
    const p = new Parallaxer();
}

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

        this.RAF = window.requestAnimationFrame
            || window.mozRequestAnimationFrame
            || window.webkitRequestAnimationFrame
            || window.msRequestAnimationFrame;
        //window.requestAnimationFrame = requestAnimationFrame; // ?
        this.CAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


        // Gather what we know about our page
        this.Wrapper = document.getElementById(this.WrapperID);
        this.Targets = document.querySelectorAll(TargetClass);

        document.body.style.height = `${this.Wrapper.clientHeight}px`; // document body will determine the height/scrolling of our page
        

    }


    calcArea()
    {
        
    }
}

export function OnAfterRenderAsync()
{
    const p = new Parallaxer();
}

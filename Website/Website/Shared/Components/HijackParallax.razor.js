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
        //window.requestAnimationFrame = requestAnimationFrame; // not sure reasoning behind LuxyJS doing this
        this.CAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;


        this.Wrapper = document.getElementById(this.WrapperID);

    }


    calcArea()
    {
        
    }
}

export function OnAfterRenderAsync()
{
    const p = new Parallaxer();
}

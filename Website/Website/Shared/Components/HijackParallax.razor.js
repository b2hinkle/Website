class Parallaxer
{
    constructor()
    {
        this.wrapper = "#ParallaxWrapper";
        this.targets = ".ParallaxElement";
		this.wrapperSpeed = 0.08;
		this.targetSpeed = 0.02;
        this.targetPercentage = 0.1;


    }


    calcArea()
    {
        
    }
}

export function OnAfterRenderAsync()
{
    
    let P = new Parallaxer();

}

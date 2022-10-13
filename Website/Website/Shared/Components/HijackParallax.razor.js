﻿class Parallaxer
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
        this.TargetElements = document.querySelectorAll(this.TargetClass);

        document.body.style.height = `${this.Wrapper.clientHeight}px`; // document body will determine the height/scrolling of our page
        this.WindowHeight = window.clientHeight; // ?
        //this.attachEvent(); // something about resizing

        // Give wrapper CSS styles
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

            // Now lets animate the targets
            //this.RAF();
        }



    }

}

export function OnAfterRenderAsync()
{
    const p = new Parallaxer();
}

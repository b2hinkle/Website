﻿export function OnAfterRenderAsync()
{
    /*gsap.registerPlugin(ScrollTrigger); // still works without (maybe they made it not necissary anymore?) */ // commented out since it makes life easier not worying about who's going to register (no one will lol)
    gsap.utils.toArray(".ParallaxContainer").forEach((ParallaxContainer, i) => {
        const ParallaxElements = ImmediateChildrenQuerySelectAll(ParallaxContainer, function (elem) { return elem.matches(".ParallaxElement"); }); // get all ParallaxElements that are immediate decendents of this ParallaxContainter
        ParallaxElements.forEach((ParallaxElement) =>
        {
            const dataParallaxSpeed = ParallaxElement.dataset.parallaxspeed;
            const speedMultiplier = dataParallaxSpeed ? 1 - dataParallaxSpeed : .5; // if not specified, give default value of .5

            // use function-based values in order to keep things responsive
            gsap.fromTo(ParallaxElement, {
                y: () => `${-window.innerHeight * speedMultiplier}px`
            }, {
                y: () => `${window.innerHeight * speedMultiplier}px`,
                ease: "none",
                scrollTrigger: {
                    trigger: ParallaxContainer,
                    start: () => "top bottom",
                    end: "bottom top",
                    scrub: true
                }
            });
        });
    });
}

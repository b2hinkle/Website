export function OnAfterRenderAsync()
{
// BEGIN CSS styling
    /*
     * Eliminate unnecissary scrollbars to keep page predictible
    */
    const htmlEl = document.documentElement;
    htmlEl.style.overflowX = "hidden";
    const bodyEl = document.body;
    bodyEl.style.overflow = "hidden";
// END CSS styling

    /*gsap.registerPlugin(ScrollTrigger); // still works without (maybe they made it not necissary anymore?) */ // commented out since it makes life easier not worying about who's going to register (no one will lol)
    gsap.utils.toArray(".ParallaxContainer").forEach((ParallaxContainer, i) => {
        const ParallaxElements = ImmediateChildrenQuerySelectAll(ParallaxContainer, function (elem) { return elem.matches(".ParallaxElement"); }); // get all ParallaxElements that are immediate decendents of this ParallaxContainter
        ParallaxElements.forEach((ParallaxElement) =>
        {
            let dataParallaxSpeed = ParallaxElement.dataset.parallaxspeed;
            dataParallaxSpeed = dataParallaxSpeed ? dataParallaxSpeed : .5; // if not specified, give default value of .5
            const speedMultiplier = 1 - dataParallaxSpeed;

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

export function OnAfterRenderAsync()
{
    sal({
        once: false,
    });


    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".ParallaxContainer").forEach((ParallaxContainer, i) => {

        const ParallaxElements = ImmediateChildrenQuerySelectAll(ParallaxContainer, function (elem) { return elem.matches(".ParallaxElement"); }); // get all ParallaxElements that are immediate decendents of this ParallaxContainter
        ParallaxElements.forEach((ParallaxElement) =>
        {
            const ParallaxSpeed = 1 - ParallaxElement.dataset.parallaxspeed;
            // use function-based values in order to keep things responsive
            gsap.fromTo(ParallaxElement, {
                y: () => `${-window.innerHeight * ParallaxSpeed}px`
            }, {
                y: () => `${window.innerHeight * ParallaxSpeed}px`,
                ease: "none",
                scrollTrigger: {
                    trigger: ParallaxContainer,
                    start: () => "top bottom",
                    end: "bottom top",
                    scrub: true,
                    invalidateOnRefresh: true // to make it responsive
                }
            });
        });
    });
}

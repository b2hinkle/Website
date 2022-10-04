export function OnAfterRenderAsync()
{
    sal({
        once: false,
    });


    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray(".ParallaxContainer").forEach((section, i) => {
        const ParallaxElement = section.querySelector(".ParallaxElement");

        const ParallaxSpeed = ParallaxElement.dataset.parallaxspeed;
        console.log(ParallaxSpeed);
        // use function-based values in order to keep things responsive
        gsap.fromTo(ParallaxElement, {
            y: () => `${-window.innerHeight * ParallaxSpeed}px`
        }, {
            y: () => `${window.innerHeight * ParallaxSpeed}px`,
            ease: "none",
            scrollTrigger: {
                trigger: section,
                start: () => "top bottom",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true // to make it responsive
            }
        });

    });
}

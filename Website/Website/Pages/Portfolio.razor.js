export function OnAfterRenderAsync()
{
    gsap.registerPlugin(ScrollTrigger);

    let getRatio = el => window.innerHeight / (window.innerHeight + el.offsetHeight);



    gsap.utils.toArray("section").forEach((section, i) => {
        section.ParallaxElement = section.querySelector(".ParallaxElement");


        // use function-based values in order to keep things responsive
        gsap.fromTo(section.ParallaxElement, {
            y: () => `${-window.innerHeight * getRatio(section)}px`
        }, {
            y: () => `${window.innerHeight * (1 - getRatio(section))}px`,
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

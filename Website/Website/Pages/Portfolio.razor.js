export function OnAfterRenderAsync()
{
    sal({
        once: false,
    });


    gsap.registerPlugin(ScrollTrigger);
    /*
    // apply parallax effect to any element with a data-speed attribute
    gsap.to("[data-speed]", {
        y: (i, el) => (1 - parseFloat(el.getAttribute("data-speed"))) * ScrollTrigger.maxScroll(window),
        ease: "none",
        scrollTrigger: {
            start: 0,
            end: "max",
            invalidateOnRefresh: true,
            scrub: 0
        }
    });
    */



    gsap.utils.toArray(".ParallaxElement").forEach((entry, i) => {
        // the first image (i === 0) should be handled differently because it should start at the very top.
        // use function-based values in order to keep things responsive
        gsap.fromTo(entry,
            { y: () => i ? `${-window.innerHeight * getRatio(entry)}px` : "0px" },
            { y: () => `${window.innerHeight * (1 - getRatio(entry))}px`, ease: "none",
                scrollTrigger: {
                trigger: entry,
                start: () => i ? "top bottom" : "top top",
                end: "bottom top",
                scrub: true,
                invalidateOnRefresh: true // to make it responsive
            }
        });

    });
}

function getRatio(el)
{
    return window.innerHeight / (window.innerHeight + el.offsetHeight);
}

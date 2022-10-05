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



    // Build our map to track all our animations
    const AnimationMap = new Map();
    document.querySelectorAll(".ParallaxContainer").forEach(ParallaxContainer => {
        const ParallaxElements = ImmediateChildrenQuerySelectAll(ParallaxContainer, function (elem) { return elem.matches(".ParallaxElement"); }); // get all ParallaxElements that are immediate decendents of this ParallaxContainter
        let ParallaxAnimations = new Array();
        ParallaxElements.forEach((ParallaxElement) => {

            let dataParallaxSpeed = ParallaxElement.dataset.parallaxspeed;
            dataParallaxSpeed = dataParallaxSpeed ? dataParallaxSpeed : .5; // if not specified, give default value of .5
            const speedMultiplier = 1 - dataParallaxSpeed;

            let animation = anime({
                targets: ParallaxElement,
                translateY: [-window.innerHeight * speedMultiplier, window.innerHeight * speedMultiplier],
                easing: "linear",
                autoplay: false,
                loop: false
            })
            ParallaxAnimations.push(animation);
        });

        AnimationMap.set(ParallaxContainer, ParallaxAnimations);
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px',
        threshold: 0
    };
    let ParallaxContainerObserver = new IntersectionObserver(entries =>
    {
        entries.forEach((entry) =>
        {
            if (entry.intersectionRatio > 0) // is intersecting
            {
                window.requestAnimationFrame(function Tick(timestamp)
                {
                    if (entry.intersectionRatio <= 0) // not intersecting
                    {
                        return;
                    }

                    // Get scroll distance to bottom of viewport.
                    const scrollPosition = (window.scrollY + window.innerHeight);
                    // Get element's position relative to bottom of viewport.
                    const elPosition = (scrollPosition - entry.target.offsetTop);
                    // Set desired duration.
                    const durationDistance = (window.innerHeight + entry.target.offsetHeight);
                    // Calculate tween progresss.
                    const currentProgress = (elPosition / durationDistance);
                    let Animations = AnimationMap.get(entry.target);
                    Animations.forEach(ParallaxAnimation =>
                    {
                        ParallaxAnimation.seek(currentProgress * ParallaxAnimation.duration);
                    });
                    console.log(currentProgress);
                    requestAnimationFrame(Tick);
                });
            }
        }),
        observerOptions
    });

    // Start observing the parallax containers
    AnimationMap.forEach((Animations, ParallaxContainer) =>
    {
        ParallaxContainerObserver.observe(ParallaxContainer);
    })





    //const ParallaxElements = ImmediateChildrenQuerySelectAll(ParallaxContainer, function (elem) { return elem.matches(".ParallaxElement"); }); // get all ParallaxElements that are immediate decendents of this ParallaxContainter
}

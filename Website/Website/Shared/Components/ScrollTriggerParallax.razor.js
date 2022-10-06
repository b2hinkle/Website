const AnimationMap = new Map();

export function OnAfterRenderAsync()
{
// BEGIN CSS styling
    /*
     * Eliminate unnecissary scrollbars to keep page predictible
    */
    const htmlEl = document.documentElement;
    htmlEl.style.overflowX = "hidden";
    htmlEl.style.padding = "0px";
    htmlEl.style.margin = "0px";
    const bodyEl = document.body;
    bodyEl.style.overflow = "hidden";
    bodyEl.style.padding = "0px";
    bodyEl.style.margin = "0px";
// END CSS styling



    // Build our map to track all our animations
    document.querySelectorAll(".ParallaxContainer").forEach(ParallaxContainer => {
        const ParallaxElements = ImmediateChildrenQuerySelectAll(ParallaxContainer, function (elem) { return elem.matches(".ParallaxElement"); }); // get all ParallaxElements that are immediate decendents of this ParallaxContainter
        let ParallaxAnimations = new Array();
        ParallaxElements.forEach((ParallaxElement) => {

            let dataParallaxSpeed = ParallaxElement.dataset.parallaxspeed;
            dataParallaxSpeed = dataParallaxSpeed ? dataParallaxSpeed : .5; // if not specified, give default value of .5
            const speedMultiplier = 1 - dataParallaxSpeed;

            const animation = anime({
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
    const ParallaxContainerObserver = new IntersectionObserver(entries =>
    {
        entries.forEach((entry) =>
        {
            if (entry.isIntersecting == false)
            {
                window.cancelAnimationFrame(entry.target.ParallaxTickerID);
                entry.target.ParallaxTickerID = undefined; // to indicate it no longer has a ticker
                return;
            }

            entry.target.ParallaxTickerID = window.requestAnimationFrame(function Tick(timestamp)
            {
                const scrollPosition = (window.scrollY + window.innerHeight);               // get scroll distance to bottom of viewport.
                const elPosition = (scrollPosition - entry.target.offsetTop);               // get element's position relative to bottom of viewport.
                const durationDistance = (window.innerHeight + entry.target.offsetHeight);  // set desired duration.
                const currentProgress = (elPosition / durationDistance);                    // calculate tween progresss.
                const Animations = AnimationMap.get(entry.target);
                Animations.forEach(ParallaxAnimation =>
                {
                    ParallaxAnimation.seek(currentProgress * ParallaxAnimation.duration);
                });

                console.log(entry.target.tagName);
                entry.target.ParallaxTickerID = requestAnimationFrame(Tick);
            });
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

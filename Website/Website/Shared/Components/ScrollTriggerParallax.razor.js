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


    const ParallaxContainerElements = document.querySelectorAll(".ParallaxContainer");

    // Make our parallax containers responsible for their parallax animations
    ParallaxContainerElements.forEach(ParallaxContainer => {
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

        ParallaxContainer.OwnedParallaxAnimations = ParallaxAnimations;
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
            const ParallaxContainerEl = entry.target;
            if (entry.isIntersecting == false)
            {
                window.cancelAnimationFrame(ParallaxContainerEl.ParallaxTickerID);
                ParallaxContainerEl.ParallaxTickerID = undefined;
                return;
            }

            ParallaxContainerEl.ParallaxTickerID = window.requestAnimationFrame(function Tick(timestamp)
            {
                const scrollPosition = (window.scrollY + window.innerHeight);               // get scroll distance to bottom of viewport.
                const elPosition = (scrollPosition - ParallaxContainerEl.offsetTop);               // get element's position relative to bottom of viewport.
                const durationDistance = (window.innerHeight + ParallaxContainerEl.offsetHeight);  // set desired duration.
                const currentProgress = (elPosition / durationDistance);                    // calculate tween progresss.

                ParallaxContainerEl.OwnedParallaxAnimations.forEach(ParallaxAnimation =>
                {
                    ParallaxAnimation.seek(currentProgress * ParallaxAnimation.duration);
                });

                console.log(ParallaxContainerEl.tagName);
                ParallaxContainerEl.ParallaxTickerID = requestAnimationFrame(Tick);
            });
        }),
        observerOptions
    });

    // Start observing the parallax containers
    ParallaxContainerElements.forEach((ParallaxContainer) =>
    {
        ParallaxContainerObserver.observe(ParallaxContainer);
    })





    //const ParallaxElements = ImmediateChildrenQuerySelectAll(ParallaxContainer, function (elem) { return elem.matches(".ParallaxElement"); }); // get all ParallaxElements that are immediate decendents of this ParallaxContainter
}

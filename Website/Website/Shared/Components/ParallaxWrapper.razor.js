function HideParallaxElementOverflow(inParallaxContainer, inParallaxElement)
{
    let OverflowBottom = (inParallaxElement.getBoundingClientRect().bottom - inParallaxContainer.getBoundingClientRect().bottom);
    let ClipBottom = inParallaxElement.getBoundingClientRect().height - OverflowBottom;
    inParallaxElement.style.setProperty("--ClipBottom", `${ClipBottom}px`);

    let OverflowTop = (inParallaxContainer.getBoundingClientRect().top - inParallaxElement.getBoundingClientRect().top);
    let ClipTop = OverflowTop;
    inParallaxElement.style.setProperty("--ClipTop", `${ClipTop}px`);

    let OverflowLeft = (inParallaxContainer.getBoundingClientRect().left - inParallaxElement.getBoundingClientRect().left);
    let ClipLeft = OverflowLeft;
    inParallaxElement.style.setProperty("--ClipLeft", `${ClipLeft}px`);

    let OverflowRight = (inParallaxElement.getBoundingClientRect().right - inParallaxContainer.getBoundingClientRect().right);
    let ClipRight = inParallaxElement.getBoundingClientRect().width - OverflowRight;
    inParallaxElement.style.setProperty("--ClipRight", `${ClipRight}px`);
}

export function OnAfterRenderAsync()
{
// BEGIN CSS styling
    /*
    * HTML and Body elements can cause an extra scrollbar, interfiering with our parallax setup.
    * I have noticed that the HTML vertical scrolling is also used for the mobile browser's url/search bar to go away and come back. If you don't allow vertical scrolling, then the bar is always there.
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



    const ParallaxContainerements = document.querySelectorAll(".ParallaxContainer");

    // Make our parallax containers aware of their parallax elements
    ParallaxContainerements.forEach(ParallaxContainer =>
    {
        const ImmediateParallaxElementChildren = ImmediateChildrenQuerySelectAll(ParallaxContainer, function (elem) { return elem.matches(".ParallaxElement"); }); // get all ParallaxElements that are immediate decendents of this ParallaxContainter
        ImmediateParallaxElementChildren.forEach(ParallaxElement =>
        {
            HideParallaxElementOverflow(ParallaxContainer, ParallaxElement);
        })
        ParallaxContainer.OwnedParallaxElements = ImmediateParallaxElementChildren;
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
            const ParallaxContainer = entry.target;
            if (entry.isIntersecting == false)
            {
                window.cancelAnimationFrame(ParallaxContainer.ClippingTickerID);
                ParallaxContainer.ClippingTickerID = undefined;
                return;
            }

            ParallaxContainer.ClippingTickerID = window.requestAnimationFrame(function Tick(timestamp)
            {
                const OwnedParallaxElements = ParallaxContainer.OwnedParallaxElements;
                OwnedParallaxElements.forEach(ParallaxElement =>
                {
                    HideParallaxElementOverflow(ParallaxContainer, ParallaxElement);
                });
                


                //console.log(ParallaxContainer.tagName);
                ParallaxContainer.ClippingTickerID = requestAnimationFrame(Tick);
            });
        }),
            observerOptions
    });

    // Start observing the parallax containers
    ParallaxContainerements.forEach((ParallaxContainer) => {
        ParallaxContainerObserver.observe(ParallaxContainer);
    })
}





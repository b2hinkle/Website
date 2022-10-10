function HideParallaxElementOverflow(inParallaxContainer, inParallaxElement)
{
    const ParallaxContainerBoundingClientRect = inParallaxContainer.getBoundingClientRect();

    const OverflowBottom = inParallaxElement.getBoundingClientRect().bottom - ParallaxContainerBoundingClientRect.bottom;
    const ClipBottom = inParallaxElement.getBoundingClientRect().height - OverflowBottom;

    const OverflowTop = ParallaxContainerBoundingClientRect.top - inParallaxElement.getBoundingClientRect().top;
    const ClipTop = OverflowTop;

    const OverflowLeft = ParallaxContainerBoundingClientRect.left - inParallaxElement.getBoundingClientRect().left;
    const ClipLeft = OverflowLeft;

    const OverflowRight = inParallaxElement.getBoundingClientRect().right - ParallaxContainerBoundingClientRect.right;
    const ClipRight = inParallaxElement.getBoundingClientRect().width - OverflowRight;

    inParallaxElement.style.clipPath = `polygon(${ClipLeft}px ${ClipTop}px, ${ClipRight}px ${ClipTop}px, ${ClipRight}px ${ClipBottom}px, ${ClipLeft}px ${ClipBottom}px)`;
}

const cssPerspectiveValue = getCSSCustomPropertyValue("--PerspectiveValue", document.getElementById("ParallaxWrapper"), "float");
function CalculateScaleThatCountersDepth(inPerspective, inZTransform) { return 1 + (-inZTransform / inPerspective); }

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
            // Perform the 3D transform
            let dataDepth = ParallaxElement.dataset.depth;
            dataDepth = dataDepth ? dataDepth : 0;  // if not specified, give default value of 0
            dataDepth = -dataDepth;                 // make positive entered values move element in our fwd facing direction (more user friendly)
            const Scale = CalculateScaleThatCountersDepth(cssPerspectiveValue, dataDepth);
            ParallaxElement.style.transform = `translateZ(${dataDepth}px) scale(${Scale})`;

            // Hide any unwanted overflow
            HideParallaxElementOverflow(ParallaxContainer, ParallaxElement);
        })
        ParallaxContainer.OwnedParallaxElements = ImmediateParallaxElementChildren;
    });




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
                    HideParallaxElementOverflow(ParallaxContainer, ParallaxElement);    // hide any unwanted overflow
                });
                


                //console.log(ParallaxContainer.tagName);
                ParallaxContainer.ClippingTickerID = requestAnimationFrame(Tick);
            });
        }),
        { root: null, rootMargin: '0px 0px', threshold: 0 } // observer options
    });

    ParallaxContainerements.forEach((ParallaxContainer) => { ParallaxContainerObserver.observe(ParallaxContainer); })   // start observing the parallax containers
}





/*
*   Issues: 
 *   - Clipping lags behind when middle click scrolling (on slow computers)
 *   - Teleport scrolling (dragging bar and then moving mouse far away from the bar to make it teleport) can cause the clip path to not update
 *   - Long load times for the page exposes the "meant to be clipped" parts of the parallax elements
 *   
 *   - HideParallaxElementOverflow calculation only works for parallax elements that use data-scale-to-original-appearance (calculation wasn't created with that in mind)
 *   - It seems the document's scrolling goes really far if you move the element on the depth too far
*/

function HideParallaxElementOverflow(inContainer, inEl, inPerspectiveValue, inParallaxWrapper)
{
    // Calculate speed at which the clipPath should scroll
    const ZTransform = parseFloat(inEl.dataset.depth);
    const depthRatio = ZTransform / (inPerspectiveValue + ZTransform);
    const slowerScrollTop = inParallaxWrapper.scrollTop * depthRatio;
    const slowerScrollLeft = inParallaxWrapper.scrollLeft * depthRatio;

    const ClipBottom = inEl.WorldBottom - slowerScrollTop;
    const ClipTop = inEl.WorldTop - slowerScrollTop;
    const ClipLeft = inEl.WorldLeft - slowerScrollLeft;
    const ClipRight = inEl.WorldRight - slowerScrollLeft;

    inEl.style.clipPath = `polygon(${ClipLeft}px ${ClipTop}px, ${ClipRight}px ${ClipTop}px, ${ClipRight}px ${ClipBottom}px, ${ClipLeft}px ${ClipBottom}px)`;
}

function HideAllParallaxElementOverflows(inParallaxContainers, inPerspectiveValue, inParallaxWrapper) // used when forcing an update
{
    inParallaxContainers.forEach(ParallaxContainer =>
    {
        const OwnedParallaxElements = ParallaxContainer.OwnedParallaxElements;
        OwnedParallaxElements.forEach(ParallaxElement =>
        {
            HideParallaxElementOverflow(ParallaxContainer, ParallaxElement, inPerspectiveValue, inParallaxWrapper);
        });
    });
}

function CSS3DPropertiesSupported(inParallaxWrapperEl)
{
    return getCSSCustomPropertyValue("--CSSParallaxStylesActive", inParallaxWrapperEl, "bool");
}
function JSScriptSupported() // ensures all features we used are supported
{
    return document.getElementById 
        && Element.prototype.getBoundingClientRect 
        && document.querySelectorAll
        && Element.prototype.matches
        && IntersectionObserver
        && window.cancelAnimationFrame
        && window.requestAnimationFrame
        && getComputedStyle;
}

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

    const ParallaxWrapper = document.getElementById("ParallaxWrapper");
    const ParallaxContainers = document.querySelectorAll(".ParallaxContainer");
    const perspectiveValue = getCSSCustomPropertyValue("--PerspectiveValue", document.getElementById("ParallaxWrapper"), "float");

    // Don't proceed if anything isn't supported
    if (CSS3DPropertiesSupported(document.getElementById("ParallaxWrapper")) == false)
    {
        return; // don't do parallax logic if CSS parallax styles aren't applied/supported
    }
    if (JSScriptSupported() == false)
    {
        return; // don't do parallax logic if our script isn't supported
    }


    // Make our parallax containers aware of their parallax elements
    ParallaxContainers.forEach(ParallaxContainer =>
    {
        const ImmediateParallaxElementChildren = ImmediateChildrenQuerySelectAll(ParallaxContainer, function (elem) { return elem.matches(".ParallaxElement"); }); // get all ParallaxElements that are immediate decendents of this ParallaxContainter
        ImmediateParallaxElementChildren.forEach(ParallaxElement =>
        {
            // Perform the 3D transform
            let dataDepth = ParallaxElement.dataset.depth;
            dataDepth = dataDepth ? dataDepth : 0;  // if not specified, give default value of 0
            const ZTransform = -dataDepth;                 // make positive entered values move element in our fwd facing direction (more user friendly)
            let Scale = 1;
            if ("scaleToOriginalAppearance" in ParallaxElement.dataset)
            {
                Scale = CalculateScaleThatCountersDepth(perspectiveValue, ZTransform);
            }
            ParallaxElement.style.transform = `translateZ(${ZTransform}px) scale(${Scale})`;

            // Calculate world positions for the elements
            const ContainerBoundingClientRect = ParallaxContainer.getBoundingClientRect();
            const ElBoundingClientRect = ParallaxElement.getBoundingClientRect();

            const OverflowBottom = ElBoundingClientRect.bottom - ContainerBoundingClientRect.bottom;
            ParallaxElement.WorldBottom = ElBoundingClientRect.height - OverflowBottom;

            const OverflowTop = ContainerBoundingClientRect.top - ElBoundingClientRect.top;
            ParallaxElement.WorldTop = OverflowTop;

            const OverflowLeft = ContainerBoundingClientRect.left - ElBoundingClientRect.left;
            ParallaxElement.WorldLeft = OverflowLeft;

            const OverflowRight = ElBoundingClientRect.right - ContainerBoundingClientRect.right;
            ParallaxElement.WorldRight = ElBoundingClientRect.width - OverflowRight;


            // Hide any unwanted overflow
            HideParallaxElementOverflow(ParallaxContainer, ParallaxElement, perspectiveValue, ParallaxWrapper);
        })
        ParallaxContainer.OwnedParallaxElements = ImmediateParallaxElementChildren;
    });

    $(window).resize(function ()
    {
        HideAllParallaxElementOverflows(ParallaxContainers, perspectiveValue, ParallaxWrapper);
    });


    let RAF = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
    let CAF = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

    const ParallaxContainerObserver = new IntersectionObserver(entries =>
    {
        entries.forEach((entry) =>
        {
            const ParallaxContainer = entry.target;
            if (entry.isIntersecting == false)
            {
                CAF(ParallaxContainer.ClippingTickerID);
                ParallaxContainer.ClippingTickerID = undefined;
                return;
            }


            ParallaxContainer.ClippingTickerID = RAF(function Tick(timestamp)
            {
                const OwnedParallaxElements = ParallaxContainer.OwnedParallaxElements;
                OwnedParallaxElements.forEach(ParallaxElement =>
                {
                    HideParallaxElementOverflow(ParallaxContainer, ParallaxElement, perspectiveValue, ParallaxWrapper);    // hide any unwanted overflow
                });
                


                //console.log(ParallaxContainer.tagName);
                ParallaxContainer.ClippingTickerID = RAF(Tick);
            });
        }),
        { root: null, rootMargin: '0px 0px', threshold: 0 } // observer options
    });

    ParallaxContainers.forEach((ParallaxContainer) => { ParallaxContainerObserver.observe(ParallaxContainer); });   // start observing the parallax containers
}





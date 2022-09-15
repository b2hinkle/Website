const BGElement = document.getElementById("BG"); /* BGElement element is currently hardcoded. Need to find a way to make this generic. Maybe a list of elements? */
const ParallaxWrapperElement = document.getElementById("ParallaxWrapper");
const PageContentElement = document.getElementById("PageContent");

// Do the CSS's media and support queries for parallax pass?
function CSSParallaxStylesActive() { return getCSSCustomPropertyValue("--ParallaxSupported", ParallaxWrapperElement, "bool"); }

export function OnAfterRenderAsync()
{
// BEGIN CSS styling
    /*
    * HTML and Body elements can cause an extra scrollbar, interfiering with our parallax setup.
    * I have noticed that the HTML vertical scrolling is also used for the mobile browser's url/search bar to go away and come back. If you don't allow vertical scrolling, then the bar is always there.
    */
    const htmlEl = document.documentElement;
    htmlEl.style.overflowX = "hidden";
    const bodyEl = document.body;
    bodyEl.style.margin = "0";
    bodyEl.style.overflow = "hidden";
// END CSS styling


    UpdateBGParallaxElement();
    $(window).resize(function () // also update whenever zoom/resize of window occurs
    {
        UpdateBGParallaxElement();
    });
}

function UpdateBGParallaxElement()
{
    if (!SupportsCustomCSSProperties() || !CSSParallaxStylesActive())   // TODO: Repetitive check (already does in UpdateParallaxElement()). Cleanup
    {
        return;
    }

    const cssBgZTransform = getCSSCustomPropertyValue("--bgZTransform", BGElement, "float");
    UpdateParallaxElement(BGElement, cssBgZTransform, false);
}

function vhToPx(inVh)
{
    return (ParallaxWrapperElement.clientHeight / (100 / inVh));
}
function vwToPx(inVw)
{
    return (ParallaxWrapperElement.clientWidth / (100 / inVw));
}

/*
 * Counter's an element's depth by scaling up to perfectly fit PageContentElement. Good for page backgrounds.
 * Only limitation you may encounter is if you need to preserve aspect ratio (see comment within the inPreserveAspectRatio conditional block)
 */
function UpdateParallaxElement(inElement, inZTransform, inPreserveAspectRatio = true)
{
    if (!SupportsCustomCSSProperties() || !CSSParallaxStylesActive())
    {
        return; // save processing if we aren't a parallax page right now
    }

    const heightRatio = vhToPx(100) / PageContentElement.clientHeight; // how many "PageContent" heights can we fit into the height of the viewport
    const widthRatio = vwToPx(100) / PageContentElement.clientWidth;

    /* 
     * The formula that calculates the scale to counter the depth. "heightRatio" and "widthRatio" are variables added into the formula by me since I have the transform and perspective origin at the bottom.
     */
    const cssPerspectiveValue = getCSSCustomPropertyValue("--perspectiveValue", ParallaxWrapperElement, "float");
    const heightScale = 1 + ((-inZTransform * heightRatio) / cssPerspectiveValue);
    const widthScale = 1 + ((-inZTransform * widthRatio) / cssPerspectiveValue);


    if (inPreserveAspectRatio)
    {
        /*
         * If you are preserving aspect ratio, you either choose the smaller scale or the larger scale value.
         * Using smaller scale value will ensure that it stays centered with the page's content, but it won't cover whole screen if that's what you want.
         * Using larger scale value will ensure that the whole screen is covered, but then the element won't be centered with the page's content.
         * For now I'm only providing the smaller scale approach b/c I'm lazy, but larger scale one can be implemented quickly if needed.
         */
        const smallerScaleValue = Math.min(widthScale, heightScale); // we will choose the smallest scale value, otherwise it won't be centered to the page.
        // Update the css variable
        inElement.style.setProperty("--widthScale", `${smallerScaleValue}`);
        inElement.style.setProperty("--heightScale", `${smallerScaleValue}`);
        return;
    }

    // Update the css variable
    inElement.style.setProperty("--widthScale", `${widthScale}`);
    inElement.style.setProperty("--heightScale", `${heightScale}`);
}






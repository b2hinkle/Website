const BGElement = document.getElementById("BG"); /* BGElement element is currently hardcoded. Need to find a way to make this generic. Maybe a list of elements? */
const ParallaxWrapperElement = document.getElementById("ParallaxWrapper");
const PageContentElement = document.getElementById("PageContent");
let px_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;  // This is the zoom percentage. Can also use to convert pixel units.... (device pixel/css pixel)

/* BEGIN variables */
const perspectiveValue = 300;
let bgZTransform = -300;
export function SetBgZTransform(inBGZTransform)
{
    bgZTransform = inBGZTransform;
}
/* END variables */


function vhToPx(inVh)
{
    return (ParallaxWrapperElement.clientHeight / (100 / inVh));
}
function vwToPx(inVw)
{
    return (ParallaxWrapperElement.clientWidth / (100 / inVw));
}

// JQuery event detecting zoom/resizing of the window
$(window).resize(function ()
{
    const newPx_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
    if (px_ratio != newPx_ratio)
    {
        px_ratio = newPx_ratio;
        // zooming

    }
    else
    {
        // just resizing

    }



    UpdateParallaxBGElement();
});


export function OnAfterRenderAsync()
{
    /*
     * HTML and Body elements can cause an extra scrollbar, interfiering with our parallax setup.
     * I have noticed that the HTML vertical scrolling is also used for the mobile browser's url/search bar to go away and come back. If you don't allow vertical scrolling, then the bar is always there.
     */
    const htmlEl = document.documentElement;
    htmlEl.style.overflowX = "hidden";

    const bodyEl = document.body;
    bodyEl.style.margin = "0";
    bodyEl.style.overflow = "hidden";


    StartupCSSParallax();
}

function StartupCSSParallax()
{
    ParallaxWrapperElement.style.setProperty("--perspectiveValue", `${perspectiveValue}px`);

    UpdateParallaxBGElement();
}


function UpdateParallaxBGElement()
{
    BGElement.style.setProperty("--bgZTransform", `${bgZTransform}px`);
    UpdateParallaxElement(BGElement, bgZTransform, false);
}

/*
 * Counter's an element's depth by scaling up to perfectly fit PageContentElement. Good for page backgrounds.
 * Only limitation you may encounter is if you need to preserve aspect ratio (see comment within the inPreserveAspectRatio conditional block)
 */
function UpdateParallaxElement(inElement, inZTransform, inPreserveAspectRatio = true)
{
    const heightRatio = vhToPx(100) / PageContentElement.clientHeight; // how many "PageContent" heights can we fit into the height of the viewport
    const widthRatio = vwToPx(100) / PageContentElement.clientWidth;

    /* 
     * The formula that calculates the scale to counter the depth. "heightRatio" and "widthRatio" are variables added into the formula by me since I have the transform and perspective origin at the bottom.
     */
    const heightScale = 1 + ((-inZTransform * heightRatio) / perspectiveValue);
    const widthScale = 1 + ((-inZTransform * widthRatio) / perspectiveValue);


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






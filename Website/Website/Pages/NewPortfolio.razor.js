var BGElement = document.getElementById("BG");
var PageContentElement = document.getElementById("PageContent");
var ParallaxWrapperElement = document.getElementById("ParallaxWrapper");
var px_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;  // conversion ratio.... (physical pixel/CSS_px)


function vhToPx(inVh)
{
    return (ParallaxWrapperElement.clientHeight / (100 / inVh));
}
function vwToPx(inVw) {
    return (ParallaxWrapperElement.clientWidth / (100 / inVw));
}


// JQuery's ready event for when DOM is fully loaded and ready to manipulate
$(function ()
{
    UpdateParallaxBGElement();
});

// JQuery event detecting zoom/resizing of the window
$(window).resize(function ()
{
    var newPx_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
    if (newPx_ratio != px_ratio) {
        px_ratio = newPx_ratio;
        // zooming
    }
    else {
        // just resizing
    }



    UpdateParallaxBGElement();
});


export function OnAfterRenderAsync()
{

}


function UpdateParallaxBGElement()
{
    UpdateParallaxElement(BGElement, -1, false);
}

/*
 * Counter's an element's depth by scaling up to perfectly fit the page.
 * Only limitations you might encounter is when you need to preserve the
 * element's aspect ratio while also having another specific need.
 */
function UpdateParallaxElement(inElement, inZTransform, inPreserveAspectRatio = true)
{

    var heightRatio = vhToPx(100) / PageContentElement.clientHeight; // ratio of the height of the viewport to the height of the page's content
    var widthRatio = vwToPx(100) / PageContentElement.clientWidth;
    /* 
     * Now we must ensure we are using the correct kind of pixels (css vs device).
     * We will use what ever pixel unit is currently the larger unit so we don't over count pixels.
     * If there is a lower number of device pixels than there are css pixels,
     * we choose device pixels and vice versa.
    */
    if (px_ratio < 1) // if page is zoomed out (device pixels are bigger)
    {
        // convert to device pixels
        heightRatio *= px_ratio;
        widthRatio *= px_ratio;
    }


    /* 
     * The formula that calculates the scale to counter the depth (with our ratio applied to it).
     * Also I'm hard-coding this to only work with the css perspective set to 1px, since it's good practice anyways. Otherwise the formula I'm applying my ratio to would be slightly different.
     */
    var newHeightScale = 1 + (-inZTransform * heightRatio);
    var newWidthScale = 1 + (-inZTransform * widthRatio);

    if (inPreserveAspectRatio)
    {
        /*
         * If you are preserving aspect ratio, you either choose the smaller scale or the larger scale value.
         * Using smaller scale value will ensure that it stays centered with the page's content, but it won't cover whole screen if that's what you want.
         * Using larger scale value will ensure that the whole screen is covered, but then the element won't be centered with the page's content.
         * For now I'm only providing the smaller scale approach b/c I'm lazy, but larger scale one can be implemented quickly if needed.
         */
        var smallerScaleValue = Math.min(newWidthScale, newHeightScale); // we will choose the smallest scale value, otherwise it won't be centered to the page.
        inElement.style.transform = `translateZ(${inZTransform}px) scale(${smallerScaleValue})`;
        return;
    }
    inElement.style.transform = `translateZ(${inZTransform}px) scale(${newWidthScale}, ${newHeightScale})`;
}






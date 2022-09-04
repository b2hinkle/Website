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

// Recalculates element's scale to perfectly fit the page.
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
        var scaleValue = Math.max(newWidthScale, newHeightScale); // we will choose the largest scale value, otherwise the other part will not fully cover the page
        inElement.style.transform = `translateZ(${inZTransform}px) scale(${scaleValue})`;
        return;
    }
    inElement.style.transform = `translateZ(${inZTransform}px) scale(${newWidthScale}, ${newHeightScale})`;
}






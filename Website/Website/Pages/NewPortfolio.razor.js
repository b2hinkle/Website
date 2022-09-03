var BGElement = document.getElementById("BG");
var PageContentElement = document.getElementById("PageContent");
var ParallaxWrapperElement = document.getElementById("ParallaxWrapper");
var px_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;  // conversion ratio.... (physical pixel/CSS_px)


function vhToPx(inVh)
{
    return (ParallaxWrapperElement.clientHeight / (100 / inVh));
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
    UpdateParallaxElement(BGElement, -100);
}

function UpdateParallaxElement(inElement, inZTransform)
{
    // We must update our BG's scale to fit perfectly to the page with its scale origin at the bottom of itself

    var ratio = vhToPx(100) / PageContentElement.clientHeight; // ratio of the height of the viewport to the height of the page's content
    // Now we must ensure we are using the correct kind of pixels (css vs device). We will use what ever pixel unit is currently the larger unit so we don't over count pixels. If there is a lower number of device pixels than there are css pixels, we choose device pixels and vice versa.
    if (px_ratio < 1) // if page is zoomed out (device pixels are bigger)
    {
        ratio *= px_ratio; // convert to device pixels
    }

    var newScale = 1 + (-inZTransform * ratio);
    inElement.style.transform = `translateZ(${inZTransform}px) scale(${newScale})`;

}






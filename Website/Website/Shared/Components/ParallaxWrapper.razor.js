var BGElement = document.getElementById("BG");
var PageContentElement = document.getElementById("PageContent");
var ParallaxWrapperElement = document.getElementById("ParallaxWrapper");
var px_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;  // conversion ratio.... (device pixel/css pixel)


function vhToPx(inVh)
{
    return (ParallaxWrapperElement.clientHeight / (100 / inVh));
}
function vwToPx(inVw) {
    return (ParallaxWrapperElement.clientWidth / (100 / inVw));
}

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
    /*
     * HTML and Body elements can cause an extra scrollbar, interfiering with our parallax setup
     */
    var htmlEl = document.documentElement;
    htmlEl.style.overflowX = "hidden";

    var bodyEl = document.body;
    bodyEl.style.margin = "0";
    bodyEl.style.overflow = "hidden";

    /*
     * Parallax
     */
    UpdateParallaxBGElement();
}


function UpdateParallaxBGElement()
{
    UpdateParallaxElement(BGElement, -300, 300, false);
}

/*
 * Counter's an element's depth by scaling up to perfectly fit the page.
 * Only limitations you might encounter is when you need to preserve the
 * element's aspect ratio while also having another specific need.
 */
function UpdateParallaxElement(inElement, inZTransform, inPerspectiveValue, inPreserveAspectRatio = true)
{
    const heightRatio = vhToPx(100) / PageContentElement.clientHeight; // how many "PageContent" heights can we fit into the height of the viewport
    const widthRatio = vwToPx(100) / PageContentElement.clientWidth;

    /* 
     * The formula that calculates the scale to counter the depth. "heightRatio" and "widthRatio" are variables added into the formula by me since I have the transform and perspective origin at the bottom.
     */
    var heightScale = 1 + ((-inZTransform * heightRatio) / inPerspectiveValue);
    var widthScale = 1 + ((-inZTransform * widthRatio) / inPerspectiveValue);





    var transformOrigin = "center bottom"; // 50% 100%
    inElement.style.WebkitTransformOrigin = transformOrigin;
    inElement.style.TransformOrigin = transformOrigin;

    if (inPreserveAspectRatio) {
        /*
         * If you are preserving aspect ratio, you either choose the smaller scale or the larger scale value.
         * Using smaller scale value will ensure that it stays centered with the page's content, but it won't cover whole screen if that's what you want.
         * Using larger scale value will ensure that the whole screen is covered, but then the element won't be centered with the page's content.
         * For now I'm only providing the smaller scale approach b/c I'm lazy, but larger scale one can be implemented quickly if needed.
         */
        var smallerScaleValue = Math.min(widthScale, heightScale); // we will choose the smallest scale value, otherwise it won't be centered to the page.
        inElement.style.transform = `translateZ(${inZTransform}px) scale(${smallerScaleValue})`;
        return;
    }


    
    var transform = `translateZ(${inZTransform}px) scale(${widthScale}, ${heightScale})`;
    inElement.style.webkitTransform = transform;
    inElement.style.transform = transform;
}






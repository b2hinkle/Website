var BGElement = document.getElementById("BG");
var PageContentElement = document.getElementById("PageContent");
var ParallaxWrapperElement = document.getElementById("ParallaxWrapper");

// JQuery's ready event for when DOM is fully loaded and ready to manipulate
$(function ()
{
	UpdateBGTransform();
});

// JQuery event detecting zoom/resizing of the window
var px_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
$(window).resize(function ()
{
    var newPx_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
    if (newPx_ratio != px_ratio) {
        px_ratio = newPx_ratio;
        console.log("zooming");
    }
    else {
        console.log("just resizing");
    }



    UpdateBGTransform(); // Keep BG div's transform updated
});


export function OnAfterRenderAsync()
{

}

export function UpdateBGTransform()
{
    var PageContentHeight = PageContentElement.offsetHeight;

    //BGElement.style.transform = `translateZ(${-1}px) scale(${2}, ${2})`;     // use if we find out we end up needing to set this in js

}







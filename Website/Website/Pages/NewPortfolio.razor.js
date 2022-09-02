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
	UpdateBGTransform();
});

// JQuery event detecting zoom/resizing of the window
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
    var PageHeight = PageContentElement.clientHeight;

    // Formula is: scale = 1 + (100vh/PageHeight)
    console.log(`1 + 100vh/PageHeight: 1 + ${vhToPx(100)}/${PageHeight}=${1 + (vhToPx(100) / PageHeight)}`);
    BGElement.style.transform = `translateZ(${-1}px) scale(${1 + (vhToPx(100)/PageHeight)})`;



// Stuff I was messing arround with when figuring out the ratio that would need to be applied to the scale of 2 
/*    var PageHeight = PageContentElement.clientHeight;

    var ratio = (3 / 4); // ratio at 200vh
    BGElement.style.transform = `translateZ(${-1}px) scale(${2 * ratio})`;*/
}






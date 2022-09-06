function BlazorScrollToId(id) {
    const element = document.getElementById(id);
if (element instanceof HTMLElement) {
    element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
    });
    }
}

function GetDefaultFontSizeInCSSPixels() {
    // Solution from https://stackoverflow.com/questions/1442542/how-can-i-get-default-font-size-in-pixels-by-using-javascript-or-jquery by Aliaksandr Sushkevich
    // Original solution was to use document.body instead of document.documentElement, but I'm pretty sure we wan't the root element (the "html" one) so we will go with the latter
    return Number(window.getComputedStyle(document.documentElement).getPropertyValue('font-size').match(/\d+/)[0]);
}
function CSSPixelsToREM(inPixels) {
    /*
             inPixels                      1 rem
                -           *                -
                1                       OneREMInPixels
    */
    const OneREMInPixels = GetDefaultFontSizeInCSSPixels();
    return inPixels / OneREMInPixels;
}
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
}





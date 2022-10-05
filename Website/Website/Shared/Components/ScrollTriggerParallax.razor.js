export function OnAfterRenderAsync()
{
// BEGIN CSS styling
    /*
     * Eliminate unnecissary scrollbars to keep page predictible
    */
    const htmlEl = document.documentElement;
    htmlEl.style.overflowX = "hidden";
    const bodyEl = document.body;
    bodyEl.style.overflow = "hidden";
// END CSS styling



}

const TestParallaxContainerEl = document.getElementById("TestParallaxContainer");
const TestParallaxElement = document.getElementById("TestParallaxElement");

export function OnAfterRenderAsync()
{
// BEGIN CSS styling
    /*
    * HTML and Body elements can cause an extra scrollbar, interfiering with our parallax setup.
    * I have noticed that the HTML vertical scrolling is also used for the mobile browser's url/search bar to go away and come back. If you don't allow vertical scrolling, then the bar is always there.
    */
    const htmlEl = document.documentElement;
    htmlEl.style.overflowX = "hidden";
    htmlEl.style.padding = "0px";
    htmlEl.style.margin = "0px";
    const bodyEl = document.body;
    bodyEl.style.overflow = "hidden";
    bodyEl.style.padding = "0px";
    bodyEl.style.margin = "0px";
// END CSS styling




    let ID = window.requestAnimationFrame(function Tick(timestamp)
    {
        let OverflowBottom = (TestParallaxElement.getBoundingClientRect().bottom - TestParallaxContainerEl.getBoundingClientRect().bottom);
        let ClipBottom = TestParallaxElement.getBoundingClientRect().height - OverflowBottom;
        TestParallaxElement.style.setProperty("--ClipBottom", `${ClipBottom}px`);

        let OverflowTop = (TestParallaxContainerEl.getBoundingClientRect().top - TestParallaxElement.getBoundingClientRect().top);
        let ClipTop = OverflowTop;
        TestParallaxElement.style.setProperty("--ClipTop", `${ClipTop}px`);

        let OverflowLeft = (TestParallaxContainerEl.getBoundingClientRect().left - TestParallaxElement.getBoundingClientRect().left);
        let ClipLeft = OverflowLeft;
        TestParallaxElement.style.setProperty("--ClipLeft", `${ClipLeft}px`);

        let OverflowRight = (TestParallaxElement.getBoundingClientRect().right - TestParallaxContainerEl.getBoundingClientRect().right);
        let ClipRight = TestParallaxElement.getBoundingClientRect().width - OverflowRight;
        TestParallaxElement.style.setProperty("--ClipRight", `${ClipRight}px`);





        ID = requestAnimationFrame(Tick);
    });
}





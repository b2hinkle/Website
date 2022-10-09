const TestParallaxContainerEl = document.getElementById("TestParallaxContainer");
const TestParallaxElement = document.getElementById("TestParallaxElement");

export function OnAfterRenderAsync()
{
    sal({
        once: false,
    });


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

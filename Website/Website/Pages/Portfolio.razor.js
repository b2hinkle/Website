const ParallaxWrapperElement = document.getElementById("ParallaxWrapper");
let HeaderEl = document.getElementById("Header");
let ElToClip = document.getElementById("ElToClip");

export function OnAfterRenderAsync()
{
    sal({
        once: false,
    });


    let ID = window.requestAnimationFrame(function Tick(timestamp)
    {
        let BottomDifference = (ElToClip.getBoundingClientRect().bottom - HeaderEl.getBoundingClientRect().bottom);
        let ClipBottom = (HeaderEl.getBoundingClientRect().bottom + ParallaxWrapperElement.scrollTop) - BottomDifference;
        ElToClip.style.setProperty("--ClipBottom", `${ClipBottom}px`);




        ID = requestAnimationFrame(Tick);
    });
}

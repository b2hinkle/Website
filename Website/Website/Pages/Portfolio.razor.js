export function OnAfterRenderAsync()
{
    AOS.init({
        scrollContainer: "#ParallaxWrapper" // Thanks to this fork https://github.com/anthonypaparella/aos
    });
}

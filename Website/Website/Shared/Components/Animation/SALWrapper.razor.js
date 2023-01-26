export function OnAfterRenderAsync()
{
    if (IntersectionObserver != undefined)
    {
        const s = sal({
            once: false,
            threshold: .25 // using such a low value since mobile devices with short height will having a hard time seeing the end of a long div if it has the animation
        });

        const SalWrapperElements = document.querySelectorAll("[data-sal-wrapper]");
        SalWrapperElements.forEach((el) =>
        {
            const salData = el.dataset.salWrapper;
            switch (salData)
            {
                case "fade":
                    el.dataset.sal = "fade";
                    break;
                case "slide-up":
                    el.dataset.sal = "slide-up";
                    break;
                case "slide-down":
                    el.dataset.sal = "slide-down";
                    break;
                case "slide-left":
                    el.dataset.sal = "slide-left";
                    break;
                case "slide-right":
                    el.dataset.sal = "slide-right";
                    break;
                case "zoom-in":
                    el.dataset.sal = "zoom-in";
                case "zoom-out":
                    el.dataset.sal = "zoom-out";
                    break;
                case "flip-up":
                    el.dataset.sal = "flip-up";
                    break;
                case "flip-down":
                    el.dataset.sal = "flip-down";
                    break;
                case "flip-left":
                    el.dataset.sal = "flip-left";
                    break;
                case "flip-right":
                    el.dataset.sal = "flip-right";
                    break;
            }
        });

        s.update();
    }
    
}

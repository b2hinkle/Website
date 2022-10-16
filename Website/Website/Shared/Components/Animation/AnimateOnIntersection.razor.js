class AnimateOnIntersection
{
    constructor(allowOnMobile = false)
    {
        if (this.IsSupported())
        {
            const notOnMobile = this.Window.matchMedia("screen and (min-width: 40em)").matches; // using this query as a way to see if we are on mobile
            if (notOnMobile || allowOnMobile)
            {
                this.Init();
            }
        }
    }

    IsSupported() // ensures all features we use are supported
    {
        this.Window = window; // store our window so we can make call to raf

        const dummyEl = document.documentElement || document.body;
        const dummyAnimation = new Animation();
        const dummyKeyframeEffect = new KeyframeEffect(null, { }, { });

        return this.Window !== undefined
            && this.Window.innerHeight !== undefined
            && document.querySelectorAll !== undefined
            && dummyEl.dataset !== undefined
            && Animation !== undefined
            && dummyAnimation !== undefined
            && dummyAnimation.effect !== undefined
            && dummyAnimation.currentTime !== undefined
            && dummyKeyframeEffect.setKeyframes !== undefined
            && this.Window.matchMedia !== undefined;
    }

    Init()
    {
        this.ElementsToAnimate = document.querySelectorAll("[data-aoi]");
        this.ElementsToAnimate.forEach(el => {
            const animation = new Animation();

            // Get data attributes so we know how they want us to make the animation
            let dataDuration = el.dataset.duration;
            dataDuration = dataDuration ? dataDuration : 1; // if not specified, give default value of 1
            let dataIterations = el.dataset.duration;
            dataIterations = dataIterations ? dataIterations : 1; // if not specified, give default value of 1


            animation.effect = new KeyframeEffect(
                el,    // target
                {},
                {
                    duration: dataDuration, // 1 allows us to easily scrub through the animation as if it was a percentage
                    iterations: dataIterations,
                    direction: "normal",
                    fill: "both",
                    easing: "linear",
                }
            );
            el.Animation = animation;
        });

    }
}

export function OnAfterRenderAsync()
{
    const AOI = new AnimateOnIntersection();
}

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
            const Duration = dataDuration * 1000; // conert to miliseconds
            let dataIterations = el.dataset.duration;
            dataIterations = dataIterations ? dataIterations : 1; // if not specified, give default value of 1
            animation.effect = new KeyframeEffect(
                el,    // target
                {
                    opacity: [0, 1],
                    transform: ["scale(5)", "scale(1)"]
                },
                {
                    duration: Duration,
                    iterations: dataIterations,
                    direction: "normal",
                    fill: "both",
                    easing: "linear",
                }
            );

            const dataOnlyObserveOnce = el.hasAttribute("data-aoi-only-observe-once");
            if (!dataOnlyObserveOnce)
            {
                animation.onfinish = (event) => { this.ElementObserver.observe(el); }
            }
            el.Animation = animation;
        });

        // Now oberve for intersections and play animation when intersected
        this.ElementObserver = new IntersectionObserver(entries =>
        {
            entries.forEach((entry) =>
            {
                const el = entry.target;
                console.log("h");
                if (entry.isIntersecting)
                {
                    this.ElementObserver.unobserve(el); // probleme is after we do this we can't know if the element left the viewport for the duration of the animation, which means that next time we are observing, we don't actually know if we should trigger the animation again or not since the user could have not even scrolled for the duration.
                    el.Animation.play();
                }
            }),
            { root: null, rootMargin: '0% 50%', threshold: 0.5 } // observer options
        });
        this.ElementsToAnimate.forEach((el) => { this.ElementObserver.observe(el); });   // start observing the parallax containers
    }

}

export function OnAfterRenderAsync()
{
    const AOI = new AnimateOnIntersection();
}

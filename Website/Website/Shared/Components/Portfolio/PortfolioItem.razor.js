class PortfolioItemVideoBehavior
{
    constructor(inPortfolioItemElId, inDailyMotionPlayerElId, inDailymotionVideoId, inDailymotionQuality)
    {
        this.PortfolioItemElId = inPortfolioItemElId;
        this.DailyMotionPlayerElId = inDailyMotionPlayerElId;
        this.DailymotionVideoId = inDailymotionVideoId;
        this.DailymotionQuality = inDailymotionQuality;

        dailymotion.createPlayer(this.DailyMotionPlayerElId, {
            video: this.DailymotionVideoId,
            params: {
                loop: true,
                mute: true,
                quality: 380,
                autostart: true,
            },
        })
        .then((player) =>
        {
            player.on(dailymotion.events.VIDEO_PLAYING, this.OnVideoJustGotAutoplayed.bind(this), { once: true });
        })
        .catch((e) => console.error(e));
    }

    OnVideoJustGotAutoplayed()
    {
        if (window.IntersectionObserver !== undefined)
        {
            this.ElementObserver = new IntersectionObserver(this.OnIntersectionObserved.bind(this), { root: null, rootMargin: `0px 0px 0px 0px`, threshold: .5 });
            this.ElementObserver.observe(document.getElementById(this.PortfolioItemElId));
        }
    }

    OnIntersectionObserved(entries)
    {
        entries.forEach((entry) =>
        {
            if (entry.isIntersecting)
            {
                dailymotion.getPlayer(this.DailyMotionPlayerElId)
                .then((player) =>
                {
                    player.play()
                })
                .catch((e) => console.log(e))
            }
            else
            {
                dailymotion.getPlayer(this.DailyMotionPlayerElId)
                .then((player) =>
                {
                    player.pause()
                })
                .catch((e) => console.log(e))
            }
        });
    }
}

export function OnAfterRenderAsync(inPortfolioItemElId, inDailyMotionPlayerElId, inDailymotionVideoId, inDailymotionQuality)
{
    new PortfolioItemVideoBehavior(inPortfolioItemElId, inDailyMotionPlayerElId, inDailymotionVideoId, inDailymotionQuality);
}

export function OnFullecreenBtnPressed(inDailyMotionPlayerElId)
{
    dailymotion.getPlayer(inDailyMotionPlayerElId)
    .then((player) =>
    {
        player.setFullscreen(true);
    })
    .catch((e) => console.log(e))
}

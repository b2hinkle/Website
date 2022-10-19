class NavBarHighlightingManager
{
    constructor()
    {
        this.navbar = document.getElementById("PortfolioNavbar");
        this.navbarItems = document.getElementById("navbarItems").getElementsByTagName("a");
        this.IntersectingElements = new Array();
        this.px_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;  // conversion ratio.... (physical pixel/CSS_px)
        if (this.IsSupported())
        {
            this.Init();
        }
    }

    IsSupported() // ensures all features we use are supported
    {
        return this.navbar !== undefined
            && this.navbarItems !== undefined
            && this.IntersectingElements !== undefined
            && this.px_ratio !== undefined
            && this.navbar.getBoundingClientRect !== undefined
            && this.navbar.getBoundingClientRect().height !== undefined
            && window.innerHeight !== undefined
            && window.addEventListener !== undefined
            && this.OnResize.bind !== undefined
            && this.navbar.classList.add !== undefined
            && this.navbar.classList.remove !== undefined
            && window.IntersectionObserver !== undefined;
    }

    GetIntersectionObserverOptions()
    {
        const navbarHeight = this.navbar.getBoundingClientRect().height;
        const extraSpaceToEnsureHighlight = navbarHeight / 20;
        return { root: null, rootMargin: `0px 0px ${-(window.innerHeight - navbarHeight - extraSpaceToEnsureHighlight)}px 0px`, threshold: 0 };
    }

    OnIntersectionObserved(entries)
    {
        entries.forEach((entry) =>
        {
            const el = entry.target;
            if (entry.isIntersecting)
            {
                for (let i = 0; i < this.IntersectingElements.length; i++)
                {
                    if (this.IntersectingElements[i] == el)
                    {
                        return; // already been added
                    }
                }
                this.IntersectingElements.push(el);
                this.HighlightNavLink(el.CorrespondingNavLinkEl);
            }
            else
            {
                // remove from the IntersectingElements array
                for (let i = 0; i < this.IntersectingElements.length; i++)
                {
                    if (this.IntersectingElements[i] == el)
                    {
                        this.IntersectingElements.splice(i, 1);
                        break;
                    }
                }
                    
                this.UnHighlightNavLink(el.CorrespondingNavLinkEl);
            }
        });
    }

    Init()
    {
        this.PortfolioEl = document.getElementById("portfolio");
        this.PortfolioEl.CorrespondingNavLinkEl = document.getElementById("portfolioNavLink");
        this.AboutEl = document.getElementById("about");
        this.AboutEl.CorrespondingNavLinkEl = document.getElementById("aboutNavLink");
        this.ContactEl = document.getElementById("contact");
        this.ContactEl.CorrespondingNavLinkEl = document.getElementById("contactNavLink");

        this.ElementObserver = new IntersectionObserver(this.OnIntersectionObserved.bind(this), this.GetIntersectionObserverOptions());
        this.ElementObserver.observe(this.PortfolioEl);
        this.ElementObserver.observe(this.AboutEl);
        this.ElementObserver.observe(this.ContactEl);


        window.addEventListener("resize", this.OnResize.bind(this), false);
                    
    }

    OnResize()
    {
        const newPx_ratio = window.devicePixelRatio || window.screen.availWidth / document.documentElement.clientWidth;
        if (newPx_ratio != this.px_ratio) // if we zoomed
        {
            this.px_ratio = newPx_ratio;
            // ElementObserver out of date, create new one
            this.ElementObserver.disconnect();
            this.ElementObserver = new IntersectionObserver(this.OnIntersectionObserved.bind(this), this.GetIntersectionObserverOptions());
            this.ElementObserver.observe(this.PortfolioEl);
            this.ElementObserver.observe(this.AboutEl);
            this.ElementObserver.observe(this.ContactEl);
        }
    }

    HighlightNavLink(inNavLinkEl)
    {
        for (let i = 0; i < this.navbarItems.length; i++)
        {
            if (this.navbarItems[i] == inNavLinkEl)
            {
                this.navbarItems[i].classList.add("navLinkForcedHover");
            }
            else
            {
                this.navbarItems[i].classList.remove("navLinkForcedHover");
            }
        }
    }
    UnHighlightNavLink(inNavLinkEl)
    {
        for (let i = 0; i < this.navbarItems.length; i++)
        {
            if (this.navbarItems[i] == inNavLinkEl)
            {
                this.navbarItems[i].classList.remove("navLinkForcedHover");
                break;
            }
        }
        
        // Add the class to the most recent intersecting one
        const lastElementIndex = this.IntersectingElements.length - 1;
        if (lastElementIndex >= 0 && this.IntersectingElements[lastElementIndex] != undefined)
        {
            this.HighlightNavLink(this.IntersectingElements[lastElementIndex].CorrespondingNavLinkEl);
        }
    }
    // Not currently used so commenting out
    /*UnHighlightAllNavLinks()
    {
        for (let i = 0; i < this.navbarItems.length; i++)
        {
            this.navbarItems[i].classList.remove("navLinkForcedHover");
        }
    }*/
}

export function OnAfterRenderAsync()
{
    // BEGIN CSS styling
        // Get rid of annoying stuff
        const htmlEl = document.documentElement;
        htmlEl.style.overflowX = "hidden";
        htmlEl.style.padding = "0px";
        htmlEl.style.margin = "0px";
        const bodyEl = document.body;
        bodyEl.style.overflowX = "hidden";
        bodyEl.style.padding = "0px";
        bodyEl.style.margin = "0px";
    // END CSS styling

    const nBM = new NavBarHighlightingManager();

    
}

export function ScrollToElementWithNavbarOffset(elementId)
{
    const element = document.getElementById(elementId);
    const navbarHeight = document.getElementById("PortfolioNavbar").getBoundingClientRect().height;
    ScrollToElementWithOffset(element, navbarHeight);
}
function ScrollToElementWithOffset(element, offset)
{
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

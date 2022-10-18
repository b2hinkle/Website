class NavBarHighlightingManager
{
    constructor()
    {
        this.navbarHeight = document.getElementById("PortfolioNavbar").getBoundingClientRect().height;
        this.navbarItems = document.getElementById("navbarItems").getElementsByTagName("a");
        this.IntersectingElements = new Array();
        if (this.IsSupported())
        {
            this.Init();
        }
    }

    IsSupported() // ensures all features we use are supported
    {
        return window.innerHeight !== undefined;
    }

    Init()
    {
        const PortfolioEl = document.getElementById("portfolio");
        PortfolioEl.CorrespondingNavLinkEl = document.getElementById("portfolioNavLink");
        const AboutEl = document.getElementById("about");
        AboutEl.CorrespondingNavLinkEl = document.getElementById("aboutNavLink");
        const ContactEl = document.getElementById("contact");
        ContactEl.CorrespondingNavLinkEl = document.getElementById("contactNavLink");

        const observerOptions = { root: null, rootMargin: `0px 0px ${-(window.innerHeight - this.navbarHeight)}px 0px`, threshold: 0 } // observer options
        const ElementObserver = new IntersectionObserver(entries =>
        {
            entries.forEach((entry) =>
            {
                const el = entry.target;
                if (entry.isIntersecting)
                {
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
        }, observerOptions);

        ElementObserver.observe(PortfolioEl);
        ElementObserver.observe(AboutEl);
        ElementObserver.observe(ContactEl);
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

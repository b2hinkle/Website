const navbarHeight = document.getElementById("PortfolioNavbar").getBoundingClientRect().height;

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

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#PortfolioNavbar');
    if (mainNav)
    {
        const documentScrollSpy = new bootstrap.ScrollSpy(document.body,
        {
            target: '#PortfolioNavbar',
            offset: document.getElementById("PortfolioNavbar").getBoundingClientRect().height + 1,
        });



        // Fires when we scrolled by a certain section
        $(window).on('activate.bs.scrollspy', function (e) 
        {
            console.log(e.relatedTarget);
            if (e.relatedTarget == "#portfolio") 
            {
                
            }
            else if (e.relatedTarget == "#header") 
            {
                
            }
        });
    };
}

export function ScrollToElementWithNavbarOffset(elementId)
{
    const element = document.getElementById(elementId);
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

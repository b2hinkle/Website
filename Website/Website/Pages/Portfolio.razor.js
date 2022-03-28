var documentScrollSpy;
var navbarHeight;
var navbarBgColorForHeaderSection;  // you can tweak this in the Html
var navbarBgColorForNonHeaderSections = "rgba(33, 37, 41, 1)";

const PortfolioNavbarSizeChanged = new ResizeObserver(function (entries)
{
    navbarHeight = document.getElementById("PortfolioNavbar").getBoundingClientRect().height;


    /* doesn't work for some reason. We're just going to accept ScrollSpy isn't going to be accutate when navbar is expanded
    if ($('body').scrollspy)
    {
        console.log(navbarHeight);
        $('body').scrollspy.offset = navbarHeight+1;
        // force scrollspy to recalculate the offsets to your targets
        $('body').scrollspy.refresh();
        $('body').scrollspy("refresh");
    }*/
});


export function init() {
    var parallaxElements = document.getElementsByClassName('parallax');
    new simpleParallax(parallaxElements, {
        orientation: 'down',
        scale: 1.8,
    });


    // start observing for resize
    PortfolioNavbarSizeChanged.observe(document.querySelector("#PortfolioNavbar"));
    

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#PortfolioNavbar');
    if (mainNav) {
        documentScrollSpy = new bootstrap.ScrollSpy(document.body,
        {
            target: '#PortfolioNavbar',
            offset: document.getElementById("PortfolioNavbar").getBoundingClientRect().height+1,
        });



        navbarBgColorForHeaderSection = mainNav.style.backgroundColor;
        // Fires when we scrolled by a certain section
        $(window).on('activate.bs.scrollspy', function (e)
        {
            console.log(e.relatedTarget);
            if (e.relatedTarget == "#portfolio")
            {
                mainNav.style.backgroundColor = navbarBgColorForNonHeaderSections;
            }
            else if (e.relatedTarget == "#header")
            {
                mainNav.style.backgroundColor = navbarBgColorForHeaderSection;
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
    
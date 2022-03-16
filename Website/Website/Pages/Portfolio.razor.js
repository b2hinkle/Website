const PortfolioNavbarSizeChanged = new ResizeObserver(function (entries)
{
    var navbarHeight = document.getElementById("PortfolioNavbar").getBoundingClientRect().height;
    document.getElementById("PageContent").style.paddingTop = navbarHeight.toString() + "px";
});



export function init()
{
    // Also can pass in optional settings block
    var rellax = new Rellax('.rellax');


    // start observing for resize
    PortfolioNavbarSizeChanged.observe(document.querySelector("#PortfolioNavbar"));
    

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#PortfolioNavbar');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#PortfolioNavbar',
            offset: 72,
        });
    };
}

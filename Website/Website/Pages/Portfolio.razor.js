export function init()
{
    // Also can pass in optional settings block
    var rellax = new Rellax('.rellax');


    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#PortfolioNavbar');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#PortfolioNavbar',
            offset: 72,
        });
    };
}







// fired when new scrollsby element is active
$('[data-spy="scroll"]').on('activate.bs.scrollspy', function () {
    /*alert("This is a warning message!");*/
})
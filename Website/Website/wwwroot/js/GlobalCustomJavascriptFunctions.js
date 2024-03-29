function BlazorScrollToId(id) {
    const element = document.getElementById(id);
if (element instanceof HTMLElement) {
    element.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest"
    });
    }
}

function GetDefaultFontSizeInCSSPixels() {
    // Solution from https://stackoverflow.com/questions/1442542/how-can-i-get-default-font-size-in-pixels-by-using-javascript-or-jquery by Aliaksandr Sushkevich
    // Original solution was to use document.body instead of document.documentElement, but I'm pretty sure we wan't the root element (the "html" one) so we will go with the latter
    return Number(window.getComputedStyle(document.documentElement).getPropertyValue('font-size').match(/\d+/)[0]);
}
function CSSPixelsToREM(inPixels) {
    /*
             inPixels                      1 rem
                -           *                -
                1                       OneREMInPixels
    */
    const OneREMInPixels = GetDefaultFontSizeInCSSPixels();
    return inPixels / OneREMInPixels;
}

function IsNearlyEqual(A, B, noLongerEqualAt)
{
    var difference = Math.abs(A - B);
    if (difference < noLongerEqualAt)
    {
        return true;
    }
    return false;
}

function Lerp(start_value, end_value, pct)
{
    return (start_value + (end_value - start_value) * pct);
}

function SupportsCustomCSSProperties()
{
    return CSS.supports("color", "var(--FakeCustomPropertyValue)");
}

/**
 * Pass in an element and its CSS Custom Property that you want the value of.
 * Optionally, you can determine what datatype you get back.
 *
 * @param {String} customPropertyName
 * @param {HTMLELement} element=document.documentElement
 * @param {String} castAs='string'
 * @returns {*}
 */
function getCSSCustomPropertyValue(customPropertyName, element, castAs = 'string')
{
    let response = getComputedStyle(element).getPropertyValue(customPropertyName);

    // Tidy up the string if there's something to work with
    if (response.length)
    {
        response = response.replace(/\'|"/g, '').trim();
    }

    // Convert the response into a whatever type we wanted
    switch (castAs)
    {
        case 'number':
        case 'int':
            return parseInt(response, 10);
        case 'float':
            return parseFloat(response, 10);
        case 'boolean':
        case 'bool':
            return response === 'true' || response === '1';
    }

    // Return the string response by default
    return response;
};

/**
 * Returns true if mobile device, false if desktop
 */
function isMobile()
{
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i.test(navigator.userAgent);
}


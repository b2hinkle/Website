
export function init()
{
	var PageContentHeight = document.getElementById("PageContent").offsetHeight;
	var PageBGElement = document.getElementById("BG")

	PageBGElement.style.height = `${PageContentHeight}px`;	// give BG div same height as PageContent div (PageContent basically holds everything on the page)
	PageBGElement.style.top = `${PageContentHeight / 2}px`;	// vertically center the BG div in the center of our PageContent div

	console.log(`${PageContentHeight}px`);
}


export function init()
{
	var ForegroundTranslationAmt = -1000;
	var BackgroundTranslationAmt = 0;
	
	document.querySelectorAll('.Foreground').forEach((elem) =>
	{
		//const modifier = elem.getAttribute('data-modifier')

		basicScroll.create(
		{
			elem: elem,
			from: 0, // at scroll position of 0
			to: 900, // stop the animation when the bottom of the element reaches the top of the viewport
			direct: true,
			props:
			{
				'--ForegroundTranslationAmt':
				{
					from: '0',
					to: `${ForegroundTranslationAmt}px`
				}
			}
		}).start()
	})

	document.querySelectorAll('.Background').forEach((elem) =>
	{
		//const modifier = elem.getAttribute('data-modifier')

		basicScroll.create(
		{
			elem: elem,
			from: 'top-top', // at scroll position of 0
			to: 'bottom-bottom', // stop the animation when the bottom of the element reaches the top of the viewport
			direct: true,
			props:
			{
				'--BackgroundTranslationAmt':
				{
					from: '0',
					to: `${-BackgroundTranslationAmt}px`
				}
			}
		}).start()
	})
}

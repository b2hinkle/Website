

export function init()
{
	// in the HTML, data-speed is additive, so children get parents speed and specifying another data-speed on the child element will add that speed to the accumulated parents
	// So far this library seems almost perfect. Things i'm currently confused on....
	//	- WTF does the speed value mean
	//		- How do I make a super slow parallax speed (basically not moving)?
	//		- What is the max speed? Seems to be 40 from what I can tell because after 40 things start breaking I think.
	//	- Is scroll easing built in and not disableable? oof
	luxy.init({
		wrapper: '#luxy',
		targets: '.luxy-el',
		wrapperSpeed: 0.08,
		targetSpeed: 0.02,
		targetPercentage: 0.1
	});
}

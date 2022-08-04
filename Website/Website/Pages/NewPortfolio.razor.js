

export function init()
{
    /* 
     * This config allows for infinite child div parallaxing. For the child div use data-child="AnyChildName" instead of data-scene, and set its data-speed value.
     * Child speeds set to 1 will match the speed if its parent.
     */
    const config = {
        view: document.querySelector('.app'),
        ease: 1, // default ease value (0 = infinately long easing, 1 = infinately fast easing)
        scenes: {
            custom: {
                cache(cache) {
                    const elements = document.querySelectorAll('[data-child]'); // replace cache with document maybe?
                    const children = [];
                    elements.forEach(element => {
                        children.push({
                            context: element,
                            type: element.getAttribute('data-child'),
                            speed: element.getAttribute('data-speed') || 1,
                        });
                    });
                    return { children };
                },

                change({ globalState, sceneState, transform }) {
                    const { children } = sceneState.cache;
                    children.forEach(child => {
                        var amt = transform * child.speed - transform;
                        child.context.style[globalState.transformPrefix] = `translate3d(0, ${amt}px, 0)`;



                        if (child.type === 'b') {
                            // Any extra specific child stuff here
                        }
                    })
                },
            },
        },
    };

    const r = window.rolly(config);
    r.init();



}

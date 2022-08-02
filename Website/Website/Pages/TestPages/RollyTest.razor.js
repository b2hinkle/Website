export function init() {
    /*const r = rolly({
        view: document.querySelector('.app'),
        native: true,
        ease: 1 // default ease value (0 = infinately long easing, 1 = infinately fast easing)
        // other options
    });
    r.init();*/

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

                        if (child.type === 'b') {
                            child.context.style["background-color"] = "rgba(0, 0, 0, .2)";
                            // do something specific regarding this type of child
                        } else {
                            // we just apply a regular transform

                            // here, the speed is applied regarding the scene itself, not the view

                            var amt = transform * child.speed - transform;
                            child.context.style[globalState.transformPrefix] = `translate3d(0, ${amt}px, 0)`;
                        }
                    })
                },
            },
        },
    };

/*scenes: {
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
                        if (child.type === 'b') {
                            // do something specific regarding this type of child
                        } else {
                            // we just apply a regular transform

                            // here, the speed is applied regarding the scene itself, not the view
                            const transform = transform * child.speed - transform;

                            child.context.style[globalState.transformPrefix] = transform;
                        }
                    })
                },
            },
        },*/

    const r = window.rolly(config);
    r.init();
}
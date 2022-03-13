export function init() {
    var jarallax = new Jarallax();
    jarallax.setDefault('h2, h1, p', { display: 'none' });


    jarallax.addAnimation('.big_moon', [{ progress: '0%', top: '120%' }, { progress: '100%', top: '-10%' }]);
    jarallax.addAnimation('.small_moon', [{ progress: '0%', top: '70%' }, { progress: '100%', top: '40%' }])
    jarallax.addAnimation('.background', [{ progress: '0%', top: '0px' }, { progress: '100%', top: '-10px' }]);

    jarallax.addAnimation('h1', [{ progress: '0', top: '50px', opacity: '1', display: 'block' }, { progress: '10', top: '0px', opacity: '0' }]);


    jarallax.addAnimation('.head1', [{ progress: '10', left: '-20%', display: 'block' },
    { progress: '12', left: '50%', display: 'block' },
    { progress: '24', left: '55%' }]);

    jarallax.addAnimation('.head1', [{ progress: '20', opacity: '1' },
    { progress: '24', opacity: '0' }]);

    jarallax.addAnimation('.par1', [{ progress: '13', opacity: '0', display: 'block' },
    { progress: '15', opacity: '1', display: 'block' },
    { progress: '18', opacity: '1', display: 'block' },
    { progress: '22', opacity: '0' },]);

    jarallax.addAnimation('.head2', [{ progress: '20', left: '-20%', display: 'block' },
    { progress: '22', left: '50%', display: 'block' },
    { progress: '34', left: '55%' }]);

    jarallax.addAnimation('.head2', [{ progress: '30', opacity: '1' },
    { progress: '34', opacity: '0' }]);

    jarallax.addAnimation('.par2', [{ progress: '23', opacity: '0', display: 'block' },
    { progress: '25', opacity: '1', display: 'block' },
    { progress: '28', opacity: '1', display: 'block' },
    { progress: '32', opacity: '0' },]);

    jarallax.addAnimation('.head3', [{ progress: '30', left: '-20%', display: 'block' },
    { progress: '32', left: '50%', display: 'block' },
    { progress: '44', left: '55%' }]);

    jarallax.addAnimation('.head3', [{ progress: '40', opacity: '1' },
    { progress: '44', opacity: '0' }]);

    jarallax.addAnimation('.par3', [{ progress: '33', opacity: '0', display: 'block' },
    { progress: '35', opacity: '1', display: 'block' },
    { progress: '38', opacity: '1', display: 'block' },
    { progress: '42', opacity: '0' },]);
}
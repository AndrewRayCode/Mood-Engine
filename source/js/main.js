(function() {

var runtime = null,
    rtLeft, rtRight, lastW, lastH,
    hasOculus = false;

document.onload = function () {
    runtime = document.getElementById('x3d').runtime;
    rtLeft = document.getElementById('rtLeft');
    rtRight = document.getElementById('rtRight');

    lastW = +runtime.getWidth();
    lastH = +runtime.getHeight();

    var hw = Math.round(lastW / 2);
    rtLeft.setAttribute('dimensions',  hw + ' ' + lastH + ' 4');
    rtRight.setAttribute('dimensions', hw + ' ' + lastH + ' 4');

    runtime.exitFrame = function ()
    {
        var w = +runtime.getWidth();
        var h = +runtime.getHeight();

        if (w != lastW || h != lastH)
        {
            var half = Math.round(w / 2);
            rtLeft.setAttribute('dimensions',  half + ' ' + h + ' 4');
            rtRight.setAttribute('dimensions', half + ' ' + h + ' 4');

            lastW = w;
            lastH = h;
        }
    };
};

Mousetrap.bind('x', function() {
    if( hasOculus ) {
        document.getElementById('root').setAttribute('render', 'false');
        document.getElementById('leftEye').setAttribute('render', 'true');
        document.getElementById('rightEye').setAttribute('render', 'true');
    } else {
        document.getElementById('root').setAttribute('render', 'true');
        document.getElementById('leftEye').setAttribute('render', 'false');
        document.getElementById('rightEye').setAttribute('render', 'false');
    }
    hasOculus = !hasOculus;
});

}());

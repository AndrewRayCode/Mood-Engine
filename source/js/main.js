var runtime = null;
var rtLeft, rtRight;
var lastW, lastH;

document.onload = function ()
{
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

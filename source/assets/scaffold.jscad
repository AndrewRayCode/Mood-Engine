
function scaffold(numRings, D, TH, bandW){
    var rotX = Math.floor((Math.random()*360) + 1);
    var rotY = Math.floor((Math.random()*360) + 1);
    var rings = [];
    for( var i = 0; i < numRings; i++ ){
        rings.push(ring(D, TH, bandW, rotX*i, rotY*i, 0));
    }
    return union(rings);
}

function ring(D, TH, bandW, rotX, rotY, rotZ){
    return rotate([rotX, rotY, rotZ],intersection(difference(sphere({r: D/2, center:true}), sphere({r: (D/2 - TH/2), center:true})),cube({size : [D*1.5,D*1.5,bandW], center:true})));
}
function main(){
 return scaffold(36,200,3,1);
}

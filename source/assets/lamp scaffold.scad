module scaffold(numRings = 36, D = 200, TH = 3, bandW = 1){
	assign(rotX = rands(0,360,1)[0], rotY = rands(0,360,1)[0], rotZ = rands(0,360,1)[0])
	union() {
		for( i = [0:numRings] ){
			ring(D, TH, bandW, rotX*i, rotY*i, 0);
		}
	}
}

module ring(D = 50, TH = 2, bandW = 4, rotX = 90, rotY = 0, rotZ = 0){
	rotate(a=[rotX, rotY, rotZ]){
		intersection(){
			difference() {
				sphere(r = D/2, $fn=50);
				sphere(r = D/2 - TH/2, $fn=50);
			}
			cube(size = [D*1.5,D*1.5,bandW], center = true);
		}
	}
}

module spine(hs = 1,c=3){
    assign(wi = 0.05*hs, ch = hs*0.1){
        for(a = [360/c:360/c:360]){
            rotate([0,0,a]) rotate([45,0,0]) cylinder(hs*0.3,hs*0.04,hs*0.01);
        }
	}
}
module octStar(D = 200, r = 30){
	cube(size = [r,r,D*1.5], center = true);
	rotate([0,0,45])
	cube(size = [r,r,D*1.5], center = true);
}
module circleToken(D = 200, TH = 3, bandW = 5){
	intersection(){
		difference() {
			sphere(r = D/2, $fn=50);
			sphere(r = D/2 - TH/2, $fn=50);
		}
		translate([0,0,-D/3])
		difference(){
			octStar(r = 30);
			octStar(r = 23);
		}
		//difference() {
		//	cylinder(h = D*1.5, r = 20);
		//	cylinder(h = D*1.5, r = 15);
		//}
	}
}
//octStar();
circleToken();
//scaffold(numRings = 36, D = 200, TH = 3, bandW = 1);

(function() {

var createLight, geometry, material, onResize, render, renderer, nest, circleCharm, starCharm, oculusControls;

var time = Date.now();

var cubes = window.cubes = [];

var group = new THREE.Object3D();

var LampMaterial = new THREE.MeshBasicMaterial();

var scope = window.scope = {
    x: 0,
    y: 0,
    light1position: new THREE.Vector3(1, 1, 1),
    rate: 1
};

var scene = window.scene = new THREE.Scene();

var camera = window.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10000);

renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

oculusControls = new THREE.OculusRiftControls(camera);
scene.add(oculusControls.getObject());

window.camera = camera;
window.scene = scene;
window.renderer = renderer;

var vrEffect = new THREE.VREffect(renderer, function( error ) {
    console.error( error );
});
var vrControls = window.vrControls = vrControls = new THREE.VRControls(camera);

renderer.shadowMapEnabled = true;
renderer.setClearColor( 0x646366, 1 );

onResize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    //effect.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener('resize', onResize, false);

var controls = new THREE.OrbitControls( camera, renderer.domElement );

document.body.appendChild(renderer.domElement);

var ambient = new THREE.PointLight( 0xfffafa );
ambient.intensity = 0.8;
ambient.position.set( 0, 0, 0 );
scene.add( ambient );

scene.add( group );

function createShadowCaster( direction ) {
    var light = new THREE.SpotLight( 0xffffff );
    light.intensity = 0.1;
    light.position.set( 0, 0, 0 );
    light.castShadow = true;

    light.angle = Math.PI / 2;
    var lightTarget = new THREE.Object3D();

    lightTarget.position = direction.clone();
    scene.add(lightTarget);
    light.target = lightTarget;

    //light.shadowCameraVisible = true;
    light.shadowDarkness = 0.5;

    light.shadowMapWidth = 128;
    light.shadowMapHeight = 128;

    light.shadowCameraNear = 10;
    light.shadowCameraFar = 3000;
    light.shadowCameraFov = 90;
    scene.add( light );
}

createShadowCaster( new THREE.Vector3( 0, 0, -1 ) );
createShadowCaster( new THREE.Vector3( -1, 0, 0 ) );
createShadowCaster( new THREE.Vector3( 1, 0, 0 ) );
// no back wall casting
//createShadowCaster( new THREE.Vector3( 0, 0, 1 ) );

// ceiling
createShadowCaster( new THREE.Vector3( 0, 1, 0 ) );
createShadowCaster( new THREE.Vector3( 0, -1, 0 ) );

var wallDepth = 4000,
    wallHeight = 2200;

var floorTexture = new THREE.ImageUtils.loadTexture( 'images/rugfloor.jpg' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;

var floorMaterial = new THREE.MeshBasicMaterial({
    map: floorTexture
});

var floorGeometry = new THREE.PlaneGeometry(wallDepth, wallDepth, 10, 10);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -wallHeight / 2;
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

//var rugTexture = new THREE.ImageUtils.loadTexture( 'images/persain_rug.jpg' );

//var floorMaterial = new THREE.MeshBasicMaterial({
    //map: rugTexture
//});

//var rugGeometry = new THREE.PlaneGeometry(wallDepth / 3, wallDepth / 2, 1, 1);
//var rug = new THREE.Mesh(rugGeometry, floorMaterial);
//rug.position.y = ( -wallHeight / 2 ) + 100;
//rug.rotation.x = -Math.PI / 2;
//scene.add(rug);

var ceilMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture( 'images/wall.jpg' )
});
var ceilingGeometry = new THREE.PlaneGeometry(wallDepth, wallDepth, 10, 10);
var ceiling = new THREE.Mesh(ceilingGeometry, ceilMaterial);
ceiling.position.y = wallHeight / 2;
ceiling.rotation.x = Math.PI / 2;
ceiling.receiveShadow = true;
scene.add(ceiling);

var wallTexture = new THREE.ImageUtils.loadTexture( 'images/walls.jpg' );
wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
wallTexture.repeat.set( 2, 4 );

var wall1Material = new THREE.MeshLambertMaterial({
    map: wallTexture,
});
var wall1Geometry = new THREE.PlaneGeometry(wallHeight, wallDepth, 10, 10);
var wall1 = new THREE.Mesh(wall1Geometry, wall1Material);
wall1.position.x = -wallDepth / 2;
wall1.rotation.y = Math.PI / 2;
wall1.rotation.z = Math.PI / 2;
wall1.receiveShadow = true;
scene.add(wall1);

var wall2Material = new THREE.MeshLambertMaterial({
    map: wallTexture,
});
var wall2Geometry = new THREE.PlaneGeometry(wallHeight, wallDepth, 100, 100);
var wall2 = new THREE.Mesh(wall2Geometry, wall2Material);
wall2.position.x = wallDepth / 2;
wall2.rotation.y = -Math.PI / 2;
wall2.rotation.z = -Math.PI / 2;
wall2.receiveShadow = true;
scene.add(wall2);

var wall3Material = new THREE.MeshLambertMaterial({
    map: wallTexture,
});
var wall3Geometry = new THREE.PlaneGeometry(wallHeight, wallDepth, 100, 100);
var wall3 = new THREE.Mesh(wall3Geometry, wall3Material);
wall3.position.z = wallDepth / 2;
wall3.rotation.y = Math.PI;
wall3.rotation.z = Math.PI / 2;
wall3.receiveShadow = true;
scene.add(wall3);

var wall4Material = new THREE.MeshLambertMaterial({
    map: wallTexture,
});
var wall4Geometry = new THREE.PlaneGeometry(wallHeight, wallDepth, 100, 100);
var frontWall = new THREE.Mesh(wall4Geometry, wall4Material);
frontWall.position.z = -wallDepth / 2;
frontWall.rotation.z = -Math.PI / 2;
frontWall.receiveShadow = true;
scene.add(frontWall);

var outletMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture( 'images/outlet.jpg' ),
});
var outletGeom = new THREE.PlaneGeometry(120, 200, 1, 1);
var outlet = new THREE.Mesh(outletGeom, outletMaterial);
outlet.position.z = ( -wallDepth / 2 ) + 200;
outlet.position.x = ( wallDepth / 2 ) - 200;
outlet.position.y = ( -wallHeight / 2 ) + 200;
scene.add(outlet);

var walls = [ wall1, wall2, wall3, frontWall ];

camera.position.set(180, -60, 1200);

camera.lookAt(new THREE.Vector3(0, 0, 0));

var lights = window.lights = [];

var lightVisualizers = window.lightVisualizers = [];

createLight = function() {
    var light, lightVisualizer;
    light = new THREE.PointLight(0xffffff, 0, 1000);
    scene.add(light);
    lights.push(light);
    lightVisualizer = new THREE.Mesh(new THREE.SphereGeometry(4), new THREE.MeshBasicMaterial(0x555555));
    scene.add(lightVisualizer);
    lightVisualizer.visible = false;
    return lightVisualizers.push(lightVisualizer);
};

var loader = new THREE.OBJLoader();
loader.load( 'models/scaffold.obj', function ( _nest ) {
    nest = _nest;
    nest.castShadow = true;

    nest.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.castShadow = true;
        }
    });
    nest.material = new THREE.MeshBasicMaterial();
    group.add( nest );
});

var flareGeometry = new THREE.PlaneGeometry(500, 500, 100, 100);
var flare = new THREE.Mesh(flareGeometry, new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.7,
    map: new THREE.ImageUtils.loadTexture('images/flare.png')
}));
scene.add( flare );

loader.load( 'models/lampCord.obj', function ( cord ) {
    cord.scale.set( 16, 15.9, 16 );
    cord.position.set( 0, 1050, 0 );
    scene.add( cord );
});

var defaultVariation = 0.5;
loader.load( 'models/star.obj', function ( star ) {
    
    star.castShadow = true;
    var geometry = star.children[0].geometry;

    for (var i = 0; i < 10; i++){
        var xRot = randFloat( -Math.PI / 2, Math.PI / 2 );
        var zRot = Math.random() * Math.PI * 2;

        if( i > 6 ) {
            xRot = randFloat(
                ( -Math.PI / 2 ) - defaultVariation,
                ( -Math.PI / 2 ) + defaultVariation
            );
            zRot = randFloat(
                -defaultVariation,
                defaultVariation
            );
        }

        var charm = new THREE.Mesh(
            geometry,
            new THREE.MeshLambertMaterial({
                color: 0x111111
            })
        );

        //charm.rotation.order = "ZXY";
        //charm.up = new THREE.Vector3(0, 1, 0);
        charm.rotation.x = xRot;
        charm.rotation.z = zRot;

        charms.push( charm );

        charm.geometry.computeBoundingBox();

        var BB = charm.geometry.boundingBox.clone();
        var x = (BB.min.x + BB.max.x)/2.0;
        var y = (BB.min.y + BB.max.y)/2.0;
        var z = (BB.min.z + BB.max.z)/2.0;

        var width = BB.max.x - BB.min.x;
        var height = BB.max.y - BB.min.y;
        var depth = BB.max.z - BB.min.z;

        var cube = new THREE.Mesh(new THREE.CubeGeometry(width,height,depth));

        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        cube.visible = false;
    
        charm.add(cube);
        group.add( charm );
        cubes.push( cube );
        charm.castShadow = true;

    }
});

var charms = window.charms = [];

loader.load( 'models/circle.obj', function ( circle ) {
    
    circle.castShadow = true;
    var geometry = circle.children[0].geometry;

    for (var i = 0; i < 10; i++){
        var xRot = randFloat( -Math.PI / 2, Math.PI / 2 );
        var zRot = Math.random() * Math.PI * 2;

        var charm = new THREE.Mesh(
            geometry,
            new THREE.MeshLambertMaterial({
                color: 0x111111
            })
        );

        if( i > 6 ) {
            xRot = randFloat(
                ( -Math.PI / 2 ) - defaultVariation,
                ( -Math.PI / 2 ) + defaultVariation
            );
            zRot = randFloat(
                -defaultVariation,
                defaultVariation
            );
        }
        charm.rotation.x = xRot;
        charm.rotation.z = zRot;

        charms.push( charm );

        charm.geometry.computeBoundingBox();

        var BB = charm.geometry.boundingBox.clone();
        var x = (BB.min.x + BB.max.x)/2.0;
        var y = (BB.min.y + BB.max.y)/2.0;
        var z = (BB.min.z + BB.max.z)/2.0;

        var width = BB.max.x - BB.min.x;
        var height = BB.max.y - BB.min.y;
        var depth = BB.max.z - BB.min.z;

        var cube = new THREE.Mesh(new THREE.CubeGeometry(width,height,depth));

        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        cube.visible = false;
    
        charm.add(cube);
        cube.name = 'circle_cube' + i;
        charm.name = 'circle_charm' + i;
        group.add( charm );
        cubes.push( cube );
        charm.castShadow = true;

    }
});

var scale = 50;

render = function() {

    var vrState = vrControls.getVRState();

    if( vrState && vrState.hmd ) {

        //var cPos = oculusControls.getObject().position;
        var vrPos = vrState.hmd.position;

        var pos = vrPos;
        pos[0] *= scale;
        pos[1] *= scale;
        pos[2] *= scale;

        //camera.position.fromArray(pos);
        oculusControls.update(Date.now() - time, vrState);

        vrControls.update();
        //vrEffect.render(scene, camera);

        //oculusControls.update();
        //group.rotation.y += 0.002;

        flare.quaternion.copy( camera.quaternion );
    }
    renderer.render(scene, camera);
    controls.update();

    time = Date.now();

    requestAnimationFrame(render);
};

render();

var toggled = false;
Mousetrap.bind('space', function() {
    if( toggled ) {
        camera.position.set( 0, 0, 150 );
        group.rotation.y = Math.PI;
    } else {
        camera.position.set(180, -60, 1200);
        group.rotation.y = 0;
    }
    camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );
    toggled = !toggled;
});

function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}

}).call(this);

/* global SPE:true */
(function() {

var geometry, material, onResize, render, renderer, nest,
    circleCharm, starCharm, oculusControls, room;

var SHADOW_MAP_RESOLUTION = 1024;
var ROOM_SCALE = 400;

var clock = new THREE.Clock();

var lights = window.lights = [];

var stats = new window.Stats();
stats.setMode(0); // 0: fps, 1: ms

stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';
stats.domElement.style.display = 'none';

document.body.appendChild( stats.domElement );

var time = Date.now();

var charms = window.charms = [];
var charmBoundingBoxes = window.charmBoundingBoxes = [];

var group = new THREE.Object3D();

var LampMaterial = new THREE.MeshBasicMaterial();

var scope = window.scope = {
    x: 0,
    y: 0,
    light1position: new THREE.Vector3(1, 1, 1),
    rate: 1
};

var scene = window.scene = new THREE.Scene();

var camera = window.camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    50000
);

renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

oculusControls = new THREE.OculusRiftControls(camera);
scene.add(oculusControls.getObject());

window.camera = camera;
window.scene = scene;
window.renderer = renderer;

// Particles
// Create a particle group to add the emitter to.
var particleGroup = new SPE.Group({
    // Give the particles in this group a texture
    texture: THREE.ImageUtils.loadTexture('images/flare.png'),
    // How long should the particles live for? Measured in seconds.
    maxAge: 5
});

// Create a single emitter
var particleEmitter = window.emitter = new SPE.Emitter({
    type: 'sphere',
    position: new THREE.Vector3(0, 0, 0),
    blending: THREE.NoBlending,
    radius: 20,
    speed: 100,
    particlesPerSecond: 500,
    sizeStart: 400,
    sizeEnd: 300,
    opacityStart: 1,
    opacityEnd: 0,
    angleAlignVelocity: 1,
    colorStart: new THREE.Color('white'),
    colorStartSpread: new THREE.Vector3(100, 100, 100),
    colorEndSpread: new THREE.Vector3(100, 100, 100),
    alive: 0
});

// Add the emitter to the group.
window.particleGroup = particleGroup;
particleGroup.addEmitter( particleEmitter );

// Add the particle group to the scene so it can be drawn.
scene.add( particleGroup.mesh ); // Where `scene` is an instance of `THREE.Scene`.

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
};

window.addEventListener('resize', onResize, false);

var controls = new THREE.OrbitControls( camera, renderer.domElement );

document.body.appendChild(renderer.domElement);

var ambient = new THREE.PointLight( 0xf0f0ff );
ambient.intensity = 1.1;
ambient.position.set( 0, 0, 0 );
scene.add( ambient );

scene.add( group );

function createShadowCaster( direction ) {
    var light = new THREE.SpotLight( 0xffffff );
    light.intensity = 0.0;
    light.position.set( 0, 0, 0 );

    //lights.push( light );

    light.castShadow = true;

    light.angle = Math.PI / 2;
    var lightTarget = new THREE.Object3D();

    lightTarget.position.copy( direction );
    scene.add(lightTarget);
    light.target = lightTarget;

    //light.shadowCameraVisible = true;
    light.shadowDarkness = 0.5;

    light.shadowMapWidth = SHADOW_MAP_RESOLUTION;
    light.shadowMapHeight = SHADOW_MAP_RESOLUTION;

    light.shadowCameraNear = 10;
    light.shadowCameraFar = 5000;
    light.shadowCameraFov = 90;
    scene.add( light );
}

createShadowCaster( new THREE.Vector3( 0, 0, -1 ) );
createShadowCaster( new THREE.Vector3( -1, 0, 0 ) );
createShadowCaster( new THREE.Vector3( 1, 0, 0 ) );
//// no back wall casting
createShadowCaster( new THREE.Vector3( 0, 0, 1 ) );

//// ceiling
createShadowCaster( new THREE.Vector3( 0, 1, 0 ) );
createShadowCaster( new THREE.Vector3( 0, -1, 0 ) );

var wallDepth = 8000,
    wallHeight = 2450;

var floorTexture = new THREE.ImageUtils.loadTexture( 'images/wood.jpg' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set( 2, 4 );
var floorMaterial = new THREE.MeshPhongMaterial({
    map: floorTexture
});

var floorGeometry = new THREE.PlaneBufferGeometry(wallDepth, wallDepth, 10, 10);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -wallHeight / 2;
floor.receiveShadow = true;
scene.add(floor);

var sphereGeometry = new THREE.SphereGeometry(60, 60, 10, 10);
var sphere = window.sphere = new THREE.Mesh(sphereGeometry, new THREE.MeshBasicMaterial({
    color: 0xff0000
}));
sphere.visible = false;
scene.add(sphere);

camera.position.set(180, -60, 1200);

camera.lookAt(new THREE.Vector3(0, 0, 0));

var lightVisualizers = window.lightVisualizers = [];

var jsonLoader = new THREE.ObjectLoader();
jsonLoader.load( 'models/untitled-scene.json', function( _room ) {
    // Room is a scene. Find the "room"
    window.room = room = _room.children[ 0 ];
    room.receiveShadow = true;

    room.material = new THREE.MeshPhongMaterial({
        color: 0xffffff
    });
    scene.add( room );

    room.scale.set( ROOM_SCALE, ROOM_SCALE, ROOM_SCALE );
});

var objLoader = new THREE.OBJLoader();
objLoader.load( 'models/scaffold.obj', function ( _nest ) {
    nest = _nest.children[ 0 ];
    nest.castShadow = true;
    //nest.material = new THREE.MeshBasicMaterial();
    group.add( nest );
});

objLoader.load( 'models/1.obj', function ( _couch ) {
    var couch = _couch.children[0];
    couch.material = new THREE.MeshPhongMaterial({
        color: 0xeeffff
    });
    couch.receiveShadow = true;
    var couchScale = 90;
    window.couch = couch;

    couch.rotation.y =  -Math.PI / 2;
    couch.position.set( 3800, -2600, -3000 );

    couch.scale.set( couchScale, couchScale, couchScale );
    scene.add( couch );
});

// Skybox

var path = "images/MilkyWay/dark-s_";
var format = ".jpg";
var urls = [
    path + 'px' + format, path + 'nx' + format,
    path + 'py' + format, path + 'ny' + format,
    path + 'pz' + format, path + 'nz' + format
];

var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
reflectionCube.format = THREE.RGBFormat;

var shader = THREE.ShaderLib.cube;
shader.uniforms.tCube.value = reflectionCube;

var skyboxMaterial = new THREE.ShaderMaterial( {
    fragmentShader: shader.fragmentShader,
    vertexShader: shader.vertexShader,
    uniforms: shader.uniforms,
    depthWrite: false,
    side: THREE.BackSide
});

var skyboxMesh = new THREE.Mesh( new THREE.BoxGeometry( 100, 100, 100 ), skyboxMaterial );
var skyboxScale = 500;
skyboxMesh.rotation.x -= Math.PI / 2;
skyboxMesh.scale.set( skyboxScale, skyboxScale, skyboxScale );
scene.add( skyboxMesh );


var flareGeometry = new THREE.PlaneBufferGeometry(500, 500, 100, 100);
var flare = new THREE.Mesh(flareGeometry, new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.7,
    map: new THREE.ImageUtils.loadTexture('images/flare.png')
}));
scene.add( flare );

objLoader.load( 'models/lampCord.obj', function ( cord ) {
    cord.scale.set( 16, 15.9, 16 );
    cord.position.set( 0, 1050, 0 );
    scene.add( cord );
});

var defaultVariation = 0.5;
objLoader.load( 'models/star.obj', function ( star ) {
    
    var geometry = star.children[0].geometry;

    for (var i = 0; i < 10 ; i++){
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

        charm.castShadow = true;

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

        var cube = new THREE.Mesh(new THREE.BoxGeometry(width,height,depth));

        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        cube.visible = false;
    
        charm.add( cube );
        group.add( charm );

        charmBoundingBoxes.push( cube );

    }
});

objLoader.load( 'models/circle.obj', function ( circle ) {
    
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

        var cube = new THREE.Mesh(new THREE.BoxGeometry(width,height,depth));

        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        cube.visible = false;
    
        charm.add(cube);
        cube.name = 'circle_cube' + i;
        charm.name = 'circle_charm' + i;
        group.add( charm );

        charmBoundingBoxes.push( cube );

        charm.castShadow = true;

    }
});

var scale = 50;

render = function() {

    stats.begin();

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

    }
    flare.quaternion.copy( camera.quaternion );
    renderer.render(scene, camera);
    controls.update();
    particleGroup.tick(clock.getDelta());

    time = Date.now();

    stats.end();

    requestAnimationFrame(render);
};

render();

var toggled = true;
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

Mousetrap.bind('s', function() {

    stats.domElement.style.display =
        stats.domElement.style.display === 'block' ? 'none' : 'block';

    sphere.visible = !sphere.visible;

});

function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}

}).call(this);

(function() {

var createLight, effect, geometry, material, onResize, render, renderer;

window.scope = {
    x: 0,
    y: 0,
    light1position: new THREE.Vector3(1, 1, 1),
    rate: 1
};

window.scene = new THREE.Scene();

window.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);

renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

effect = new THREE.OculusRiftEffect(renderer, {
    worldScale: 2
});

effect.setSize(window.innerWidth, window.innerHeight);

renderer.shadowMapEnabled = true;
renderer.setClearColor( 0xff0000, 1 );

onResize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    return effect.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener('resize', onResize, false);

controls = new THREE.OrbitControls( camera, renderer.domElement );

document.body.appendChild(renderer.domElement);

var ambient = new THREE.PointLight( 0xddffdd );
ambient.intensity = 0.2;
ambient.position.set( 0, 0, 0 );
scene.add( ambient );

var light = new THREE.SpotLight( 0xffffff );
light.intensity = 0.8;
light.position.set( 0, 0, 0 );
light.castShadow = true;

light.angle = Math.PI / 2;
var lightTarget = new THREE.Object3D();

lightTarget.position.set(0,0,-1);
scene.add(lightTarget);
light.target = lightTarget;

light.shadowCameraVisible = true;
light.shadowDarkness = 0.95;

light.shadowMapWidth = 1024;
light.shadowMapHeight = 1024;

light.shadowCameraNear = 0.01;
light.shadowCameraFar = 800;
light.shadowCameraFov = 90;
scene.add( light );

var material = new THREE.MeshLambertMaterial({
    color: 0xdddddd
});

var wallSize = 800,
    wallOffset = wallSize / 2;

var floorGeometry = new THREE.PlaneGeometry(wallSize, wallSize, 100, 100);
var floor = new THREE.Mesh(floorGeometry, material);
floor.position.y = wallOffset
floor.rotation.x = Math.PI / 2;
scene.add(floor);

var ceilingGeometry = new THREE.PlaneGeometry(wallSize, wallSize, 100, 100);
var ceiling = new THREE.Mesh(ceilingGeometry, material);
ceiling.position.y = -wallOffset;
ceiling.rotation.x = -Math.PI / 2;
scene.add(ceiling);

var wall1Geometry = new THREE.PlaneGeometry(wallSize, wallSize, 100, 100);
var wall1 = new THREE.Mesh(wall1Geometry, material);
wall1.position.x = -wallOffset;
wall1.rotation.y = Math.PI / 2;
wall1.receiveShadow = true;
scene.add(wall1);

var wall2Geometry = new THREE.PlaneGeometry(wallSize, wallSize, 100, 100);
var wall2 = new THREE.Mesh(wall2Geometry, material);
wall2.position.x = wallOffset;
wall2.rotation.y = -Math.PI / 2;
wall2.receiveShadow = true;
scene.add(wall2);

var wall3Geometry = new THREE.PlaneGeometry(wallSize, wallSize, 100, 100);
var wall3 = new THREE.Mesh(wall3Geometry, material);
wall3.position.z = wallOffset;
wall3.rotation.z = -Math.PI / 2;
wall3.receiveShadow = true;
scene.add(wall3);

var wall4Geometry = new THREE.PlaneGeometry(wallSize, wallSize, 100, 100);
var wall4 = new THREE.Mesh(wall4Geometry, material);
wall4.position.z = -wallOffset;
wall4.rotation.z = -Math.PI / 2;
wall4.receiveShadow = true;
scene.add(wall4);

camera.position.fromArray([0, 160, 200]);

camera.lookAt(new THREE.Vector3(0, 0, 0));

window.lights = [];

window.lightVisualizers = [];

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
loader.load( 'models/lamp.obj', function ( nest ) {
    nest.castShadow = true;
    nest.position.y = - 80;

    nest.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.castShadow = true;
        }
    });
    scene.add( nest );
});


render = function() {
    effect.render(scene, camera);
    controls.update();
    return requestAnimationFrame(render);
};

render();

}).call(this);

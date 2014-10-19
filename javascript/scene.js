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

function createShadowCaster( direction ) {
    var light = new THREE.SpotLight( 0xffffff );
    light.intensity = 0.8;
    light.position.set( 0, 0, 0 );
    light.castShadow = true;

    light.angle = Math.PI / 2;
    var lightTarget = new THREE.Object3D();

    lightTarget.position = direction.clone();
    scene.add(lightTarget);
    light.target = lightTarget;

    //light.shadowCameraVisible = true;
    light.shadowDarkness = 0.95;

    light.shadowMapWidth = 512;
    light.shadowMapHeight = 512;

    light.shadowCameraNear = 0.01;
    light.shadowCameraFar = 800;
    light.shadowCameraFov = 90;
    scene.add( light );
}

createShadowCaster( new THREE.Vector3( 0, 0, -1 ) );
createShadowCaster( new THREE.Vector3( 0, 0, 1 ) );
createShadowCaster( new THREE.Vector3( 0, -1, 0 ) );
createShadowCaster( new THREE.Vector3( 0, 1, 0 ) );
createShadowCaster( new THREE.Vector3( -1, 0, 0 ) );
createShadowCaster( new THREE.Vector3( 1, 0, 0 ) );

var wallSize = 1600,
    wallOffset = wallSize / 2;

var floorMaterial = new THREE.MeshLambertMaterial({
    color: 0xdddddd
});
var floorGeometry = new THREE.PlaneGeometry(wallSize, wallSize, 100, 100);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = wallOffset
floor.rotation.x = Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

var ceilMaterial = new THREE.MeshLambertMaterial({
    color: 0xdddddd
});
var ceilingGeometry = new THREE.PlaneGeometry(wallSize, wallSize, 100, 100);
var ceiling = new THREE.Mesh(ceilingGeometry, ceilMaterial);
ceiling.position.y = -wallOffset;
ceiling.rotation.x = -Math.PI / 2;
ceiling.receiveShadow = true;
scene.add(ceiling);

var wall1Material = new THREE.MeshLambertMaterial({
    color: 0xdddddd
});
var wall1Geometry = new THREE.PlaneGeometry(wallSize, wallSize, 100, 100);
var wall1 = new THREE.Mesh(wall1Geometry, wall1Material);
wall1.position.x = -wallOffset;
wall1.rotation.y = Math.PI / 2;
wall1.receiveShadow = true;
scene.add(wall1);

var wall2Material = new THREE.MeshLambertMaterial({
    color: 0xdddddd
});
var wall2Geometry = new THREE.PlaneGeometry(wallSize, wallSize, 100, 100);
var wall2 = new THREE.Mesh(wall2Geometry, wall2Material);
wall2.position.x = wallOffset;
wall2.rotation.y = -Math.PI / 2;
wall2.receiveShadow = true;
scene.add(wall2);

var wall3Material = new THREE.MeshLambertMaterial({
    color: 0xdddddd
});
var wall3Geometry = new THREE.PlaneGeometry(wallSize, wallSize, 100, 100);
var wall3 = new THREE.Mesh(wall3Geometry, wall3Material);
wall3.position.z = wallOffset;
wall3.rotation.y = Math.PI;
wall3.receiveShadow = true;
scene.add(wall3);
window.wall3 = wall3;

var wall4Material = new THREE.MeshLambertMaterial({
    color: 0xdddddd
});
var wall4Geometry = new THREE.PlaneGeometry(wallSize, wallSize, 100, 100);
var wall4 = new THREE.Mesh(wall4Geometry, wall4Material);
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

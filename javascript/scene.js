(function() {

var createLight, cube, cube2, effect, geometry, material, onResize, render, renderer;

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

onResize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    return effect.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener('resize', onResize, false);

document.body.appendChild(renderer.domElement);

geometry = new THREE.CubeGeometry(75, 75, 16);

material = new THREE.MeshPhongMaterial({
    color: 0x0000ff
});

cube = new THREE.Mesh(geometry, material);

cube.position.set(80, 0, -400);

cube.receiveShadow = true;

scene.add(cube);

geometry = new THREE.CubeGeometry(75, 75, 16);

material = new THREE.MeshPhongMaterial({
    color: 0x0000ff
});

cube2 = new THREE.Mesh(geometry, material);

cube2.position.set(-80, 0, -400);

cube2.castShadow = true;

cube2.receiveShadow = true;

scene.add(cube2);

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

createLight();

createLight();

createLight();

createLight();

var loader = new THREE.OBJLoader();
loader.load( 'models/lamp.obj', function ( object ) {
    object.position.y = - 80;
    scene.add( object );

});


render = function() {
    cube.rotation.x += scope.rate * 0.004;
    cube.rotation.y += scope.rate * 0.002;
    cube2.rotation.x += scope.rate * 0.004;
    cube2.rotation.y += scope.rate * 0.002;
    effect.render(scene, camera);
    return requestAnimationFrame(render);
};

render();

}).call(this);

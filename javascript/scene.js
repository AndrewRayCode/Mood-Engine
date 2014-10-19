(function() {

var createLight, effect, geometry, material, onResize, render, renderer, nest, circleCharm, starCharm;

var LampMaterial = new THREE.MeshBasicMaterial();

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
renderer.setClearColor( 0x646366, 1 );

onResize = function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    return effect.setSize(window.innerWidth, window.innerHeight);
};

window.addEventListener('resize', onResize, false);

controls = new THREE.OrbitControls( camera, renderer.domElement );

document.body.appendChild(renderer.domElement);

var ambient = new THREE.PointLight( 0xfffafa );
ambient.intensity = 0.8;
ambient.position.set( 0, 0, 0 );
scene.add( ambient );

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

    light.shadowMapWidth = 256;
    light.shadowMapHeight = 256;

    light.shadowCameraNear = 10;
    light.shadowCameraFar = 3000;
    light.shadowCameraFov = 90;
    scene.add( light );
}

createShadowCaster( new THREE.Vector3( 0, 0, -1 ) );
createShadowCaster( new THREE.Vector3( 0, 0, 1 ) );
createShadowCaster( new THREE.Vector3( -1, 0, 0 ) );
createShadowCaster( new THREE.Vector3( 1, 0, 0 ) );

// floor
createShadowCaster( new THREE.Vector3( 0, 1, 0 ) );

var wallDepth = 4000,
    wallHeight = 2200;

var floorTexture = new THREE.ImageUtils.loadTexture( 'images/wood.jpg' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set( 2, 4 );

var floorMaterial = new THREE.MeshBasicMaterial({
    map: floorTexture
});

var floorGeometry = new THREE.PlaneGeometry(wallDepth, wallDepth, 100, 100);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -wallHeight / 2;
floor.rotation.x = -Math.PI / 2;
//floor.receiveShadow = true;
scene.add(floor);

var ceilMaterial = new THREE.MeshLambertMaterial({
    map: THREE.ImageUtils.loadTexture( 'images/wall.jpg' )
});
var ceilingGeometry = new THREE.PlaneGeometry(wallDepth, wallDepth, 100, 100);
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
var wall1Geometry = new THREE.PlaneGeometry(wallHeight, wallDepth, 100, 100);
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
wall3.rotation.z = Math.PI / 2
wall3.receiveShadow = true;
scene.add(wall3);

var wall4Material = new THREE.MeshLambertMaterial({
    map: wallTexture,
});
var wall4Geometry = new THREE.PlaneGeometry(wallHeight, wallDepth, 100, 100);
var wall4 = new THREE.Mesh(wall4Geometry, wall4Material);
wall4.position.z = -wallDepth / 2;
wall4.rotation.z = -Math.PI / 2;
wall4.receiveShadow = true;
scene.add(wall4);

walls = [ wall1, wall2, wall3, wall4 ];

camera.position.fromArray([0, 160, 800]);

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
loader.load( 'models/scaffold.obj', function ( _nest ) {
    nest = _nest;
    nest.castShadow = true;

    nest.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.castShadow = true;
        }
    });
    scene.add( nest );
});

var flareGeometry = new THREE.PlaneGeometry(500, 500, 100, 100);
var flare = new THREE.Mesh(flareGeometry, new THREE.MeshBasicMaterial({
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.7,
    map: new THREE.ImageUtils.loadTexture('images/flare.png')
}));
scene.add( flare );

var starCharm;
loader.load( 'models/star.obj', function ( star ) {
    star.castShadow = true;

    star.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
            child.castShadow = true;
        }
    });
});

var charms = [];
loader.load( 'models/circle.obj', function ( circle ) {

   // circle.traverse( function ( child ) {
   //     if ( child instanceof THREE.Mesh ) {
   //         child.castShadow = true;
   //     }
   // });
    
    circle.castShadow = true;
    var geometry = circle.children[0].geometry;

    for (var i = 0; i < 10; i++){
      var xRot = Math.random()*Math.PI;
      var zRot = Math.random()*Math.PI*2;
      var charm = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());

      charm.rotation.order = "ZXY";
      charm.rotation.x = xRot;
      charm.rotation.z = zRot;

      charms[i] = charm;

      charms[i].geometry.computeBoundingBox();

      charm.castShadow = true;
      scene.add( charm );

      //var BB = charms[i].geometry.boundingBox.clone();
      //var x = (BB.min.x + BB.max.x)/2.0;
      //var y = (BB.min.y + BB.max.y)/2.0;
      //var z = (BB.min.z + BB.max.z)/2.0;
      //console.log(BB.size.width); 
      //console.log(cube);
      //var cube = new THREE.Mesh(new THREE.CubeGeometry(BB.size.width, BB.size.height, BB.size.depth),LampMaterial);
      //cube.position.x = x;
      //cube.position.y = y;
      //cube.position.z = z;
      //cube.visible = true;
  
      //charms[i].add(cube);
      //scene.add( cube );

    }
});




render = function() {
    effect.render(scene, camera);
    controls.update();
    nest && ( nest.rotation.y += 0.002 );
    flare.quaternion.copy( camera.quaternion );
    return requestAnimationFrame(render);
};

render();

}).call(this);

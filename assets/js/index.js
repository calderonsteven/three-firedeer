(function(global, $, THREE) {

    var app, App = function(id) {
        app = this;
        app.init(id);
    };

    App.prototype = {

        init : function(id) {

            var $dom = $("#" + id);

            var scene = this.scene = window.scene = new THREE.Scene();
            var camera = this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
            camera.position.z = 1.13;
            camera.position.x = -0.40;
            camera.rotation.y = -0.34;

            scene.add(camera);

            //directional light
            var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
            directionalLight.position.set( 0, 1, 0 );
            directionalLight.color.r = 0;
            directionalLight.color.g = 0.4;
            directionalLight.color.b = 0.4627450980392157;
            directionalLight.intensity = 2;

            scene.add( directionalLight );

            var renderer = new THREE.WebGLRenderer({
                alpha: true,
                antialias: true
            });

            renderer.setClearColor(0x000000);
            renderer.setSize(window.innerWidth, window.innerHeight);
            $dom.append(renderer.domElement);

            var fireTex = THREE.ImageUtils.loadTexture("assets/textures/firetex.png");
            var fire = new THREE.Fire(fireTex);
            scene.add(fire);

            var clock = new THREE.Clock();
            var controls = new THREE.OrbitControls( camera, renderer.domElement );
    				controls.enableDamping = false;
    				controls.dampingFactor = 0.25;
    				controls.enableZoom = false;
            controls.minPolarAngle = Math.PI / 4;
            controls.maxPolarAngle = Math.PI / 2;


            var controller = {
                speed       : 0.7,
                magnitude   : 4.2,
                lacunarity  : 2.6,
                gain        : 0.4,
                noiseScaleX : 1.0,
                noiseScaleY : 2.5,
                noiseScaleZ : 1.2,
                wireframe   : false
            };

            fire.material.uniforms.magnitude.value = controller.magnitude;

            //load deer OBJ
            var manager = new THREE.LoadingManager();
    				manager.onProgress = function ( item, loaded, total ) {
    					console.log( item, loaded, total );
    				};

            var loader = new THREE.ImageLoader( manager );
            var loader = new THREE.OBJLoader( manager );
    				loader.load( 'assets/models/deer.obj', function ( object ) {
              //
              object.scale.x = object.scale.y = object.scale.z = 0.002;
              object.position.y = -0.46;
              object.position.z = -0.06;

              object.children[0].material.color.r = 250;

              //add light
              var light = new THREE.PointLight( 0xFFFF33, 1, 100 );
              light.position.set( 0, 0, 0 );
              object.add( light );

    					scene.add( object );
    				});


            (function loop() {
                requestAnimationFrame(loop);

                var delta = clock.getDelta();
                //trackballControls.update(delta);
                controls.update();

                var t = clock.elapsedTime * controller.speed;
                fire.update(t);

                renderer.render(scene, camera);
            })();

            var updateRendererSize = function() {
                var w = window.innerWidth;
                var h = window.innerHeight;

                camera.aspect = w / h;
                camera.updateProjectionMatrix();

                renderer.setSize(w, h);
            };

            $(window).on('resize', updateRendererSize);
        }

    };

    global.App = App;

})(window, $, THREE);

$(function() {
    new App("viewer");
});

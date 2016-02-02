window.addEventListener("load", function init() {

	window.removeEventListener("load", init);

	// Renderer and Scene.

	var renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
	var scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x000000, 0.001);
	renderer.setClearColor(0x000000);
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	// Camera.

	var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 20000);
	var controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 0, 0);
	controls.damping = 0.2;
	camera.position.set(0, 200, 450);
	camera.lookAt(controls.target);

	scene.add(camera);

	// Overlays.

	var stats = new Stats();
	stats.setMode(0);
	var aside = document.getElementById("aside");
	aside.style.visibility = "visible";
	aside.appendChild(stats.domElement);

	var gui = new dat.GUI();
	aside.appendChild(gui.domElement.parentNode);

	// Hide interface on alt key press.
	document.addEventListener("keydown", function(event) {

		if(event.altKey) {

			event.preventDefault();
			aside.style.visibility = (aside.style.visibility === "hidden") ? "visible" : "hidden";

		}

	});

	// Lights.

	var hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
	var directionalLight = new THREE.DirectionalLight(0xffbbaa);

	directionalLight.position.set(-1, 1, 1);
	directionalLight.target.position.copy(scene.position);

	scene.add(directionalLight);
	scene.add(hemisphereLight);

	// Random objects.

	object = new THREE.Object3D();

	var i, mesh;
	var geometry = new THREE.SphereBufferGeometry(1, 4, 4);
	var material = new THREE.MeshPhongMaterial({color: 0xffffff, shading: THREE.FlatShading});

	for(i = 0; i < 100; ++i) {

		material = new THREE.MeshPhongMaterial({color: 0xffffff * Math.random(), shading: THREE.FlatShading});

		mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
		mesh.position.multiplyScalar(Math.random() * 400);
		mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 50;
		object.add(mesh);

	}

	scene.add(object);

	// Post-Processing.

	var composer = new POSTPROCESSING.EffectComposer(renderer);
	composer.addPass(new POSTPROCESSING.RenderPass(scene, camera));

	var pass = new POSTPROCESSING.DotScreenPass({
		scale: 0.5,
		angle: Math.PI * 0.5,
		patternSize: 1.0
	});

	pass.renderToScreen = true;
	composer.addPass(pass);

	// Shader settings.

	var params = {
		"scale": pass.material.uniforms.scale.value,
		"angle": pass.material.uniforms.angle.value,
		"center X": pass.material.uniforms.offsetRepeat.value.x,
		"center Y": pass.material.uniforms.offsetRepeat.value.y
	};

	gui.add(params, "scale").min(0.0).max(1.0).step(0.01).onChange(function() { pass.material.uniforms.scale.value = params["scale"]; });
	gui.add(params, "angle").min(0.0).max(Math.PI).step(0.001).onChange(function() { pass.material.uniforms.angle.value = params["angle"]; });

	var f = gui.addFolder("Center");
	f.add(params, "center X").min(-1.0).max(1.0).step(0.01).onChange(function() { pass.material.uniforms.offsetRepeat.value.x = params["center X"]; });
	f.add(params, "center Y").min(-1.0).max(1.0).step(0.01).onChange(function() { pass.material.uniforms.offsetRepeat.value.y = params["center Y"]; });
	f.open();

	/**
	 * Handles resizing.
	 */

	window.addEventListener("resize", function resize() {

		var width = window.innerWidth;
		var height = window.innerHeight;

		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		composer.reset();

	});

	/**
	 * Animation loop.
	 */

	var TWO_PI = 2.0 * Math.PI;

	(function render(now) {

		stats.begin();

		object.rotation.x += 0.0005;
		object.rotation.y += 0.001;

		composer.render();

		// Prevent overflow.
		if(object.rotation.x >= TWO_PI) { object.rotation.x -= TWO_PI; }
		if(object.rotation.y >= TWO_PI) { object.rotation.y -= TWO_PI; }

		stats.end();

		requestAnimationFrame(render);

	}());

});
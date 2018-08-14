
/**
 * Textures / markers => dossier assets contenu dans public
 */

export default class UIRoot {
	constructor() {
		this.init()

	}

	init() {
		document.addEventListener("DOMContentLoaded", function (event) {

			// Array of functions for the rendering loop
			let onRenderFcts = [];
			const _root = new THREE.Group();
			const _body = document.body;

			// Init name of molecule
			const _name = document.createElement( 'div' );
			_name.innerHTML ='MOLECULE';
			_name.id="name";
			_name.style.position = "absolute";
			_name.style.top = "5px";
			_name.style.right = "5px";
			_name.style.color = "#ffffff";
			_body.appendChild( _name );


			// Init labelRenderer
			let labelRenderer = new THREE.CSS2DRenderer();
			labelRenderer.setSize(window.innerWidth, window.innerHeight);
			labelRenderer.domElement.style.position = 'absolute';
			labelRenderer.domElement.style.top = '0';
			labelRenderer.domElement.style.pointerEvents = 'none';
			_body.appendChild(labelRenderer.domElement);

			// Init renderer
			const renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true
			});
			renderer.setClearColor(new THREE.Color('lightgrey'), 0)
			// renderer.setPixelRatio( 1/2 );
			renderer.setSize(window.innerWidth, window.innerHeight);
			renderer.domElement.style.position = 'absolute'
			renderer.domElement.style.top = '0px'
			renderer.domElement.style.left = '0px'
			_body.appendChild(renderer.domElement);

			// init scene and camera
			const scene = new THREE.Scene();

			//////////////////////////////////////////////////////////////////////////////////
			//		Initialize a basic camera
			//////////////////////////////////////////////////////////////////////////////////

			// Create a camera
			const camera = new THREE.Camera();
			scene.add(camera);


			////////////////////////////////////////////////////////////////////////////////
			//          handle arToolkitSource
			////////////////////////////////////////////////////////////////////////////////

			var arToolkitSource = new THREEx.ArToolkitSource({
				// to read from the webcam 
				sourceType: 'webcam',

				// to read from an image
				// sourceType : 'image',
				// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',		

				// to read from a video
				// sourceType : 'video',
				// sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',		
			})

			arToolkitSource.init(function onReady() {
				onResize()
			})

			// handle resize
			window.addEventListener('resize', function () {
				onResize()
			})
			function onResize() {
				arToolkitSource.onResizeElement()
				arToolkitSource.copyElementSizeTo(renderer.domElement)
				if (arToolkitContext.arController !== null) {
					arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas)
				}
			}
			////////////////////////////////////////////////////////////////////////////////
			//          initialize arToolkitContext
			////////////////////////////////////////////////////////////////////////////////


			// create atToolkitContext
			var arToolkitContext = new THREEx.ArToolkitContext({
				cameraParametersUrl: './assets/data/camera_para.dat',
				detectionMode: 'mono',
				maxDetectionRate: 30,
				canvasWidth: 80 * 3,
				canvasHeight: 60 * 3,
				debug: !true
			})
			// initialize it
			arToolkitContext.init(function onCompleted() {
				// copy projection matrix to camera
				camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
			})

			// update artoolkit on every frame
			onRenderFcts.push(function () {
				if (arToolkitSource.ready === false) return
				arToolkitContext.update(arToolkitSource.domElement)
			})


			////////////////////////////////////////////////////////////////////////////////
			//          Create a ArMarkerControls
			////////////////////////////////////////////////////////////////////////////////

			var markerRoot = new THREE.Group
			scene.add(markerRoot)

			var artoolkitMarker = []
			artoolkitMarker[0] = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
				type: 'pattern',
				identity: 'dihydrogène',
				patternUrl: './assets/data/h2.patt'

			})

			artoolkitMarker[1] = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
				type: 'pattern',
				patternUrl: './assets/data/hcl.patt',
				identity: 'chlorure d\'hydrogène'

			})

			artoolkitMarker[2] = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
				type: 'pattern',
				patternUrl: './assets/data/nh3.patt',
				identity: 'ammoniac',

			})


			artoolkitMarker[3] = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
				type: 'pattern',
				patternUrl: './assets/data/co2.patt',
				identity: 'dioxyde de carbone',

			})
			artoolkitMarker[4] = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
				type: 'pattern',
				patternUrl: './assets/data/h2o.patt',
				identity: 'eau',

			})
			artoolkitMarker[5] = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
				type: 'pattern',
				patternUrl: './assets/data/ch4.patt',
				identity: 'methane',

			})
			artoolkitMarker[6] = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
				type: 'pattern',
				patternUrl: './assets/data/sel.patt',
				identity: 'sel',

			})

			window.addEventListener('visible', function (ev) {

				if(!ev.detail) {
					document.getElementById("name").innerHTML = ""
					_currentURL = "";
					isLoading = 0
					while (_root.children.length > 0) {

						var object = _root.children[0];
						object.parent.remove(object);
	
					}
				}
				

			})


			window.addEventListener('setMolecule', function (ev) {
				
				document.getElementById("name").innerHTML = ev.detail
				if (ev.detail === "sel") {
					loadMolecule('assets/data/nacl.pdb');
					
				} else

					if (ev.detail === "dihydrogène") {
						loadMolecule('assets/data/h2.pdb');


					} else if (ev.detail === 'chlorure d\'hydrogène') {
						loadMolecule('assets/data/hcl.pdb');

					} else if (ev.detail === "ammoniac") {
						loadMolecule('assets/data/nh3.pdb');

					} else if (ev.detail === "dioxyde de carbone") {
						loadMolecule('assets/data/co2.pdb');

					} else if (ev.detail === "eau") {
						loadMolecule('assets/data/h2o.pdb');

					} else if (ev.detail === "methane") {
						loadMolecule('assets/data/ch4.pdb');

					} else {
						while (_root.children.length > 0) {

							var object = _root.children[0];
							object.parent.remove(object);

						}
					}
					
					
			});

			// build a smoothedControls
			var smoothedRoot = new THREE.Group()
			scene.add(smoothedRoot);
			var light = new THREE.DirectionalLight(0xffffff, 0.8);
			light.position.set(1, 1, 1);
			scene.add(light);

			var light = new THREE.DirectionalLight(0xffffff, 0.5);
			light.position.set(-1, -1, 1);
			scene.add(light);
			var smoothedControls = new THREEx.ArSmoothedControls(smoothedRoot, {
				lerpPosition: 0.4,
				lerpQuaternion: 0.3,
				lerpScale: 1,
			})


			onRenderFcts.push(function (delta) {
				smoothedControls.update(markerRoot)
			})
			//////////////////////////////////////////////////////////////////////////////////
			//		add an object in the scene
			//////////////////////////////////////////////////////////////////////////////////

			var arWorldRoot = smoothedRoot

			var loader = new THREE.PDBLoader();
			var offset = new THREE.Vector3();
			/** MOLECULES */
			var _currentURL = ""
			var isLoading = 0
			function loadMolecule(url) {

				if (isLoading) {
					return
				}

				if (_currentURL === url) {
					return
				}
				_currentURL = url;
				isLoading = 1
				
				
				while (_root.children.length > 0) {

					var object = _root.children[0];
					object.parent.remove(object);

				}

				loader.load(url, function (pdb) {
					isLoading = 0
					var geometryAtoms = pdb.geometryAtoms;
					var geometryBonds = pdb.geometryBonds;
					var json = pdb.json;

					var boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
					var sphereGeometry = new THREE.IcosahedronBufferGeometry(1, 2);

					geometryAtoms.computeBoundingBox();
					geometryAtoms.boundingBox.getCenter(offset).negate();
					geometryAtoms.translate(offset.x, offset.y, offset.z);
					geometryBonds.translate(offset.x, offset.y, offset.z);

					var positions = geometryAtoms.getAttribute('position');
					var colors = geometryAtoms.getAttribute('color');

					var position = new THREE.Vector3();
					var color = new THREE.Color();

					for (var i = 0; i < positions.count; i++) {

						position.x = positions.getX(i);
						position.y = positions.getY(i);
						position.z = positions.getZ(i);

						color.r = colors.getX(i);
						color.g = colors.getY(i);
						color.b = colors.getZ(i);

						var material = new THREE.MeshPhongMaterial({ color: color });
						var object = new THREE.Mesh(sphereGeometry, material);
						object.position.copy(position);
						object.position.multiplyScalar(.2);
						object.scale.multiplyScalar(.2);
						_root.add(object);

						var atom = json.atoms[i];

						var text = document.createElement('div');
						text.className = 'label';
						text.style.color = 'rgb(' + atom[3][0] + ',' + atom[3][1] + ',' + atom[3][2] + ')';
						text.textContent = atom[4];

						var label = new THREE.CSS2DObject(text);

						label.position.copy(position);
						// label.position.multiplyScalar( 0.2 );
						//label.scale.multiplyScalar(1 );
						_root.add(label);

					}

					positions = geometryBonds.getAttribute('position');

					var start = new THREE.Vector3();
					var end = new THREE.Vector3();

					for (var i = 0; i < positions.count; i += 2) {

						start.x = positions.getX(i);
						start.y = positions.getY(i);
						start.z = positions.getZ(i);

						end.x = positions.getX(i + 1);
						end.y = positions.getY(i + 1);
						end.z = positions.getZ(i + 1);

						start.multiplyScalar(.2);
						end.multiplyScalar(.2);

						

					}



				});

				arWorldRoot.add(_root);
				onRenderFcts.push(function () {
					_root.rotation.y += 0.002;
					_root.rotation.x += 0.002;
					_root.rotation.z += 0.002;
				})
			}



			/* PLANETS */
			/*var loader = new THREE.TextureLoader();
			loader.load( 'textures/saturnmap.jpg', function ( texture ) {
		   
			var geometry = new THREE.SphereGeometry( .75, 32, 32 );
		
			var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );
			var mesh = new THREE.Mesh( geometry, material );
			arWorldRoot.add( mesh );
			onRenderFcts.push(function(){
				mesh.rotation.y += 0.002;
			})
			});*/

			// var geometry = new THREE.SphereGeometry(0.5, 32, 32, 0, Math.PI * 2, 0, Math.PI * 2);
			//var material = new THREE.MeshNormalMaterial(  );
			//var sphere = new THREE.Mesh( geometry, material );
			//var geometry	= new THREE.TorusKnotGeometry(0.3,0.1,64,16);
			//var material	= new THREE.MeshNormalMaterial(); 
			//var mesh	= new THREE.Mesh( geometry, material );
			//sphere.position.y	= 0.5
			//arWorldRoot.add( sphere );



			//////////////////////////////////////////////////////////////////////////////////
			//		render the whole thing on the page
			//////////////////////////////////////////////////////////////////////////////////
			var stats = new Stats();
			document.body.appendChild(stats.dom);
			// render the scene
			onRenderFcts.push(function () {
				labelRenderer.render(scene, camera);
				renderer.render(scene, camera);
				stats.update();
			})


			// run the rendering loop
			var lastTimeMsec = null
			requestAnimationFrame(function animate(nowMsec) {
				// keep looping
				requestAnimationFrame(animate);
				// measure time
				lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
				var deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
				lastTimeMsec = nowMsec
				// call each update function
				onRenderFcts.forEach(function (onRenderFct) {
					onRenderFct(deltaMsec / 1000, nowMsec / 1000)
				})
			})



		})

	}

}
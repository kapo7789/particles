var App = {
	useComposer: false,
	collidable: null,

	onAnimate: function() {

	},

	init: function() {

		this.renderer = new THREE.WebGLRenderer({ antialias: true }),

		this.renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( this.renderer.domElement );
        this.renderer.setClearColor( 0, 1 );

        this.initCamera();
        this.initScene();
	},

	initCamera: function() {
		this.camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 17000 );
		this.camera.position = new THREE.Vector3(383,306,641);
		

		this.controls = new THREE.OrbitControls( this.camera );
	},

	initScene: function() {
		this.scene = new THREE.Scene();
	},

	initComposer: function(options) {

		this.composer = new THREE.EffectComposer( this.renderer );
		this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );

		var bl = new THREE.BloomPass(0.85);
		bl.renderToScreen = false;

		var effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
        effectFXAA.uniforms[ 'resolution' ].value.set( 1 / window.innerWidth,  1 / window.innerHeight );
        effectFXAA.renderToScreen = true;


        if(options.rgbPass !== false){
        	var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
				effect.uniforms[ 'amount' ].value = 0.0030;
				effect.renderToScreen = false;
				this.composer.addPass(effect);
        }

		if(options.filmPass !== false){
				var effectFilm = new THREE.FilmPass( 0.25, 1, 1048, false );
				effectFilm.renderToScreen = false;
				this.composer.addPass( effectFilm );
		}




        this.composer.addPass( effectFXAA );
this.composer.addPass(bl);
	},

	start: function(options) {
		if(this.renderer === undefined)
			this.init();

		if(options!==undefined){
			if(options.useComposer) {
				this.useComposer = true;
				this.initComposer(options);
			}
		}

		var that = this;
		requestAnimationFrame( function() { that.start(); } )
		this.render();		
		this.onAnimate();
		
	},

	add: function(arg) {
		this.scene.add(arg);
	},

	addMany: function(arg) {
		for(var i=0; i<arg.length; i++)
			this.scene.add(arg[i]);
	},
	// REMOVE THIS
	loadEnvironment: function() {
		var imagePrefix = "images/skybox/dd_";
		var directions  = ["right1", "left2", "top3", "bottom4", "front5", "back6"];
		var imageSuffix = ".png";
		
	
		var materialArray = [];
		for (var i = 0; i < 6; i++) {
			materialArray.push(
				new THREE.MeshBasicMaterial({ 
					color: 0xFFFFFF,
					map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
					side: THREE.BackSide, 
					depthWrite: false
				})
			);
		}

		var skyGeometry = new THREE.CubeGeometry( 16000, 16000, 16000 );	
		var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
		var skyBox = new THREE.Mesh(skyGeometry, skyMaterial);
		this.scene.add( skyBox );
		this.skyBox = skyBox;
		this.scene.fog = new THREE.FogExp2( 0xB69CE6, 0.00005 );

		this.initSun();
	},

	initSun: function()
	{
	        var particles = new THREE.Geometry();
	        var pMaterial =
	          new THREE.ParticleBasicMaterial({
	            color: 0xFFFFFF,
	            size:1000,
	            map: THREE.ImageUtils.loadTexture(
	              "images/particle2.jpg"
	            ),
	            blending: THREE.AdditiveBlending,
	            transparent: true,
	            opacity:1

	          });
			var particle = new THREE.Vertex(new THREE.Vector3(-900, 120, -950));

            particles.vertices.push(particle);
            particleSystem = new THREE.ParticleSystem( particles, pMaterial);
            this.sun = particleSystem;
            this.scene.add(particleSystem);

			 var directionalLight = new THREE.DirectionalLight( 0x353eae, .5 );
			 directionalLight.position.set( -350, 100, -200 );
			 directionalLight.target.position = this.camera.position.clone();
			 this.scene.add( directionalLight );

	},

	render: function() {

		if(this.collidable !== null)
			this.detectCollisions(this.collidable);

		this.controls.update(1);

		if(this.useComposer)
			this.composer.render(0.15);
		else
			this.renderer.render(this.scene, this.camera);

	},

	detectCollisions: function(verts) {
		
	 var vector = new THREE.Vector3( 0, 0, -1 );
	 vector.applyQuaternion( this.camera.quaternion );

	  var ray = new THREE.Raycaster(this.camera.position.clone(), vector);
	  var intersects = ray.intersectObjects(verts);

	  if (intersects.length > 0) {
	
	    if (intersects[0].distance < 5) {
	      console.log(intersects);

	    }
	  }
	}

}
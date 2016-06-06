// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Three Card Situation&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
reader.service('ThreeCardSitSvc', ['$window', 'tarotDeck', function($window, tarotDeck) {

    var deck = tarotDeck.deck;
    var shuffledDeck = tarotDeck.shuffledDeck();
    var camera, scene, pane;
    var meshArr = [];
    var windowHalfX = $window.innerWidth / 2;
    var windowHalfY = $window.innerHeight / 2;
    var raycaster = new THREE.Raycaster();
    var intersects;
    var mouse = new THREE.Vector2();
    var currentCard = null;
    var tl = new TimelineLite();
    var overlayOn = false;
    var that = this;
    var renderer = new THREE.WebGLRenderer({
        antialias: true,
        autoClear: true
    });

    this.mouse = mouse;
    this.renderer = renderer;
    this.init = function() {

        //deck, positions and meanings
        shuffledDeck = tarotDeck.shuffledDeck();
        shuffledDeck[0].position = { x: -30, y: 0, z: 0 };
        shuffledDeck[1].position = { x: 0, y: 0, z: 0 };
        shuffledDeck[2].position = { x: 30, y: 0, z: 0 };

        shuffledDeck[0].posInfo = "what you aspire to";
        shuffledDeck[1].posInfo = "what is standing in your way";
        shuffledDeck[2].posInfo = "how you can overcome this";

        renderer.setClearColor(0xffffff);
        renderer.setSize($window.innerWidth / 12 * 10, $window.innerHeight / 12 * 10);
        $('#container-three-sit').append(renderer.domElement);

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(35, $window.innerWidth / $window.innerHeight, 1, 10000);
        camera.position.set(0, 0, 75);
        scene.add(camera);

        var light = new THREE.AmbientLight(0xffffff);
        light.position.set(0, 0, 20);
        scene.add(light);


        var geometry = new THREE.BoxGeometry(14, 24, 0.2);
        var meshArr = [];
        var backTexture = new THREE.TextureLoader().load(shuffledDeck[0].image);
        var backMat = new THREE.MeshBasicMaterial({ map: backTexture });
        for (var i = 0; i < 3; i++) {

            var frontTexture = new THREE.TextureLoader().load(shuffledDeck[i].image);
            // frontTexture.minFilter = THREE.LinearFilter;
            var frontMat = new THREE.MeshBasicMaterial({ map: frontTexture });

            var mesh = new THREE.Mesh(geometry, frontMat);
            mesh.position.set(-30, 10, 50);
            mesh.rotation.y = Math.PI / 2;
            mesh.name = shuffledDeck[i].name;
            mesh.PKT = shuffledDeck[i].PKT;
            mesh.posInfo = shuffledDeck[i].posInfo;
            mesh.selected = false;
            meshArr.push(mesh);
            scene.add(mesh);
        }

        tl.to(meshArr[0].position, 1, shuffledDeck[0].position)
            .to(meshArr[0].rotation, 1, { y: Math.PI }, '-=1')
            .to(meshArr[1].position, 1, shuffledDeck[1].position)
            .to(meshArr[1].rotation, 1, { y: Math.PI }, '-=1')
            .to(meshArr[2].position, 1, shuffledDeck[2].position)
            .to(meshArr[2].rotation, 1, { y: Math.PI }, '-=1');


        //pane overlay when card picked (see Cardclick())
        var planeGeo = new THREE.PlaneGeometry($window.innerWidth / 12 * 10, $window.innerHeight / 12 * 10);
        var planeMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
        pane = new THREE.Mesh(planeGeo, planeMat);
        pane.name = "overlay";
        pane.position.set(0, 0, -1);
        scene.add(pane);
    }



    $($window).resize(function() {
        camera.aspect = $window.innerWidth / $window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize($window.innerWidth / 12 * 10, $window.innerHeight / 12 * 10);
    });

    function setFromCamera(raycaster, coords, origin) {
        raycaster.ray.origin.copy(camera.position);
        raycaster.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();
    }

    this.intersect = function(e) {
        setFromCamera(raycaster, mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            cardPick(intersects[0])
        }
    }

    //card to front logic
    function cardPick(card) {
        deck.activeCard = card.object;

        if (!currentCard) {
            currentCard = card;
            tl.to(card.object.position, 1, { x: -20, z: card.object.position.z + 30 })
                .to(".overlay", 1, { visibility: "visible", opacity: "1" }, '-=1')
                .to(pane.position, 0.2, { z: 1 }, '-=1')
                .to(pane.material, 1, { opacity: 0.7 }, '-=1');

        } else {

            for (refCard in shuffledDeck) {
                if (currentCard.object.name == shuffledDeck[refCard].name) {
                    tl.to(currentCard.object.position, 1, shuffledDeck[refCard].position)
                        .to(".overlay", 1, { opacity: "0" }, '-=1')
                        .to(pane.material, 0.7, { opacity: 0 }, '-=1')
                        .to(pane.position, 0.1, { z: -1 })
                        .to(".overlay", 1, { visibility: "hidden" });
                }
            }
            currentCard = null;
        }
    }

    var render = function() {
        camera.position.x = (mouse.x) * 20;
        camera.position.y = (mouse.y) * 20;
        camera.lookAt(scene.position);
        that.reqFr = requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    this.render = render;

    this.destroyScene = function() {
        cancelAnimationFrame(this.reqFr);
    }

}]);



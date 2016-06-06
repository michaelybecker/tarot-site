// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Celtic Cross&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

reader.service('CelCroSvc', ['$window', 'tarotDeck', function($window, tarotDeck) {

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
        shuffledDeck = tarotDeck.shuffledDeck();
        shuffledDeck[0].position = { x: -20, y: 0, z: 0 };
        shuffledDeck[1].position = { x: -20, y: 0, z: 0.5 };
        shuffledDeck[2].position = { x: -20, y: -30, z: 0 };
        shuffledDeck[3].position = { x: -50, y: 0, z: 0 };
        shuffledDeck[4].position = { x: -20, y: 30, z: 0 };
        shuffledDeck[5].position = { x: 10, y: 0, z: 0 };
        shuffledDeck[6].position = { x: 50, y: -40, z: 0 };
        shuffledDeck[7].position = { x: 50, y: -15, z: 0 };
        shuffledDeck[8].position = { x: 50, y: 10, z: 0 };
        shuffledDeck[9].position = { x: 50, y: 35, z: 0 };


        shuffledDeck[0].posInfo = "the general atmosphere thta surrounds the question asked; the influences at work around it";
        shuffledDeck[1].posInfo = "what the opposing forces may be, for good or evil";
        shuffledDeck[2].posInfo = "the foundation or basis of the matter; something that has already become part of the subject's experience";
        shuffledDeck[3].posInfo = "the influence that has just passed or is now passing away";
        shuffledDeck[4].posInfo = "an influence that <i>may</i> come into being";
        shuffledDeck[5].posInfo = "the influence that will operate in the near future";
        shuffledDeck[6].posInfo = "the negative feelings, the fears the subject has on the matter";
        shuffledDeck[7].posInfo = "the subject's environment, the opinions and influence of family and friends";
        shuffledDeck[8].posInfo = "the subject's own hopes and ideals in the matter";
        shuffledDeck[9].posInfo = "the outcome of the matter - the cumulative result of the influences exerted by the other cards. It includes all that has been divined from the other cards on the table.";

        renderer.setClearColor(0xffffff);
        renderer.setSize($window.innerWidth / 12 * 10, $window.innerHeight / 12 * 10);
        $('#container-celtic-cross').append(renderer.domElement);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(35, $window.innerWidth / $window.innerHeight, 1, 10000);
        camera.position.set(0, 0, 175);
        scene.add(camera);

        var light = new THREE.AmbientLight(0xffffff);
        light.position.set(0, 0, 20);
        scene.add(light);


        var geometry = new THREE.BoxGeometry(14, 24, 0.2);
        var meshArr = [];
        var backTexture = new THREE.TextureLoader().load(shuffledDeck[0].image);
        var backMat = new THREE.MeshBasicMaterial({ map: backTexture });
        for (var i = 0; i < 10; i++) {

            var frontTexture = new THREE.TextureLoader().load(shuffledDeck[i].image);
            // frontTexture.minFilter = THREE.LinearFilter;
            var frontMat = new THREE.MeshBasicMaterial({ map: frontTexture });
            var mesh = new THREE.Mesh(geometry, frontMat);
            mesh.position.set(-150, 50, 50);
            mesh.rotation.y = Math.PI / 2;
            mesh.name = shuffledDeck[i].name;
            mesh.selected = false;
            mesh.PKT = shuffledDeck[i].PKT;
            mesh.posInfo = shuffledDeck[i].posInfo;
            meshArr.push(mesh);
            scene.add(mesh);
        }


        tl.to(meshArr[0].position, 1, shuffledDeck[0].position)
            .to(meshArr[0].rotation, 1, { y: Math.PI }, '-=1')
            .to(meshArr[1].position, 1, shuffledDeck[1].position)
            .to(meshArr[1].rotation, 1, { x: Math.PI, y: Math.PI, z: Math.PI / 2 }, '-=1')
            .to(meshArr[2].position, 1, shuffledDeck[2].position)
            .to(meshArr[2].rotation, 1, { y: Math.PI }, '-=1')
            .to(meshArr[3].position, 1, shuffledDeck[3].position)
            .to(meshArr[3].rotation, 1, { y: Math.PI }, '-=1')
            .to(meshArr[4].position, 1, shuffledDeck[4].position)
            .to(meshArr[4].rotation, 1, { y: Math.PI }, '-=1')
            .to(meshArr[5].position, 1, shuffledDeck[5].position)
            .to(meshArr[5].rotation, 1, { y: Math.PI }, '-=1')
            .to(meshArr[6].position, 1, shuffledDeck[6].position)
            .to(meshArr[6].rotation, 1, { y: Math.PI }, '-=1')
            .to(meshArr[7].position, 1, shuffledDeck[7].position)
            .to(meshArr[7].rotation, 1, { y: Math.PI }, '-=1')
            .to(meshArr[8].position, 1, shuffledDeck[8].position)
            .to(meshArr[8].rotation, 1, { y: Math.PI }, '-=1')
            .to(meshArr[9].position, 1, shuffledDeck[9].position)
            .to(meshArr[9].rotation, 1, { y: Math.PI }, '-=1');

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
            //if cross card
            if (card.object.name == shuffledDeck[1].name) {
                tl.to(card.object.position, 1, { x: -25, y: 0, z: card.object.position.z + 120 })
                    .to(".overlay", 1, { visibility: "visible", opacity: "1" }, '-=1')
                    .to(card.object.rotation, 1, { x: 0, y: 0, z: 0 }, '-=1')
                    .to(pane.position, 0.2, { z: 1 }, '-=1')
                    .to(pane.material, 1, { opacity: 0.7 }, '-=1');
            } else {
                tl.to(card.object.position, 1, { x: -25, y: 0, z: card.object.position.z + 120 })
                    .to(".overlay", 1, { visibility: "visible", opacity: "1" }, '-=1')
                    .to(pane.position, 0.2, { z: 1 }, '-=1')
                    .to(pane.material, 1, { opacity: 0.7 }, '-=1');
            }
            currentCard = card;
        } else {
            for (refCard in shuffledDeck) {
                if (currentCard.object.name == shuffledDeck[refCard].name) {
                    //if cross card
                    if (card.object.name == shuffledDeck[1].name) {
                        tl.to(currentCard.object.position, 1, shuffledDeck[refCard].position)
                            .to(".overlay", 1, { opacity: "0" }, '-=1')
                            .to(card.object.rotation, 1, { x: Math.PI, y: Math.PI, z: Math.PI / 2 }, '-=1')
                            .to(pane.material, 0.7, { opacity: 0 }, '-=1')
                            .to(pane.position, 0.1, { z: -1 })
                            .to(".overlay", 1, { visibility: "hidden" });
                    } else {
                        tl.to(currentCard.object.position, 1, shuffledDeck[refCard].position)
                            .to(".overlay", 1, { opacity: "0" }, '-=1')
                            .to(pane.material, 0.7, { opacity: 0 }, '-=1')
                            .to(pane.position, 0.1, { z: -1 })
                            .to(".overlay", 1, { visibility: "hidden" });
                    }

                }
            }
            currentCard = null;
        }
    }

    var render = function () {
        camera.position.x = (mouse.x) * 20;
        camera.position.y = (mouse.y) * 20;
        camera.lookAt(scene.position);
        that.reqFr = requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
    this.render = render;

    this.destroyScene = function () {
        cancelAnimationFrame(this.reqFr);
    }


}]);


reader.controller('SidebarCtrl', ['$scope', '$log', 'tarotDeck', function($scope, $log, tarotDeck) {

    $scope.deck = tarotDeck.deck;
    $scope.deck.activeCard = tarotDeck.deck.activeCard;
    this.focusOn = function(e) {
        $scope.deck.activeCard = e;
    }

    this.filtercard = ""

}]);

reader.controller('CardSingleCtrl', ['$scope', '$log', '$sanitize', '$sce', 'tarotDeck', function($scope, $log, $sanitize, $sce, tarotDeck) {
    $scope.deck = tarotDeck.deck;

}]);

reader.controller('CardIndexCtrl', ['$scope', '$log', 'tarotDeck', function($scope, $log, tarotDeck) {

    $scope.deck = tarotDeck.deck;

    $scope.deck.activeCard = tarotDeck.deck.activeCard;
    this.focusOn = function(e) {
        $scope.deck.activeCard = e;
    }


}]);

reader.controller('menu', ['$scope', '$state', function($scope, $state) {


}]);


reader.controller('HomeCtrl', ['$scope', 'tarotDeck', function($scope, tarotDeck) {
    $scope.deck = tarotDeck.deck;

}]);

reader.controller('SpreadsCtrl', ['$scope', '$log', '$sanitize', '$sce', 'tarotDeck', function($scope, $log, $sanitize, $sce, tarotDeck) {
    $scope.deck = tarotDeck.deck;

}]);


// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Three Card Timeline&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


reader.controller('ThreeCardTimelineCtrl', ['$scope', '$window', 'tarotDeck', function($scope, $window, tarotDeck) {

    $scope.deck = tarotDeck.deck;
    var shuffledDeck;
    var camera, renderer, scene, pane;
    var meshArr = [];
    var windowHalfX = $window.innerWidth / 2;
    var windowHalfY = $window.innerHeight / 2;
    var raycaster = new THREE.Raycaster();
    var intersects;
    var mouse = new THREE.Vector2();
    var positions = [-30, 0, 30];
    var currentCard = null;
    var tl = new TimelineLite();
    var overlayOn = false;

    $scope.init = function() {

        //deck, positions and meanings

        shuffledDeck = tarotDeck.shuffledDeck();
        shuffledDeck[0].position = { x: -30, y: 0, z: 0 };
        shuffledDeck[1].position = { x: 0, y: 0, z: 0 };
        shuffledDeck[2].position = { x: 30, y: 0, z: 0 };

        shuffledDeck[0].posInfo = "the Past";
        shuffledDeck[1].posInfo = "the Present";
        shuffledDeck[2].posInfo = "the Future";


        renderer = new THREE.WebGLRenderer({
            antialias: true,
            autoClear: true
        });
        renderer.setClearColor(0xffffff);
        renderer.setSize($window.innerWidth / 12 * 10, $window.innerHeight / 12 * 10);
        $('#container-three-card').append(renderer.domElement);


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

    $scope.setFromCamera = function(raycaster, coords, origin) {
        raycaster.ray.origin.copy(camera.position);
        raycaster.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();
    }


    // threePick
    $scope.cardPick = function(card) {
        $scope.deck.activeCard = card.object;


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



    $scope.mouseMove = function(event) {
        mouse.x = (event.offsetX / renderer.domElement.width) * 2 - 1;
        mouse.y = -(event.offsetY / renderer.domElement.height) * 2 + 1;
        // console.log(mouse.x, mouse.y);
        // console.log(mouse.x, mouse.y);
        // console.log(event);
    }

    $scope.mouseClick = function() {
        $scope.setFromCamera(raycaster, mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            $scope.cardPick(intersects[0])
        }
    }

    $scope.render = function() {
        camera.position.x = (mouse.x) * 20;
        camera.position.y = (mouse.y) * 20;
        camera.lookAt(scene.position);
        requestAnimationFrame($scope.render);
        renderer.render(scene, camera);
    }

    $scope.init();
    $scope.render();

    //clear WebGL context when destroyed!
    $scope.$on("$destroy", function() {
        cancelAnimationFrame(this);
        scene = null;
        // projector = null;
        camera = null;
        renderer = null;
    });

}]);

// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Three Card Situation&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


reader.controller('ThreeCardSituationCtrl', ['$scope', '$window', 'tarotDeck', function($scope, $window, tarotDeck) {

    $scope.deck = tarotDeck.deck;
    var shuffledDeck;
    var camera, renderer, scene, pane;
    var meshArr = [];
    var windowHalfX = $window.innerWidth / 2;
    var windowHalfY = $window.innerHeight / 2;
    var raycaster = new THREE.Raycaster();
    var intersects;
    var mouse = new THREE.Vector2();
    var positions = [-30, 0, 30];
    var currentCard = null;
    var tl = new TimelineLite();
    var overlayOn = false;

    $scope.init = function() {

        //deck, positions and meanings

        shuffledDeck = tarotDeck.shuffledDeck();
        shuffledDeck[0].position = { x: -30, y: 0, z: 0 };
        shuffledDeck[1].position = { x: 0, y: 0, z: 0 };
        shuffledDeck[2].position = { x: 30, y: 0, z: 0 };

        shuffledDeck[0].posInfo = "what you aspire to";
        shuffledDeck[1].posInfo = "what is standing in your way";
        shuffledDeck[2].posInfo = "how you can overcome this";


        renderer = new THREE.WebGLRenderer({
            antialias: true,
            autoClear: true
        });
        renderer.setClearColor(0xffffff);
        renderer.setSize($window.innerWidth / 12 * 10, $window.innerHeight / 12 * 10);
        $('#container-three-card').append(renderer.domElement);


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

    $scope.setFromCamera = function(raycaster, coords, origin) {
        raycaster.ray.origin.copy(camera.position);
        raycaster.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();
    }


    // threePick
    $scope.cardPick = function(card) {
        $scope.deck.activeCard = card.object;


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



    $scope.mouseMove = function(event) {
        mouse.x = (event.offsetX / renderer.domElement.width) * 2 - 1;
        mouse.y = -(event.offsetY / renderer.domElement.height) * 2 + 1;
        // console.log(mouse.x, mouse.y);
        // console.log(mouse.x, mouse.y);
        // console.log(event);
    }

    $scope.mouseClick = function() {
        $scope.setFromCamera(raycaster, mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            $scope.cardPick(intersects[0])
        }
    }

    $scope.render = function() {
        camera.position.x = (mouse.x) * 20;
        camera.position.y = (mouse.y) * 20;
        camera.lookAt(scene.position);
        requestAnimationFrame($scope.render);
        renderer.render(scene, camera);
    }

    $scope.init();
    $scope.render();

    //clear WebGL context when destroyed!
    $scope.$on("$destroy", function() {
        cancelAnimationFrame(this);
        scene = null;
        // projector = null;
        camera = null;
        renderer = null;
    });

}]);



// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Celtic Cross&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&



reader.controller('CelticCrossCtrl', ['$scope', '$log', '$window', 'tarotDeck', function($scope, $log, $window, tarotDeck) {


    $scope.deck = tarotDeck.deck;

    var camera, renderer, scene;
    var shuffledDeck;
    var meshArr = [];
    var windowHalfX = $window.innerWidth / 2;
    var windowHalfY = $window.innerHeight / 2;
    var raycaster = new THREE.Raycaster();
    var intersects;
    var pane;
    var mouse = new THREE.Vector2();
    var positions = [-30, 0, 30];
    var tl = new TimelineLite();
    var currentCard = null;

    $scope.init = function() {

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

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            autoClear: true
        });
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
            mesh.position.set(-100, 50, 50);
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


    $scope.setFromCamera = function(raycaster, coords, origin) {
            raycaster.ray.origin.copy(camera.position);
            raycaster.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();
        }
        // celtPick
    $scope.cardPick = function(card) {
        $scope.deck.activeCard = card.object;

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

    $scope.mouseMove = function(event) {
        mouse.x = (event.offsetX / renderer.domElement.width) * 2 - 1;
        mouse.y = -(event.offsetY / renderer.domElement.height) * 2 + 1;
    }


    $scope.mouseClick = function() {
        $scope.setFromCamera(raycaster, mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            $scope.cardPick(intersects[0]);
        }
    }

    $scope.render = function() {
        camera.position.x = (mouse.x) * 20;
        camera.position.y = (mouse.y) * 20;
        camera.lookAt(scene.position);
        requestAnimationFrame($scope.render);
        renderer.render(scene, camera);
    }

    $scope.init();
    $scope.render();

    //clear WebGL context when destroyed!
    $scope.$on("$destroy", function() {
        cancelAnimationFrame(this);
        scene = null;
        // projector = null;
        camera = null;
        renderer = null;
    });
}]);

// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Tree of Life&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&



reader.controller('TreeOfLifeCtrl', ['$scope', '$log', '$window', 'tarotDeck', function($scope, $log, $window, tarotDeck) {


    $scope.deck = tarotDeck.deck;

    var camera, renderer, scene;
    var shuffledDeck;
    var meshArr = [];
    var pane;
    var windowHalfX = $window.innerWidth / 2;
    var windowHalfY = $window.innerHeight / 2;
    var raycaster = new THREE.Raycaster();
    var intersects;
    var mouse = new THREE.Vector2();
    var positions = [-30, 0, 30];
    var tl = new TimelineLite();
    var currentCard = null;

    $scope.init = function() {

        shuffledDeck = tarotDeck.shuffledDeck();
        shuffledDeck[0].position = { x: 0, y: 55, z: 0 };
        shuffledDeck[1].position = { x: 25, y: 40, z: 0 };
        shuffledDeck[2].position = { x: -25, y: 40, z: 0 };
        shuffledDeck[3].position = { x: 25, y: 15, z: 0 };
        shuffledDeck[4].position = { x: -25, y: 15, z: 0 };
        shuffledDeck[5].position = { x: 0, y: 5, z: 0 };
        shuffledDeck[6].position = { x: 25, y: -20, z: 0 };
        shuffledDeck[7].position = { x: -25, y: -20, z: 0 };
        shuffledDeck[8].position = { x: 0, y: -30, z: 0 };
        shuffledDeck[9].position = { x: 0, y: -55, z: 0 };

        shuffledDeck[0].posInfo = "the subject's highest intelligence. It is part of Triangle 1, pointing upward, which represents spirituality, the highest ideal of the subject";
        shuffledDeck[1].posInfo = "creative force, the 'father' card. It is part of Triangle 1, pointing upward, which represents spirituality, the highest ideal of the subject";
        shuffledDeck[2].posInfo = "life, wisdom, the 'mother' card. It is part of Triangle 1, pointing upward, which represents spirituality, the highest ideal of the subject";
        shuffledDeck[3].posInfo = "virtues, good qualities. It is part of Triangle 2, pointing downward, which represents the intellectual and moral nature of the subject";
        shuffledDeck[4].posInfo = "conquest, intellectual or physical force. It is part of Triangle 2, pointing downward, which represents the intellectual and moral nature of the subject";
        shuffledDeck[5].posInfo = "spirit of sacrifice, health. It is part of Triangle 2, pointing downward, which represents the intellectual and moral nature of the subject";
        shuffledDeck[6].posInfo = "Venus, love, lust. It is part of Triangle 3, pointing downward, which represents the subject's subconsciousness - their intuition, desires and impulses";
        shuffledDeck[7].posInfo = "procreation, arts, crafts. It is part of Triangle 3, pointing downward, which represents the subject's subconsciousness - their intuition, desires and impulses";
        shuffledDeck[8].posInfo = "imagination, creative mental and physical forces. It is part of Triangle 3, pointing downward, which represents the subject's subconsciousness - their intuition, desires and impulses";
        shuffledDeck[9].posInfo = "the physical body or the earthly home";


        renderer = new THREE.WebGLRenderer({
            antialias: true,
            autoClear: true
        });
        renderer.setClearColor(0xffffff);
        renderer.setSize($window.innerWidth / 12 * 10, $window.innerHeight / 12 * 10);
        $('#container-tree-of-life').append(renderer.domElement);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(35, $window.innerWidth / $window.innerHeight, 1, 10000);
        camera.position.set(0, 0, 230);
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
            .to(meshArr[1].rotation, 1, { y: Math.PI }, '-=1')
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


    $scope.setFromCamera = function(raycaster, coords, origin) {
            raycaster.ray.origin.copy(camera.position);
            raycaster.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();
        }

        // treePick
    $scope.cardPick = function(card) {
        $scope.deck.activeCard = card.object;

        if (!currentCard) {
            currentCard = card;
            tl.to(card.object.position, 1, { x: -25, y: 0, z: card.object.position.z + 170 })
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


    // Alternative card zoom logic
    // $scope.cardPick = function(card) {

    //     if (!currentCard) {
    //         tl.to(camera.position, 1, { x: card.object.position.x + 20, y: card.object.position.y, z: card.object.position.z + 50 });
    //         $(".overlay").css('visibility', 'visible').hide().fadeTo('opacity', '0.8');
    //         currentCard = card;
    //     } else {
    //         tl.to(camera.position, 1, { x: 0, y: 0, z: 230 });

    //         $(".overlay").fadeTo('opacity', '0', function() { $(".overlay").hide(); });

    //         currentCard = null;
    //     }
    // }


    $scope.mouseMove = function(event) {
        mouse.x = (event.offsetX / renderer.domElement.width) * 2 - 1;
        mouse.y = -(event.offsetY / renderer.domElement.height) * 2 + 1;
    }


    $scope.mouseClick = function() {
        $scope.setFromCamera(raycaster, mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
            $scope.cardPick(intersects[0]);
        }
    }

    $scope.render = function() {
        camera.position.x = (mouse.x) * 20;
        camera.position.y = (mouse.y) * 20;
        camera.lookAt(scene.position);
        requestAnimationFrame($scope.render);
        renderer.render(scene, camera);

    }

    $scope.init();
    $scope.render();

    //clear WebGL context when destroyed!
    $scope.$on("$destroy", function() {
        cancelAnimationFrame(this);
        scene = null;
        // projector = null;
        camera = null;
        renderer = null;
    });
}]);

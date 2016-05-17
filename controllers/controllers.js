reader.controller('sidebar', ['$scope', '$log', 'tarotDeck', function($scope, $log, tarotDeck) {

    $scope.deck = tarotDeck.deck;
    $scope.deck.activeCard = tarotDeck.deck.activeCard;
    this.focusOn = function(e) {
        $scope.deck.activeCard = e;
    }

    this.filtercard = ""

}]);

reader.controller('cardsingle', ['$scope', '$log', '$sanitize', '$sce', 'tarotDeck', function($scope, $log, $sanitize, $sce, tarotDeck) {
    $scope.deck = tarotDeck.deck;

}]);

reader.controller('cardindex', ['$scope', '$log', 'tarotDeck', function($scope, $log, tarotDeck) {

    $scope.deck = tarotDeck.deck;

    $scope.deck.activeCard = tarotDeck.deck.activeCard;
    this.focusOn = function(e) {
        $scope.deck.activeCard = e;
    }


}]);

reader.controller('home', ['$scope', 'tarotDeck', function($scope, tarotDeck) {
    $scope.deck = tarotDeck.deck;

}]);

reader.controller('spreads', ['$scope', '$log', '$sanitize', '$sce', 'tarotDeck', function($scope, $log, $sanitize, $sce, tarotDeck) {
    $scope.deck = tarotDeck.deck;

}]);


// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Three Card Spread&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


reader.controller('three-card', ['$scope', '$log', '$window', 'tarotDeck', function($scope, $log, $window, tarotDeck) {
    // for position copy
    // Object.prototype.clone = function() {
    //   var newObj = (this instanceof Array) ? [] : {};
    //   for (i in this) {
    //     if (i == 'clone') continue;
    //     if (this[i] && typeof this[i] == "object") {
    //       newObj[i] = this[i].clone();
    //     } else newObj[i] = this[i]
    //   } return newObj;
    // };
    $scope.deck = tarotDeck.deck;

    var camera, renderer, scene, card1, card2, card3;
    var meshArr = [];
    // var mouseX = mouseY = 0;
    var windowHalfX = $window.innerWidth / 2;
    var windowHalfY = $window.innerHeight / 2;
    var raycaster = new THREE.Raycaster();
    var intersects;
    var mouse = new THREE.Vector2();
    var positions = [-30, 0, 30];
    var tl = new TimelineLite();

    // $scope.shuffle = function(array) {
    //     //deck shuffle logic - implemented using Fisher-Yates shuffle algorithm

    //     var m = array.length,
    //         t, i;

    //     // While there remain elements to shuffle…
    //     while (m) {

    //         // Pick a remaining element…
    //         i = Math.floor(Math.random() * m--);

    //         // And swap it with the current element.
    //         t = array[m];
    //         array[m] = array[i];
    //         array[i] = t;
    //     }
    //     return array;
    // }


    $scope.init = function() {

        var shuffledDeck = tarotDeck.shuffledDeck();
        renderer = new THREE.WebGLRenderer({
            antialias: true, autoClear: true
        });
        renderer.setClearColor(0xffffff);
        renderer.setSize($window.innerWidth / 12 * 8, $window.innerHeight / 12 * 8);
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
            var frontMat = new THREE.MeshBasicMaterial({ map: frontTexture });

            var matArr = [];
            matArr.push(backMat);
            matArr.push(backMat);
            matArr.push(frontMat);
            var cardMat = THREE.MeshFaceMaterial(matArr);
            var mesh = new THREE.Mesh(geometry, frontMat);
            mesh.position.set(-30, 10, 50);
            mesh.rotation.y = Math.PI / 2;
            mesh.name = shuffledDeck[i].name;
            mesh.selected = false;
            mesh.origPos = [i * 30 - 30, 0, 0];
            meshArr.push(mesh);
            scene.add(mesh);
        }


        tl.to(meshArr[0].position, 1, { x: -30, y: 0, z: 0 })
            .to(meshArr[0].rotation, 1, { y: Math.PI }, '-=1')
            .to(meshArr[1].position, 1, { x: 0, y: 0, z: 0 })
            .to(meshArr[1].rotation, 1, { y: Math.PI }, '-=1')
            .to(meshArr[2].position, 1, { x: 30, y: 0, z: 0 })
            .to(meshArr[2].rotation, 1, { y: Math.PI }, '-=1');


    }

    $($window).resize(function() {
        // windowHalfX = $window.innerWidth / 2;
        // windowHalfY = $window.innerHeight / 2;

        camera.aspect = $window.innerWidth / $window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize($window.innerWidth / 12 * 8, $window.innerHeight / 12 * 8);
    });


    $scope.setFromCamera = function(raycaster, coords, origin) {
        raycaster.ray.origin.copy(camera.position);
        raycaster.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();
    }

    $scope.cardClick = function(card) {

        var origPosition;
        console.log(card);
        if (!card.object.selected) {

            tl.to(card.object.position, 1, { z: card.object.position.z + 30 });
            tl.to(card.object.position, 1, { x: -20 }, '-=1');

        } else {
            // for (key in meshArrCopy) {
            //   if (card.object.name == meshArrCopy[key].name) {
            //             console.log("ha!");
            //         } else { console.log("none found for " + card.object.name) }

            tl.to(card.object.position, 1, { z: card.object.position.z - 30 });
            tl.to(card.object.position, 1, { x: card.object.origPos[0] }, '-=1');
        }


        card.object.selected = !card.object.selected;
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
                // for (var i = 0; i < intersects.length; i++) {
                // $log.log(intersects[0].object.name);
                $scope.cardClick(intersects[0])
                    // }
            }

        }
        // function onMouseMove(event) {

    // }

    // window.addEventListener('mousemove', onMouseMove, false);

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
   $scope.$on("$destroy", function(){
        cancelAnimationFrame(this);
        scene = null;
        // projector = null;
        camera = null;
        renderer = null;
    });

}]);



// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Celtic Cross&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&



reader.controller('celtic-cross', ['$scope', '$log', '$window', 'tarotDeck', function($scope, $log, $window, tarotDeck) {


    $scope.deck = tarotDeck.deck;

    var camera, renderer, scene;
    var shuffledDeck;
    var meshArr = [];
    var windowHalfX = $window.innerWidth / 2;
    var windowHalfY = $window.innerHeight / 2;
    var raycaster = new THREE.Raycaster();
    var intersects;
    var mouse = new THREE.Vector2();
    var positions = [-30, 0, 30];
    var tl = new TimelineLite();



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



        renderer = new THREE.WebGLRenderer({
            antialias: true, autoClear: true
        });
        renderer.setClearColor(0xffffff);
        renderer.setSize($window.innerWidth / 12 * 8, $window.innerHeight / 12 * 8);
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
            var frontMat = new THREE.MeshBasicMaterial({ map: frontTexture });

            var matArr = [];
            matArr.push(backMat);
            matArr.push(backMat);
            matArr.push(frontMat);
            var cardMat = THREE.MeshFaceMaterial(matArr);
            var mesh = new THREE.Mesh(geometry, frontMat);
            mesh.position.set(-100, 50, 50);
            mesh.rotation.y = Math.PI / 2;
            mesh.name = shuffledDeck[i].name;
            mesh.selected = false;
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
    }

    $($window).resize(function() {
        // windowHalfX = $window.innerWidth / 2;
        // windowHalfY = $window.innerHeight / 2;

        camera.aspect = $window.innerWidth / $window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize($window.innerWidth / 12 * 8, $window.innerHeight / 12 * 8);
    });


    $scope.setFromCamera = function(raycaster, coords, origin) {
        raycaster.ray.origin.copy(camera.position);
        raycaster.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();
    }

    $scope.cardPick = function(card) {
        if (!card.object.selected) {
            tl.to(card.object.position, 1, { x: -25, y: 0, z: card.object.position.z + 120 });
        } else {
            for (refCard in shuffledDeck) {
                if (card.object.name == shuffledDeck[refCard].name) {
                    tl.to(card.object.position, 1, shuffledDeck[refCard].position);
                }
            }
        }
        card.object.selected = !card.object.selected;
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
   $scope.$on("$destroy", function(){
        cancelAnimationFrame(this);
        scene = null;
        // projector = null;
        camera = null;
        renderer = null;
    });

}]);

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

reader.controller('three-card', ['$scope', '$log', '$window', 'tarotDeck', function($scope, $log, $window, tarotDeck) {
    $scope.deck = tarotDeck.deck;

    $scope.shuffle = function(deck) {
        console.log($deck);
    }



    var camera, renderer, scene, card1, card2, card3;
    var meshArr = [];
    // var mouseX = mouseY = 0;
    var windowHalfX = $window.innerWidth / 2;
    var windowHalfY = $window.innerHeight / 2;
    var raycaster = new THREE.Raycaster();
    var intersects;
    var mouse = new THREE.Vector2();
    var positions = [-30, 0, 30];


    $scope.init = function() {

        renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        renderer.setClearColor(0xffffff);
        renderer.setSize($window.innerWidth / 12 * 8, $window.innerHeight / 12 * 8);
        $('#container-three-card').append(renderer.domElement);

        // create a scene
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(35, $window.innerWidth / $window.innerHeight, 1, 10000);
        camera.position.set(0, 0, 100);
        scene.add(camera);

        var geometry = new THREE.BoxGeometry(14, 24, 0.1);
        var material = new THREE.MeshNormalMaterial();

        for (var i = 0; i < 3; i++) {
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(-50, 40, 70);
            mesh.name = "card" + i;
            scene.add(mesh);
            meshArr.push(mesh);

        }

        var tween = function() { createjs.Tween.get(meshArr[0].position).to({ x: -30, y: 0, z: 0 }, 800).call(tween2); }
        var tween2 = function() { createjs.Tween.get(meshArr[1].position).to({ x: 0, y: 0, z: 0 }, 800).call(tween3); }
        var tween3 = function() { createjs.Tween.get(meshArr[2].position).to({ x: 30, y: 0, z: 0 }, 800) }
        tween();



        $($window).resize(function() {
            windowHalfX = $window.innerWidth / 2;
            windowHalfY = $window.innerHeight / 2;

            camera.aspect = $window.innerWidth / $window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize($window.innerWidth, $window.innerHeight);
        });


    }
$scope.mouseMove = function(event) {
  mouse.x = event.offsetX;
  mouse.y = event.offsetY;
                  // console.log(mouse.x, mouse.y);
        // console.log(event);
}

$scope.mouseClick = function() {
console.log("clicked");
        raycaster.setFromCamera(mouse, camera);
         intersects = raycaster.intersectObjects(scene.children);
                 if (intersects.length > 0) {
            // for (var i = 0; i < intersects.length; i++) {

                console.log(intersects);

            // }
        }
        // calculate objects intersecting the picking ray




        console.log("clicked");
}
    // function onMouseMove(event) {

    // }

    // window.addEventListener('mousemove', onMouseMove, false);

    $scope.render = function() {
        camera.position.x = (mouse.x) * 0.06;
        camera.position.y = (mouse.y) * 0.06;
        camera.lookAt(scene.position);




        requestAnimationFrame($scope.render);
        renderer.render(scene, camera);

    }

    $scope.init();
    $scope.render();

}]);

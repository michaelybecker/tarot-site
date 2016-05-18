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

reader.controller('menu', ['$scope', '$state', function($scope, $state) {


}]);


reader.controller('home', ['$scope', 'tarotDeck', function($scope, tarotDeck) {
    $scope.deck = tarotDeck.deck;

}]);

reader.controller('spreads', ['$scope', '$log', '$sanitize', '$sce', 'tarotDeck', function($scope, $log, $sanitize, $sce, tarotDeck) {
    $scope.deck = tarotDeck.deck;

}]);


// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Three Card Spread&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


reader.controller('three-card', ['$scope', '$window', 'tarotDeck', function($scope, $window, tarotDeck) {

    $scope.deck = tarotDeck.deck;
    var shuffledDeck;
    var camera, renderer, scene, card1, card2, card3, pane;
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

        shuffledDeck = tarotDeck.shuffledDeck();
        shuffledDeck[0].position = { x: -30, y: 0, z: 0 };
        shuffledDeck[1].position = { x: 0, y: 0, z: 0 };
        shuffledDeck[2].position = { x: 30, y: 0, z: 0 };

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

    $scope.cardClick = function(card) {

        if (!overlayOn) {
            //pane logic
            var planeGeo = new THREE.PlaneGeometry($window.innerWidth / 12 * 10, $window.innerHeight / 12 * 10);
            var planeMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
            pane = new THREE.Mesh(planeGeo, planeMat);
            pane.name = "overlay";
            pane.position.set(0, 0, 20);
            scene.add(pane);
            overlayOn = !overlayOn;
        }

        // else {

        //     tl.to(pane.material, 1, { opacity: 0 });
        //     // scene.remove(pane);
        //     overlayOn = !overlayOn;
        // }

        if (!currentCard) {
            tl.to(card.object.position, 1, { x: -20, z: card.object.position.z + 30 })

            //pane opacity;
            .to(pane.material, 0.5, { opacity: 0.7 });

            currentCard = card;
        } else {
            if (card.object.name == currentCard.object.name) {
                for (refCard in shuffledDeck) {
                    if (card.object.name == shuffledDeck[refCard].name) {
                        tl.to(card.object.position, 1, shuffledDeck[refCard].position);
                    }
                }
                tl.to(pane.material, 0.3, { opacity: 0, onComplete: function() { scene.remove(pane);
                        overlayOn = !overlayOn; } }, '-=1');
                currentCard = null;
            } else {
                for (refCard in shuffledDeck) {
                    if (currentCard.object.name == shuffledDeck[refCard].name) {
                        tl.to(currentCard.object.position, 1, shuffledDeck[refCard].position);
                    }
                }
                tl.to(card.object.position, 1, { x: -20, z: card.object.position.z + 30 }, '-=1');
                // scene.remove(pane);
                //pane opacity;
                tl.to(pane.material, 0.3, { opacity: 0, onComplete: function() { scene.remove(pane);
                        overlayOn = !overlayOn; } }, '-=1');
                overlayOn = !overlayOn;
                currentCard = card;
            }
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
            $scope.cardClick(intersects[0])
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

        camera.aspect = $window.innerWidth / $window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize($window.innerWidth / 12 * 10, $window.innerHeight / 12 * 10);
    });


    $scope.setFromCamera = function(raycaster, coords, origin) {
        raycaster.ray.origin.copy(camera.position);
        raycaster.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(camera.position).normalize();
    }

    $scope.cardPick = function(card) {


        //pane logic
        var planeGeo = new THREE.PlaneGeometry($window.innerWidth / 12 * 10, $window.innerHeight / 12 * 10);
        var planeMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0 });
        var pane = new THREE.Mesh(planeGeo, planeMat);
        pane.position.set(0, 0, 20);
        scene.add(pane);
        console.log(pane);


        if (!currentCard) {
            //new card to front
            tl.to(card.object.position, 1, { x: -25, y: 0, z: card.object.position.z + 120 })



            //if cross card
            if (card.object.name == shuffledDeck[1].name) {
                tl.to(card.object.rotation, 1, { x: 0, y: 0, z: 0 }, '-=1')
            }
            currentCard = card;
        } else { //if a card already on display

            //if clicked on current, current to back
            if (card.object.name == currentCard.object.name) {
                for (refCard in shuffledDeck) {
                    if (card.object.name == shuffledDeck[refCard].name) {
                        tl.to(card.object.position, 1, shuffledDeck[refCard].position);

                        //if cross card, also restore position
                        if (card.object.name == shuffledDeck[1].name) {
                            tl.to(card.object.rotation, 1, { x: Math.PI, y: Math.PI, z: Math.PI / 2 }, '-=1')
                        }

                    }
                }
                currentCard = null;
            } else {
                //else remove card,
                for (refCard in shuffledDeck) {
                    if (currentCard.object.name == shuffledDeck[refCard].name) {
                        tl.to(currentCard.object.position, 1, shuffledDeck[refCard].position);
                    }
                }
                //new card to front
                tl.to(card.object.position, 1, { x: -25, y: 0, z: card.object.position.z + 120 }, '-=1');
                //if cross card, also rotate
                if (card.object.name == shuffledDeck[1].name) {
                    tl.to(card.object.rotation, 1, { x: 0, y: 0, z: 0 }, '-=1')
                }
                currentCard = card;
            }
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



reader.controller('tree-of-life', ['$scope', '$log', '$window', 'tarotDeck', function($scope, $log, $window, tarotDeck) {


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

    $scope.cardPick = function(card) {

        if (!currentCard) {
            tl.to(card.object.position, 1, { x: -25, y: 0, z: card.object.position.z + 170 });
            $(".overlay").css('visibility', 'visible').hide().fadeTo('opacity', '0.8');
            currentCard = card;
        } else {
            if (card.object.name == currentCard.object.name) {
                for (refCard in shuffledDeck) {
                    if (card.object.name == shuffledDeck[refCard].name) {
                        tl.to(card.object.position, 1, shuffledDeck[refCard].position);
                        $(".overlay").fadeTo('opacity', '0', function() { $(".overlay").hide(); });
                    }
                }
                currentCard = null;
            } else {
                for (refCard in shuffledDeck) {
                    if (currentCard.object.name == shuffledDeck[refCard].name) {
                        tl.to(currentCard.object.position, 1, shuffledDeck[refCard].position);
                    }
                }
                tl.to(card.object.position, 1, { x: -25, y: 0, z: card.object.position.z + 170 }, '-=1');
                $(".overlay").css('visibility', 'visible').hide().fadeTo('opacity', '0.8');
                currentCard = card;
            }
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

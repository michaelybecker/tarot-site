// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Three Card Timeline&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&


reader.controller('ThreeCardTimelineCtrl', ['$scope', 'ThreeCardTimelineSvc', function($scope, ThreeCardTimelineSvc) {

    $scope.mouseMove = function(event) {
        ThreeCardTimelineSvc.mouse.x = (event.offsetX / ThreeCardTimelineSvc.renderer.domElement.width) * 2 - 1;
        ThreeCardTimelineSvc.mouse.y = -(event.offsetY / ThreeCardTimelineSvc.renderer.domElement.height) * 2 + 1;
    }

    $scope.mouseClick = function(e) {
        ThreeCardTimelineSvc.intersect(e);
    }

    $scope.$on("$destroy", function() {
        ThreeCardTimelineSvc.destroyScene();
    });

    ThreeCardTimelineSvc.init();
    ThreeCardTimelineSvc.render();
}]);

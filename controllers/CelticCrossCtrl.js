// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Celtic Cross&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

reader.controller('CelticCrossCtrl', ['$scope', 'CelCroSvc', function($scope, CelCroSvc) {

    $scope.mouseMove = function(event) {
        CelCroSvc.mouse.x = (event.offsetX / CelCroSvc.renderer.domElement.width) * 2 - 1;
        CelCroSvc.mouse.y = -(event.offsetY / CelCroSvc.renderer.domElement.height) * 2 + 1;
    }

    $scope.mouseClick = function(e) {
        CelCroSvc.intersect(e);
    }

    $scope.$on("$destroy", function() {
        CelCroSvc.destroyScene();
    });

    CelCroSvc.init();
    CelCroSvc.render();
}]);


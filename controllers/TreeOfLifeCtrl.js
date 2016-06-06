// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Tree of Life&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

reader.controller('TreeOfLifeCtrl', ['$scope', 'ToLSvc', function($scope, ToLSvc) {

    $scope.mouseMove = function(event) {
        ToLSvc.mouse.x = (event.offsetX / ToLSvc.renderer.domElement.width) * 2 - 1;
        ToLSvc.mouse.y = -(event.offsetY / ToLSvc.renderer.domElement.height) * 2 + 1;
    }

    $scope.mouseClick = function(e) {
        ToLSvc.intersect(e);
    }

    $scope.$on("$destroy", function() {
        ToLSvc.destroyScene();
    });

    ToLSvc.init();
    ToLSvc.render();
}]);

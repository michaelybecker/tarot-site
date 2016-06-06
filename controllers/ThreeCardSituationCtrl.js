
// &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&Three Card Situation&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

reader.controller('ThreeCardSituationCtrl', ['$scope', 'ThreeCardSitSvc', function($scope, ThreeCardSitSvc) {

    $scope.mouseMove = function(event) {
        ThreeCardSitSvc.mouse.x = (event.offsetX / ThreeCardSitSvc.renderer.domElement.width) * 2 - 1;
        ThreeCardSitSvc.mouse.y = -(event.offsetY / ThreeCardSitSvc.renderer.domElement.height) * 2 + 1;
    }

    $scope.mouseClick = function(e) {
        ThreeCardSitSvc.intersect(e);
    }

    $scope.$on("$destroy", function() {
        ThreeCardSitSvc.destroyScene();
    });

    ThreeCardSitSvc.init();
    ThreeCardSitSvc.render();
}]);


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
    this.focusOn = function(e) {
        $scope.deck.activeCard = e;
    }
}]);

reader.controller('menu', ['$scope', '$state', function($scope, $state) {
}]);

reader.controller('HomeCtrl', ['$scope', 'tarotDeck', function($scope, tarotDeck) {
    $scope.deck = tarotDeck.deck;
}]);

reader.controller('SpreadsCtrl', ['$scope', 'tarotDeck', function($scope, tarotDeck) {
    $scope.deck = tarotDeck.deck;
}]);

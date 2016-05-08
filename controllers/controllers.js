reader.controller('sidebar', ['$scope', '$log', 'tarotDeck', function($scope, $log, tarotDeck) {

$scope.deck = tarotDeck.deck;
$scope.deck.activeCard = tarotDeck.deck.activeCard;
this.focusOn = function(e){
  $scope.deck.activeCard = e;
}

this.filtercard = ""

}]);

reader.controller('cardindex', ['$scope', '$log', '$sanitize', '$sce', 'tarotDeck', function($scope, $log, $sanitize, $sce, tarotDeck) {
$scope.deck = tarotDeck.deck;
// $scope.deck.activeCard = tarotDeck.deck.activeCard;

// $scope.cardHistory = $sce.trustAsHtml($scope.deck.activeCard.history);

}]);

reader.controller('home', ['$scope', '$log', '$sanitize', '$sce', 'tarotDeck', function($scope, $log, $sanitize, $sce, tarotDeck) {
$scope.deck = tarotDeck.deck;
// $scope.deck.activeCard = tarotDeck.deck.activeCard;

// $scope.cardHistory = $sce.trustAsHtml($scope.deck.activeCard.history);

}]);
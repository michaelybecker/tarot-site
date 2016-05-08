reader.controller('sidebar', ['$scope', '$log', 'tarotDeck', function($scope, $log, tarotDeck) {

$scope.deck = tarotDeck.deck;
$scope.deck.activeCard = tarotDeck.deck.activeCard;
this.focusOn = function(e){
  $scope.deck.activeCard = e;
}

this.filtercard = ""

}]);

reader.controller('cardindex', ['$scope', '$log', 'tarotDeck', function($scope, $log, tarotDeck) {
$scope.deck = tarotDeck.deck;
$scope.deck.activeCard = tarotDeck.deck.activeCard;

}]);

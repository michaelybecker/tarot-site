reader.controller('sidebar', ['$scope', '$log', 'tarotDeck', function($scope, $log, tarotDeck) {

$scope.deck = tarotDeck.deck;
$scope.deck.activeCard = tarotDeck.deck.activeCard;
this.focusOn = function(e){
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
this.focusOn = function(e){
  $scope.deck.activeCard = e;
  console.log(e.name);
}


}]);

reader.controller('home', ['$scope', '$log', '$sanitize', '$sce', 'tarotDeck', function($scope, $log, $sanitize, $sce, tarotDeck) {
$scope.deck = tarotDeck.deck;

}]);

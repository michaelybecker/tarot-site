reader.controller('sidebar', ['$scope', '$log', function($scope, $log) {

this.deck = deck;
this.openModal = function(e){
	$log.log(e);
	window.open(e.image);
}
}]);
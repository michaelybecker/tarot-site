reader.directive('singleCard', function(){

return {

transclude: true,
scope: {
	deck:"="
},
template: '<h1>Card Index</h1>'+
    '<div class="row cardspace">' +
    '<div class="col-xs-12 cardtitle">' +
            '<h2>{{ deck.activeCard.name }}</h3>'+
            '</div></div>' + 
    '<div class="row carddetails">' +
        '<div class="col-xs-12 card-place">'+
            '<img class="img-responsive pull-left card-image" src="{{ deck.activeCard.image }}">'+
            '<h3>History</h3>'+
            '<p ng-bind-html="deck.activeCard.history"></p>'+
            '<h3>Interpretation</h3>' +
            '<p ng-bind-html="deck.activeCard.interpretation"></p>' +
        '</div>'
    // '</div>'
};

});
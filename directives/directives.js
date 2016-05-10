reader.directive('singleCard', function(){

return {

transclude: true,
scope: {
	deck:"="
},
template:
    '<div class="row cardspace">' +
    '<div class="col-xs-12 cardtitle">' +
            '<h1>{{ deck.activeCard.name }}</h1>'+
    '<div class="row carddetails">' +
        '<div class="col-xs-12 card-place">'+
            '<img class="img-responsive pull-left card-image" src="{{ deck.activeCard.image }}">'+
            // '<h3>History</h3>'+
            '<p ng-bind-html="deck.activeCard.PKT"></p>' +
            // '<h3>Interpretation</h3>' +
            // '<p ng-bind-html="deck.activeCard.interpretation"></p>' +
        '</div></div>'
    // '</div>'
};

});

reader.directive('customFooter', function(){

return {
scope: {},
template:
'<div class="fill"></div>' +
'<div class="footer">' +
'<div class="container">' +
'<p class="text-muted">Website by <a href="http://michaelhazani.com" alt="Michael Hazani\'s Website" target="_blank">Michael Hazani</a> all RWS art and acc. text are public domain in the US.</p>' +
'</div></div>'
};

});



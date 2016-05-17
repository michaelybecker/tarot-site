// TODO: hovers for spread positions
// TODO: Tree of Life spread
// TODO: Three.js Load manager
// TODO: refactor threejs into services


var reader = angular.module('tarotReader', ['ui.router', 'ngSanitize', 'ngAnimate']);

reader.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

$urlRouterProvider.otherwise('/');

$stateProvider

.state('/', {
	url: '/',
	views: {
		"sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		"main": {templateUrl: "./templates/home.tmpl.html"}
	},


})


.state('about', {
	// url: '/home.about',
			views: {
		"sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		"main": {templateUrl: "./templates/about.tmpl.html"}
	}
})

.state('spread', {
	// url: '/.spread',
			views: {
		"sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		"main": {templateUrl: "./templates/spread.tmpl.html"}
	}
})

.state('spread.three-card', {
	// url: '/.spread',
			views: {
				'activespread': {templateUrl: "./templates/threecard.spread.tmpl.html"}
	}
})

.state('spread.celtic-cross', {
	// url: '/.spread',
			views: {
				'activespread': {templateUrl: "./templates/celticcross.spread.tmpl.html"}
	}
})

.state('spread.tree-of-life', {
			views: {
				'activespread': {templateUrl: "./templates/treeoflife.spread.tmpl.html"}
	}
})

.state('cardindex', {
			views: {
		"sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		"main": {templateUrl: "./templates/cardindex.tmpl.html"}
	}
})

.state('cardsingle', {
			views: {
		"sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		"main": {templateUrl: "./templates/cardsingle.tmpl.html"}
	}
})

}]);



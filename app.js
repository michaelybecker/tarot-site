var reader = angular.module('tarotReader', ['ui.router']);

reader.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){


$urlRouterProvider.otherwise('/');

$stateProvider

.state('/', {
	url: '/',
	views: {
		"sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		"main": {templateUrl: "./templates/home.tmpl.html"}
	},
	controller: {
	},
	css: "./css/style.css"


})
.state('home', {
	url: '/home',
			views: {
		"sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		"main": {templateUrl: "./templates/home.tmpl.html"}
	}
})

.state('home.about', {
	url: '/about',
			views: {
		"sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		"main": {templateUrl: "./templates/about.tmpl.html"}
	}
})

.state('home.spread', {
	url: '/spread',
			views: {
		"sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		"main": {templateUrl: "./templates/spread.tmpl.html"}
	}
})

.state('home.cardindex', {
	url: '/cardindex',
			views: {
		"sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		"main": {templateUrl: "./templates/cardindex.tmpl.html"}
	}
})

}]);


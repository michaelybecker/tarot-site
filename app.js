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
.state('home', {
	// url: '/home',
			views: {
		"sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		"main": {templateUrl: "./templates/home.tmpl.html"}
	}
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

.state('spread.threeCard', {
	// url: '/.spread',
			views: {
		// "sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		// "main": {templateUrl: "./templates/spread.tmpl.html"}
	}
})

.state('spread.celticCross', {
	// url: '/.spread',
			views: {
		// "sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		// "main": {templateUrl: "./templates/spread.tmpl.html"}
	}
})

.state('spread.treeOfLife', {
	// url: '/.spread',
			views: {
		// "sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		// "main": {templateUrl: "./templates/spread.tmpl.html"}
	}
})

.state('cardindex', {
	// url: '/cardindex',
			views: {
		"sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		"main": {templateUrl: "./templates/cardindex.tmpl.html"}
	}
})

.state('cardsingle', {
	// url: '/cardindex',
			views: {
		"sidebar": {templateUrl: "./templates/sidebar.tmpl.html"},
		"main": {templateUrl: "./templates/cardsingle.tmpl.html"}
	}
})

}]);

reader.filter('trusted',
   function($sce) {
     return function(ss) {
       return $sce.trustAsHtml(ss)
     };
   }
)


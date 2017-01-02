(function() {
	'use strict';
	function HomeRoute($stateProvider) {
		$stateProvider.state('home', {
			url: '/home',
			controllerAs: 'ctrl',
			views: {
				nav: {
					templateUrl: '/javascripts/navBars/navBar.template.html',
					controller: 'NavBar'
				},
				content: {
					templateUrl: '/javascripts/home/home.template.html',
					controller: 'HomeCtrl',
				}
			}
		});
	}
	HomeRoute.$inject = ['$stateProvider'];
	window.angular.module('Home').config(HomeRoute);
})();
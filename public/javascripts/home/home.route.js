(function() {
	'use strict';
	function HomeRoute($stateProvider) {
		$stateProvider
		.state('home', {
			url: '/home',
			views: {
				nav: {
					templateUrl: '/javascripts/navBars/navBar.template.html',
					controller: 'NavBarCtrl',
					controllerAs: 'ctrl'
				},
				sideBar: {
					templateUrl: '/javascripts/navBars/sidebar.template.html',
					controller: 'NavBarCtrl',
					controllerAs: 'ctrl',
					collections: ['NavBarSrvc', function(NavBarSrvc) {
						return NavBarSrvc.ensureLoaded({}, false);
					}]
				},
				content: {
					templateUrl: '/javascripts/home/home.template.html',
					controller: 'HomeCtrl',
					controllerAs: 'ctrl',
					resolve: {
						collections: ['NavBarSrvc', function(NavBarSrvc) {
							return NavBarSrvc.ensureLoaded({}, false);
						}]
					}
				}
			}
		});
	}
	HomeRoute.$inject = ['$stateProvider'];
	window.angular.module('app.Home').config(HomeRoute);
})();
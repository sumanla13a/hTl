(function() {
	'use strict';
	function HotelCtrl($stateProvider, $locationProvider, $urlRouterProvider) {

		$locationProvider.hashPrefix('');
		$urlRouterProvider.otherwise('/home');
		// $locationProvider.html5Mode(true);
	} 
	HotelCtrl.$inject = ['$stateProvider', '$locationProvider','$urlRouterProvider'];
	window.angular.module('app').config(HotelCtrl);
})();
(function() {
	'use strict';
	function HomeCtrl(NavBarSrvc, Modals) {
		this.NavBarSrvc = NavBarSrvc;
		this.modalSrvc = Modals;
		console.log(NavBarSrvc);
	}

	

	HomeCtrl.$inject = ['NavBarSrvc', 'Modals'];
	window.angular.module('app.Home').controller('HomeCtrl', HomeCtrl);
})();
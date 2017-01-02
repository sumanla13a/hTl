(function() {
	'use strict';
	function HomeCtrl() {
		// console.log('constructing');
		console.log('hhh');
		this.title = 'Hotel Home';
	}
	HomeCtrl.$inject = [];
	window.angular.module('Home').controller('HomeCtrl', HomeCtrl);
})();
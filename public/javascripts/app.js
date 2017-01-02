(function() {
	'use strict';
	window.angular.module('hotelCalifornia', ['ui.router', 'uiRouterStyles', 'Home', 'NavBar']);

	document.addEventListener('DOMContentLoaded', function() {
		window.angular.bootstrap(document, ['hotelCalifornia'], { strictDi: true });
  	});

})();

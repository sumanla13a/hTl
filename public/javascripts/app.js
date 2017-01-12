(function() {
	'use strict';
	window.angular.module('app', ['ui.router', 'ngMaterial', 'ngResource', 'app.Home', 'app.NavBar', 'app.shared']);

	document.addEventListener('DOMContentLoaded', function() {
		window.angular.bootstrap(document, ['app'], { strictDi: true });
  	});

})();

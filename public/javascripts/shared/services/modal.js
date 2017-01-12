(function () {
	'use strict';
	function Modals(_, $mdDialog, $document) {
		var factory = {};

		factory.newAttribute = function ($event) {
			return $mdDialog.show({
				controller: 'AttributeModalController',
				controllerAs: 'ctrl',
				resolve: {
					
				},
				templateUrl: '/javascripts/shared/partials/new-attribute.template.html',
				parent: window.angular.element($document.body),
				targetEvent: $event,
				clickOutsideToClose: false,
				escapeToClose: false
			});

		};

		factory.editAttribute = function ($event) {
			return $mdDialog.show({
				controller: 'EditAttributeModalController',
				controllerAs: 'ctrl',
				resolve: {
					
				},
				templateUrl: '/javascripts/shared/partials/new-attribute.template.html',
				parent: window.angular.element($document.body),
				targetEvent: $event,
				clickOutsideToClose: false,
				escapeToClose: false
			});

		};

		factory.newCollection = function($event) {
			return $mdDialog.show({
				controller: 'ModelModalController',
				controllerAs: 'ctrl',
				resolve: {
					
				},
				templateUrl: '/javascripts/shared/partials/new-model.template.html',
				parent: window.angular.element($document.body),
				targetEvent: $event,
				clickOutsideToClose: false,
				escapeToClose: false
			});			
		}

		return factory;
	}
	/**
	 * @property {Array} Modals.$inject This injects the paramters properly for minimization.
	 */
	Modals.$inject = ['Underscore', '$mdDialog', '$document'];
	window.angular.module('app.shared').factory('Modals', Modals);



})();
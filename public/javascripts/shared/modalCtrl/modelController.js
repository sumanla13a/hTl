(function() {
	'use strict';
	function ModelModalController(NavBarSrvc, $mdDialog) {
		this.NavBarSrvc = NavBarSrvc;
		this.close = $mdDialog.cancel.bind($mdDialog);
	}

	ModelModalController.prototype.save = function() {
		this.NavBarSrvc.saveNewCollection(this.modelName);
	};

	ModelModalController.$inject = ['NavBarSrvc', '$mdDialog'];
	window.angular.module('app.shared').controller('ModelModalController', ModelModalController);
})();
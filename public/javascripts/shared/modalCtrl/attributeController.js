(function() {
	'use strict';
	function AttributeModalController(NavBarSrvc, $mdDialog) {
		this.NavBarSrvc = NavBarSrvc;
		this.close = $mdDialog.cancel.bind($mdDialog);
		this.attribute = {};
	}

	AttributeModalController.prototype.save = function() {
		var data = {};
		// data[this.attribute.name] = {};
		data.type = this.attribute.type;
		data.required = this.attribute.required;
		this.NavBarSrvc.addNextField(this.attribute.name, data).then(function() {
			console.log('aaa');
			this.close();
		}.bind(this)).catch(function() {
			window.alert('err');
		});
	};

	AttributeModalController.$inject = ['NavBarSrvc', '$mdDialog'];
	window.angular.module('app.shared').controller('AttributeModalController', AttributeModalController);
})();
(function () {
  'use strict';

  function ModelStructureCtrl(Modals, _) {
    this.modalSrvc = Modals;
    this._ = _;
  }

  ModelStructureCtrl.prototype.toShowOrNotToShow = function() {
    return this._.isEmpty(this.value.current);
  };

  ModelStructureCtrl.prototype.addCollection = function($event) {
    this.modalSrvc.newCollection($event).then(function() {
      window.alert('done');
    }).catch(function() {
      // window.alert('err');
    });
  };

  ModelStructureCtrl.prototype.addNextField = function() {
    this.value.addNextField();
  };

  ModelStructureCtrl.prototype.save = function() {
    this.value.saveCurrent();
  };

  ModelStructureCtrl.prototype.newAttribute = function($event) {
    this.modalSrvc.newAttribute($event).then(function() {
      window.alert('done');
    }).catch(function() {
      // window.alert('err');
    });
  };

  ModelStructureCtrl.prototype.saveJson = function() {
    this.value.saveJson();
  };

  ModelStructureCtrl.prototype.changeView = function(type) {
    switch(type) {
      case 'api':
        this.jsonView = false;
        this.apiView = true;
        break;
      case 'json':
        this.jsonView = !this.jsonView;
        this.apiView = false;
        break;
    }
  };

  ModelStructureCtrl.$inject = ['Modals', 'Underscore'];

  function ModelStructure() {
  	return {
  		scope: {},
  		bindToController: {
  			value: '='
  		},
  		templateUrl: '/javascripts/shared/partials/model.template.html',
  		controller: ModelStructureCtrl,
  		controllerAs: 'ctrl'
  	};
  }

  window.angular.module('app.shared')
    .directive('modelStructure', ModelStructure);
})();

(function() {
'use strict';

  function NavBarCtrl($mdSidenav, NavBarSrvc) {
    this.$mdSidenav = $mdSidenav;
    this.selected = null;
    this.NavBarSrvc = NavBarSrvc;
    this.collections = NavBarSrvc;

  }

  NavBarCtrl.$inject = ['$mdSidenav', 'NavBarSrvc'];
    
  NavBarCtrl.prototype.selectCollection = function (collection) {
    this.selected = window.angular.isNumber(collection) ? this.collections[collection] : collection;
    this.NavBarSrvc.getCurrent(collection);
  };

  window.angular.module('app.NavBar').controller('NavBarCtrl', NavBarCtrl);
})();

(function () {
  'use strict';

  window.angular.module('app.shared')
    .factory('Underscore', ['$window', function ($window) {
      return $window._;
    }]);
})();

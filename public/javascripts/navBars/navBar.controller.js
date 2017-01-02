(function(){
	'use strict';
	function NavCtrl($timeout, $mdSidenav, $log) {
		this.toggleLeft = buildDelayedToggler('left');
		this.toggleRight = buildToggler('right');
		this.$mdSidenav = $mdSidenav;
		this.$log = $log;
		function debounce(func, wait, context) {
			var timer;
			return function debounced() {
				var context = this,
				args = Array.prototype.slice.call(arguments);
				$timeout.cancel(timer);
				timer = $timeout(function() {
					timer = undefined;
					func.apply(context, args);
				}, wait || 10);
			};
		}

		function buildDelayedToggler(navID) {
			return debounce(function() {
				$mdSidenav(navID)
				.toggle()
				.then(function () {
					$log.debug('toggle ' + navID + ' is done');
				});
			}, 200);
		}

		function buildToggler(navID) {
			return function() {
				$mdSidenav(navID)
				.toggle()
				.then(function () {
					$log.debug('toggle ' + navID + ' is done');
				});
			};
		}
	}
	NavCtrl.$inject = ['$timeout', '$mdSidenav', '$log'];
	window.angular.module('NavBar').controller('NavCtrl', NavCtrl);
	/*.controller('LeftCtrl', function ($timeout, $mdSidenav, $log) {
	this.close = function () {
	  // Component lookup should always be available since we are not using `ng-if`
	  $mdSidenav('left').close()
	    .then(function () {
	      $log.debug("close LEFT is done");
	    });

	};
	});*/
	NavCtrl.prototype.close = function () {
	  // Component lookup should always be available since we are not using `ng-if`
	  this.$mdSidenav('left').close()
	    .then(function () {
	      this.$log.debug('close LEFT is done');
	    });

	}.bind(this);
}());

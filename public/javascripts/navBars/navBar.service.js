(function() {
'use strict';

  function NavBarSrvc(_, $resource, $q) {

    var resource = $resource('/collections/:name', {
        name: '@name'
    }, {
        saveCollection: {
            method: 'POST',
            url: '/collections/'
        },
        useDefaultUser: {
            method: 'POST',
            url: '/collections/default_user'
        },
        useOAuth: {
            method: 'POST',
            url: '/collections/oauth/settings'
        },
        getAllRoutes: {
            method: 'GET',
            url: '/collections/path/:name',
            params: {
                name: 'name'
            }
        }
    });

    var factory = {};
    factory.collections = [];
    factory.current = {};
    factory.currentJSON = '';
    factory.dataTypes = [];
    factory.query = function(query, extend) {
        var defer = $q.defer();
        if(factory.query._queried) {
            return factory.query._queried.promise;
        }
        factory.query._queried = defer;
        resource.get(query).$promise.then(function(data) {
            if(extend) {
                factory.collections = _.union(factory.collections, data.data.files);
                factory.dataTypes = data.data.dataTypes;
            } else {
                factory.collections = data.data.files;
                factory.dataTypes = data.data.dataTypes;
            }
            defer.resolve(factory);
        }).catch(defer.reject).finally(function() {
            delete factory.query.queried;
        });
        return defer.promise;
    };

    factory.ensureLoaded = function(query, force) {
        var defer = $q.defer();
        if(factory.ensureLoaded._queried) {
            return factory.ensureLoaded._queried.promise;
        }
        if(factory.collections.length && !force) {
            defer.resolve(factory);
        } else {
            factory.ensureLoaded._queried = defer;
            factory.query(query, !force)
            .then(defer.resolve)
            .catch(defer.reject)
            .finally(function() {
                delete factory.ensureLoaded._queried;
            });
        }
        return defer.promise;
    };

    factory.getCurrent = function(name) {
        var defer = $q.defer();
        if(factory.getCurrent._queried) {
            return defer.promise;
        } else {
            factory.getCurrent._queried = defer;
            resource.get({name: name}).$promise.then(function(data) {
                factory.current = {
                    data: data.data.json,
                    keys: _.keys(data.data.json),
                    name: name,
                    listOPath: data.data.listOPath
                };
                console.log(factory.current);
                factory.currentJSON = JSON.stringify(factory.current.data, undefined, 24);
                defer.resolve(data);
            }).catch(defer.reject).finally(function() {
                delete factory.getCurrent._queried;
            });
        }
        return defer.promise;
    };

    factory.addNextField = function(name, field) {
        factory.current.data[name] = field;
        console.log(factory.current.data);
        return factory.saveCurrent();
    };

    factory.saveCurrent = function() {
        var data = {
            name: factory.current.name,
            schema: factory.current.data
        };
        var defer = $q.defer();
        resource.saveCollection(data).$promise.then(function() {
            
            return factory.getCurrent(factory.current.name);
        }).catch(function(err) {
            defer.reject(err);
        });
        return defer.promise;
    };

    factory.saveNewCollection = function(name) {
        var data = {
            name: name,
            schema: {}
        };
        resource.saveCollection(data).$promise.then(function() {
            factory.collections.push(name);
            return factory.getCurrent(name);
        }).then(function() {
            window.alert('done');
        }).catch(function() {
            window.alert('err');
        });
    };

    factory.saveJson = function() {
        try {
            factory.current.data = JSON.parse(factory.currentJSON);
        } catch(e) {
            alert(e);
        }
        return factory.saveCurrent();

    };
    return factory;
  }


  NavBarSrvc.$inject = ['Underscore', '$resource', '$q'];
    

  window.angular.module('app.NavBar').factory('NavBarSrvc', NavBarSrvc);
})();

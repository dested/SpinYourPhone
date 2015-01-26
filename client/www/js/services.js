angular.module('spinYourPhone.services', [])
    .factory('$localStorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])

    .service('authService', function ($q, $http, $localStorage) {

        return {
            authorize: function (username) {
                var deferred = $q.defer();

                $localStorage.set('username', username);

                if (!username) {
                    deferred.reject();
                }

                $http({
                    method: 'GET',
                    url: 'http://192.168.1.3:3000/token',
                    headers: {
                        'username': $localStorage.get('username')
                    }
                }).
                    success(function (data, status, headers, config) {
                        $localStorage.set('serverSpins', data['spins']);
                        $localStorage.set('token', data['token']);
                        deferred.resolve();
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject();
                    });

                return deferred.promise;
            }
        }
    })


    .service('spinService', function ($q, $http, $localStorage) {
        return {
            spin: function (spins) {
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: 'http://192.168.1.3:3000/spin',
                    data: {spins:spins},
                    headers: {
                        'Content-Type':'application/json',
                        'x-access-token': $localStorage.get('token')
                    }
                }).
                    success(function (data, status, headers, config) {
                        deferred.resolve();
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject();
                    });

                return deferred.promise;
            }
        }
    })
;

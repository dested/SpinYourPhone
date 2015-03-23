angular.module('spinYourPhone.controllers', [])

    .controller('LeaderboardCtrl', function ($scope, $ionicModal, $timeout) {
    })
    .controller('LoginCtrl', function ($scope, $http, $location, $ionicLoading, authService) {
        $scope.model = {};
        $scope.callback = {};

        $scope.model.username = '';
        $scope.callback.join = function () {
            $ionicLoading.show({
                template: 'Authenticating...'
            });

            authService.authorize($scope.model.username)
                .then(function () {
                    $location.path('/app/spin');
                })
                .finally(function () {
                    $ionicLoading.hide();
                });
        };

    })
    .controller('LeaderboardCtrl', function ($scope, $ionicModal, $timeout) {
    })
    .controller('BadgesCtrl', function ($scope, $ionicModal, $timeout) {
    })
    .controller('StarCtrl', function ($scope, $ionicModal, $timeout) {
    })
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
        $scope.model = {};
        $scope.callback = {};


        $scope.model.insomniaEnabled = false;
        $scope.callback.toggleInsomnia = function () {
            $scope.model.insomniaEnabled = !$scope.model.insomniaEnabled;
            if ($scope.model.insomniaEnabled) {
                window.plugins.insomnia.keepAwake()
            } else {
                window.plugins.insomnia.allowSleepAgain()
            }
        };


    })
    .controller('SpinCtrl', function ($scope, $cordovaDeviceOrientation, $localStorage, spinService) {
        $scope.model = {};
        $scope.callback = {};


        $scope.model.logs = [];
        var radVal = 0;
        var spinCount = 0;

        if ($localStorage.get('serverSpins')) {
            spinCount = parseInt($localStorage.get('serverSpins'));
        } else {
            spinCount = 0;
        }
        var oldMagneticHeading = -1;
        var spinVal = 0;


        setInterval(function () {
            if ($scope.model.radVal != radVal || $scope.model.spinCount != spinCount) {
                $scope.model.radVal = radVal;
                $scope.model.spinCount = spinCount;
                $scope.$apply();
            }
        }, 20);


        $scope.model.flip = false;
        $scope.model.hittingServer = false;
        var cachedSpins = [];

        setInterval(function () {
            var localSpins = $localStorage.get('localSpins');
            if (localSpins) {
                $scope.model.hittingServer = true;
                spinService.spin(JSON.parse(localSpins)).then(function () {
                    $localStorage.setObject('localSpins', cachedSpins);
                    cachedSpins = [];
                }).finally(function () {
                    $scope.model.hittingServer = false;
                });

            }
        }, 5000);

        var updateHeading = function (result) {
            var magneticHeading = result.magneticHeading;

            if (oldMagneticHeading == -1 && magneticHeading != 0) {

                oldMagneticHeading = magneticHeading;
                return;
            }


            var offset = magneticHeading - oldMagneticHeading;
            if (Math.abs(offset) <= 2)return;
            if (Math.abs(offset) > 270) {
                if (offset > 0) {
                    offset = offset - 360;
                } else {
                    offset = 360 + offset;
                }
            }

            spinVal += offset;

            if (spinVal > 0) {
                while (spinVal >= 360) {
                    spinCount++;
                    endSpin();
                    spinVal -= 360;
                }

            } else {
                while (spinVal <= -360) {
                    spinCount++;
                    endSpin();
                    spinVal += 360;

                }
            }

            $scope.model.flip = spinVal < 0;


            radVal = (Math.abs(spinVal) / 360 * 100) | 0;

            false && $scope.model.logs.push(
                {
                    magneticHeading: magneticHeading,
                    oldMagneticHeading: oldMagneticHeading,
                    offset: offset,
                    radVal: radVal,
                    spinVal: spinVal,
                    flip: $scope.model.flip,
                    now: new Date().getTime()
                });

            oldMagneticHeading = magneticHeading;

        };

        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)) {

            document.addEventListener("deviceready", function () {

                window.plugin.backgroundMode.enable();

                var options = {
                    frequency: 1
                };


                navigator.compass.watchHeading(updateHeading, function (err) {
                }, options);
            }, false);


        } else {

            var c = 0;
            setInterval(function () {
                updateHeading({magneticHeading: (c += Math.random() * 5) % 360});
            }, 20);

        }


        var currentSpin;

        function startSpin() {
            currentSpin = {};
            currentSpin.startTime = new Date().valueOf();
        }

        function endSpin() {
            currentSpin.endTime = new Date().valueOf();

            if ($scope.model.hittingServer) {
                cachedSpins.push(currentSpin);
            } else {


                var localSpins = $localStorage.get('localSpins');
                if (localSpins) {
                    localSpins = JSON.parse(localSpins);
                } else {
                    localSpins = [];
                }
                localSpins.push(currentSpin);
                $localStorage.setObject('localSpins', localSpins)
            }
            startSpin();
        }

        startSpin();


    });

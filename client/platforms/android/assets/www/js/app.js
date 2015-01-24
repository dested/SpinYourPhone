angular.module('spinYourPhone', ['ionic', 'spinYourPhone.controllers', 'spinYourPhone.services', 'ngCordova'])

    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (screen.lockOrientation) {
                screen.lockOrientation('portrait');
            }

            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider) {

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })

            .state('app.spin', {
                url: '/spin',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/spin.html',
                        controller: 'SpinCtrl'
                    }
                }

            })

            .state('app.leaderboard', {
                url: '/leaderboard',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/leaderboard.html',
                        controller: 'LeaderboardCtrl'
                    }
                }

            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/spin');

    });

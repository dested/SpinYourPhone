angular.module('spinYourPhone.controllers', [])

.controller('DashCtrl', function($scope,$cordovaDeviceOrientation) {

$scope.error='not ready';
document.addEventListener("deviceready", function () {
        $scope.error='device ready';

    var options = {
      frequency: 1
    }

    var watch = $cordovaDeviceOrientation.watchHeading(options).then(
      null,
      function(error) {
        // An error occurred
        $scope.error=error;
      },
      function(result) {   // updates constantly (depending on frequency value)
        var magneticHeading = result.magneticHeading;
        var trueHeading = result.trueHeading;
        var accuracy = result.headingAccuracy;
        var timeStamp = result.timestamp;
        $scope.radVal=(magneticHeading/360*100)|0;
      });
 
        $scope.$apply();

  }, false);


})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

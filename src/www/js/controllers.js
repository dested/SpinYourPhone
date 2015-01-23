angular.module('spinYourPhone.controllers', [])

.controller('DashCtrl', function($scope,$cordovaDeviceOrientation) {
  var  radVal=0;
  $scope.model={};

  $scope.model.insomniaEnabled=false;
  setInterval(function(){
    if($scope.radVal!=radVal){
      $scope.radVal=radVal;
      $scope.$apply();
    }
  },50);

$scope.callback={};

$scope.callback.toggleInsomnia=function(){
  $scope.model.insomniaEnabled=!$scope.model.insomniaEnabled;

  if($scope.model.insomniaEnabled){
    window.plugins.insomnia.keepAwake()
  }else{
    window.plugins.insomnia.allowSleepAgain()
  }
};


  document.addEventListener("deviceready", function () {
    var options = {
      frequency: 1
    }

    navigator.compass.watchHeading(function (result) {

     var magneticHeading = result.magneticHeading;
     radVal=(magneticHeading/360*100)|0;

   }, function (err) {
   }, options);


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

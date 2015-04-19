angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicLoading, $compile) {
    
    $scope.mapOptions = {};
    
      $scope.init = function() {
        var myLatlng = new google.maps.LatLng(43.07493,-89.381388);

        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Starting Point'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
    };

    // google.maps.event.addDomListener(window, 'load', initialize);

    $scope.centerOnMe = function() {
        if(!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });
$scope.posOptions = {timeout: 10000, enableHighAccuracy: true};
        
        navigator.geolocation.getCurrentPosition(function(pos) {
            console.log(pos.coords.latitude);
            console.log(pos.coords.longitude);
            console.log($scope.mapOptions);
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
         $scope.map.setZoom(13);
            $scope.newLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
            
            $scope.marker = new google.maps.Marker({
          position: $scope.newLatlng,
          map: $scope.map,
          title: 'new point'
        })
            
               $scope.contentString = "<div><a ng-click='clickTest()'>Current Location</a></div>";
        $scope.compiled = $compile($scope.contentString)($scope);

        $scope.infowindow = new google.maps.InfoWindow({
          content: $scope.compiled[0]
        });
            
            google.maps.event.addListener($scope.marker, 'click', function() {
          $scope.infowindow.open($scope.map,$scope.marker);
        });
            
          $ionicLoading.hide();
        }, function(error) {
          alert(error.message);
        }, $scope.posOptions);
    };

    $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
    };
})

.controller('ChatsCtrl', function($scope, $firebaseArray) {
    
    
  
     // create a reference to the Firebase where we will store our data
     var ref = new Firebase("https://frickefamily.firebaseio.com/");
 
     // this uses AngularFire to create the synchronized array
     // We limit the results to 10
     $scope.data = $firebaseArray(ref);
    
      // create a query for the most recent 25 messages on the server
    var query = ref.orderByChild("timestamp").limitToLast(25);
    
    // the $firebaseArray service properly handles Firebase queries as well
    $scope.messages = $firebaseArray(query);

    
    //Initialize message object
    $scope.message = {};
 
    //Add message to the firebase data
    $scope.addMessage = function(message) {
      $scope.messages.$add({content: message, user: "Spencer"});
      //we reset the text input field to an empty string
      $scope.message.theMessage = "";
    };
    
  
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
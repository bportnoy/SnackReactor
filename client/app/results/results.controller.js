var app = angular.module('snackReactorApp')

app.controller('ResultsCtrl', function ($scope,CheckLoggedIn, $location, SearchRestaurants, $state, SharedData, SendRating, GetRating) {

  //have to run checked in on each controller
  $scope.checkLogged = function () {
    CheckLoggedIn().then(function(result){
      if(!result.data){
        $location.path("/");
      }
    });
  };
  $scope.restaurants = SharedData.get('results'); // get the results from the data store.

  $scope.placesService = new google.maps.places.PlacesService(window.document.createElement('div'));

  $scope.restaurants.forEach(function(restaurant){

    //get ratings for each restaurant
    GetRating(restaurant.id)
    .success(function(data,status,headers,config){
      restaurant.avgRating = data.avgRating;
    })
    .error(function(data,status,headers,config){
      console.error('Error: ' + data);
    });

    //get photos for each restaurant
    $scope.placesService.getDetails({placeId: restaurant.place_id}, function(result){
      restaurant.photo_url = result.photos[0].getUrl({'maxWidth': 600});
      $scope.$apply();
    });
  });

  $scope.oneAtATime = true;
  
  $scope.status = {
    isFirstOpen: true,
    isFirstDisabled: false
  };
  //---------

  $scope.sendRating = function(id, rating){
    SendRating(id, rating);
  };

  $scope.reshuffle = function () {

    //ideally, this should just call another request to the server 
    SearchRestaurants(SharedData.get('health'), SharedData.get('price'))
    .success(function(data, status, headers, config){
      $scope.restaurants = data;
    });

  // $state.reload(); //is this necessary?

  };

});


app.controller('AddModal', function ($scope, $modal, $log, CheckLoggedIn) {
  $scope.items = [];

  $scope.open = function (size) {
    var modalInstance = $modal.open({
      templateUrl: 'restaurant.html',
      controller: 'FormCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
    });
  };

});

app.controller('FormCtrl', function ($scope, $modalInstance, items, CheckLoggedIn) {

   $scope.test = function (something) {
    console.log(something);
  }

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});
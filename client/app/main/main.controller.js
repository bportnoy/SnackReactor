'use strict';

var app = angular.module('snackReactorApp');
//refactor to services
app.controller('MainCtrl', function ($scope, $http, $log,$document, ModalService,$location, SearchRestaurants, SharedData) {

  // $scope.isLogged = false;
  // $scope.priceClick = false;
  // $scope.is1healthClick = false;
  // $scope.is2healthClick = false;
  // $scope.is3healthClick = false;
  // $scope.is1priceClick = false;
  // $scope.is2priceClick = false;
  // $scope.is3priceClick = false;
  // $scope.healthRank=1;
  // $scope.priceRank=1;
  // $scope.searching = false;
  // $scope.noResults = false;

  $scope.heartText = '';
  $scope.priceText = '';
  $scope.ratingText = '';
  $scope.health = 0;
  $scope.price = 0;

  $scope.hoverHeart = function(value) {
    var heartText = {
      1: 'Junk food!',
      2: 'Any food will do.',
      3: 'Something healthy, please!',
      4: ''
    };
    $scope.heartText = heartText[value];
  };


  $scope.hoverPrice = function(value) {
    var priceText = {
      1: '$9 & Under',
      2: '$10 - $19',
      3: '$20 ++',
      4: ''
    };
    $scope.priceText = priceText[value];
  };


  $scope.logout = function (){
    $scope.isLogged = !$scope.isLogged;
  };

  $scope.search = function (view){
    $scope.noResults = false;
    $scope.searching = true;

    //save data in case we need to search again

    SharedData.set('health', $scope.health);
    SharedData.set('price', $scope.price);

    SearchRestaurants($scope.health,$scope.price)
    .success(function(data, status, headers, config){
      $scope.searching = false;
      SharedData.set('results', data);
      // SharedData.set('results', dummyData);
      $location.path(view);
    })
    .error(function(data,status, headers, config){
      $scope.searching = false;
      $scope.noResults = true;
      console.log(data);
    }); 
  }

});

app.controller('ModalCtrl', function ($scope, $modal, $log, CheckLoggedIn) {
  $scope.items = [];
  $scope.open = function (size) {
    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      backdrop: 'static',
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

 CheckLoggedIn().then(function(result){

  if (!result.data){
    $scope.logout();
    $scope.open();
  }
 });

});

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, CheckLoggedIn) {

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

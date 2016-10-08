(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('NarrowItDownService', NarrowItDownService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.directive('foundItems', FoundItemsDirective);


function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      onRemove: '&'
    },
    controller: NarrowItDownController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}



NarrowItDownController.$inject = ['NarrowItDownService'];
function NarrowItDownController(NarrowItDownService) {
  var list = this;

  list.getMatchedMenuItems = function (searchTerm) {
    NarrowItDownService.getMatchedMenuItems(searchTerm).then(function(searchResult) {
      list.found = searchResult.value;
    });
  };


  list.removeItem = function (itemIndex) {
    console.log("'this' is: ", this);
    list.found.splice(itemIndex, 1);
  };
}


NarrowItDownService.$inject = ['$http', 'ApiBasePath']
function NarrowItDownService($http, ApiBasePath) {
  var service = this;
  service.getMatchedMenuItems = function (searchTerm) {
    var promise = $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
    }).then(function (result) {
      var items = result.data.menu_items;
      var foundItems = [];
      for (var key in items) {
        if (items.hasOwnProperty(key)) {
          var item = items[key];
          if (item.name.toLowerCase().indexOf(searchTerm) !== -1) {
            foundItems.push(item);
          }
        }
      }
      return foundItems;
    });

    return promise;

  };

}

})();

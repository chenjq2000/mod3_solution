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
      found: '<',
      onRemove: '&'
    },
    controller: NarrowItDownDirectiveController,
    controllerAs: 'list',
    bindToController: true
  };

  return ddo;
}

function NarrowItDownDirectiveController() {
  var list = this;
}


NarrowItDownController.$inject = ['NarrowItDownService'];
function NarrowItDownController(NarrowItDownService) {
  var list = this;
  list.found = [];

  list.getMatchedMenuItems= function (searchTerm) {
    list.found = NarrowItDownService.getMatchedMenuItems(searchTerm).then(function(searchResult) {return result;});
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
      for (var item in items) {
        if (item.name.toLowerCase().indexOf(searchTerm) !== -1) {
          foundItems.push(item);
        }
      }
      return foundItems;
    });

    return promise;

  };

}

})();

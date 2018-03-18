(function() {

  "use strict";

  angular.module('app', ['ngRoute']);

  angular.module('app')
    .controller('homeController', ['$location', 'mapUrlToRouteService', function ($location, mapUrlToRouteService) {

      var urlToGetParamsAndValuesFor = 'http://example.com#/bar/5/red';

      this.routeParamsAndValues = mapUrlToRouteService.getRouteData(urlToGetParamsAndValuesFor);

      var urlThatWillHaveNoPath = 'http://example.com#/bar/6/purple/whatever/man';

      this.urlThatWillHaveNoPath = mapUrlToRouteService.getRouteData(urlThatWillHaveNoPath);      

      this.routeParamsAndValuesForCurrentLocation = mapUrlToRouteService.getRouteData($location.$$absUrl);

    }]);

  angular.module('app')
    .controller('anotherController', ['$location', 'mapUrlToRouteService', function ($location, mapUrlToRouteService) {

      var urlToGetParamsAndValuesFor = 'http://example.com#/bar/8/green';

      this.routeParamsAndValues = mapUrlToRouteService.getRouteData(urlToGetParamsAndValuesFor);

      var urlThatWillHaveNoPath = 'http://example.com#/bar/8/green/whatever';

      this.urlThatWillHaveNoPath = mapUrlToRouteService.getRouteData(urlThatWillHaveNoPath);      

      this.routeParamsAndValuesForCurrentLocation = mapUrlToRouteService.getRouteData($location.$$absUrl);    
          
    }]);

  angular.module('app')
    .controller('yetAnotherController', ['$location', 'mapUrlToRouteService', function ($location, mapUrlToRouteService) {

      var urlToGetParamsAndValuesFor = 'http://example.com#/bar/foo/8/green/cool';

      this.routeParamsAndValues = mapUrlToRouteService.getRouteData(urlToGetParamsAndValuesFor);

      var urlThatWillHaveNoPath = 'http://example.com#/bar/foo/8/green/cool/not';

      this.urlThatWillHaveNoPath = mapUrlToRouteService.getRouteData(urlThatWillHaveNoPath);      

      this.routeParamsAndValuesForCurrentLocation = mapUrlToRouteService.getRouteData($location.$$absUrl);    
          
    }]);

  angular.module('app')
    .config(['$routeProvider', function($routeProvider){
      $routeProvider
      .when('/', {
        templateUrl: 'partials/home.html',
        controller: 'homeController',
        controllerAs: 'home'          
      })
      .when('/bar/:var1a/:var1b', {
        templateUrl: 'partials/another.html',
        controller: 'anotherController',
        controllerAs: 'another'
      })
      .when('/bar/foo/:var2a/:var2b/:var2c', {
        templateUrl: 'partials/yetAnother.html',
        controller: 'yetAnotherController',
        controllerAs: 'yetAnother'
      });
    }]);

  angular.module('app')
    .factory('mapUrlToRouteService', ['$route', function ($route) {

      // Service object
      var mapUrlToRouteService = {};

      // Method that returns the route data 
      mapUrlToRouteService.getRouteData = function (url) {

        // The object we return
        var routeData = {};

        /* 
         * Given url : http://example.com#/bar/5/red
         * urlParts = ['http://example.com', '/bar/5/red']
         * urlParams = ['bar', '5', 'red']
         *
         */
        var urlParts = url.split('#');
        var urlParams = urlParts[1].substr(1).split('/');

        /*
         * Method that builds the routeData object that we return.
         *
         * We cycle through all routes, trying to find a match
         * for the url we passed in.
         */
        angular.forEach($route.routes, function(value, key) {

          /*
           * The 'key' parts are the routes you defined
           * in your config, like '/bar/:var1a/:var1b'.
           * 
           * Note that because '/bar/:var1a/:var1b' exists,
           * '/bar/:var1a/:var1b/' also exists and it
           * redirects to '/bar/:var1a/:var1b'.           
           *
           * Therefore, we have to remove the leading and
           * trailing '/' from each key before we split
           * so that we don't end up with empty ("")
           * positions in our resulting array.
           *
           * So here, we first remove the leading '/',
           * then remove the trailing '/' if one exists,
           * then split to create our array.
           * 
           * So '/bar/:var1a/:var1b' and '/bar/:var1a/:var1b/'
           * would both become:
           * 
           * ['bar', ':var1a', ':var1b'] 
           */

          var keyParts = key.substr(1);
          if (keyParts.slice(-1) == '/') {
            keyParts = keyParts.substring(0, keyParts.length - 1);
          }          
          keyParts = keyParts.split('/');

          /*
           * Now, we need to find out which elements in
           * our keyParts array are directories because
           * we don't want to count parameters as
           * directories.
           *
           * To do this, we check to see each array element
           * value contains a ':'. Whenever we encounter an
           * array element value that does NOT contain a ':',
           * we increment the number of directories.
           *
           */
          var numDirectories = 0;
          for (var i = 0; i < keyParts.length; i++) {
            if (!(keyParts[i].indexOf(':') >= 0)) {
              numDirectories += 1;
            }
          }

          /* 
           * Given url : http://example.com#/bar/5/red
           * and assuming that the route we are currently
           * checking is a match for our url, we would
           * now have:
           *
           * urlParams = ['bar', '5', 'red']
           * keyParts = ['bar', ':var1a', ':var1b']
           *
           * and our numDirectories variable would have a
           * value of 1 because only one of the elements
           * in the keyParts array did NOT contain a ':'.
           *
           * (If no parameters were passed, then tempKey and
           * tempUrl are both assigned a value of '/' and
           * the for loop is skipped because numDirectories
           * would have a value of 0.)
           *
           * But in our example case, assuming that the route
           * we are currently checking is a match for our url,
           * we get:
           *
           * tempKey = '/bar'
           * tempUrl = '/bar'            
           *
           */
          var tempKey = (numDirectories == 0) ? '/' : ''; 
          var tempUrl = (numDirectories == 0) ? '/' : '';         
          for (var i = 0; i < numDirectories; i++) {
            tempKey += '/' + keyParts[i];
            tempUrl += '/' + urlParams[i];                      
          }

          /*
           * If no parameters have been passed, we still enter
           * the if condition, but the for loop is skipped because
           * numDirectories and keyParts.length both have a value
           * of 0.
           *
           * In the case of our example, we enter the if condition
           * and the for loop because tempKey and tempUrl have
           * the same value, and keyParts and urlParams both
           * have a length of 3.
           *
           * We through the for loop twice because keyParts.length
           * is equal to 3, and numDirectories is equal to 1.
           *
           * We add two key:value pairs to the routeData object,
           * having skipped the directory name in both the keyParts
           * array and the urlParams array because we begin at
           * index position 1 (the value of numDirectories).
           *
           * The leading ':' is stripped off the parameter values
           * coming from the keyParts array, so we end up with a
           * routeData object that for our example, looks
           * like this:
           *
           * {"var1a":"6","var1b":"red"}
           */
          if ((tempKey == tempUrl) && (keyParts.length == urlParams.length)) {
            for (var i = numDirectories; i < keyParts.length; i++) {
              routeData[keyParts[i].substr(1)] = urlParams[i];
            }
          }

        });

        /*
         * If no parameters were present in the url we passed in, then
         * the routeData object is currently empty, so we add a key:value
         * pair info message to inform the user.
         *
         * If parameters were passed in, but a matching path was not
         * found in our configured routes, then we add a key:value pair
         * error message to inform the user that no match was found.
         */
        if (urlParams == "") {
          routeData['info'] = 'No url params were specified.';
        } else {
          if(Object.getOwnPropertyNames(routeData).length == 0){
            routeData['error'] = 'Sorry, no paths matched the tested url.';
          }
        }      
        
        // Return the data
        return routeData;      
      };

      // Return the service object
      return mapUrlToRouteService;
    }]);

})();
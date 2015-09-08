'use strict';

var _ = require('lodash');
var angular = require('angular');

angular.module('services.common', [])
  .factory('CommonService', ['StatusService', function (StatusService) {

    function handlePromise(promise, success) {
      promise.then(success, StatusService.errorHandler)
    }

    return {
      bindPromiseToScope: function(promise, $scope, name, convert) {
        handlePromise(promise,
          function (response) {
            $scope[name] = convert(response.data);
          });
      },

      partitionBy: function (f, collection) {

        if (!_.isEmpty(collection)) {
          return (_.reduce(collection,
            function (acc, item) {
              if (f(item) === acc.current) {
                _.last(acc.partitions).push(item);
              } else {
                var next = [item]
                acc.partitions.push(next);
                acc.current = f(item);
              }
              return acc;
            },
            {current: f(_.first(collection)), partitions: [[]]})).partitions;
        } else {
          return null;
        }
      }
    };
  }]);

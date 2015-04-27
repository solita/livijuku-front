'use strict';

angular.module('services.common', [])

  .factory('CommonService', ['StatusService', function (StatusService) {

    function handlePromise(promise, success, toiminto) {
      promise.success(success)
        .error(function (data) {
          StatusService.virhe(toiminto, data);
        })
    }

    return {
      bindPromiseToScope: function(promise, $scope, name, convert, toiminto) {
        handlePromise(promise,
          function (data) {
            $scope[name] = convert(data);
          },
          toiminto);
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

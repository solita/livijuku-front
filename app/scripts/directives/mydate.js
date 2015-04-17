// http://stackoverflow.com/a/28202178
'use strict';
angular.module('jukufrontApp')
  .directive('myDate',function(dateFilter,$parse){
    return{
      restrict:'EAC',
      require:'?ngModel',
      link:function(scope,element,attrs,ngModel,ctrl){
        ngModel.$parsers.push(function(viewValue){
          return dateFilter(viewValue,'yyyy-MM-dd');
        })}}})

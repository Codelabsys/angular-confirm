/*
 * angular-confirm
 * http://schlogen.github.io/angular-confirm/
 * Version: 1.0 - 2014-24-11
 * License: Apache
 */
angular.module('angular-confirm', ['ui.bootstrap'])
.controller('ConfirmModalController', function($scope, $modalInstance, data) {
  $scope.data = angular.copy(data);

  $scope.ok = function () {
    $modalInstance.close();
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
})
.service('$confirmModalSettings', function() {
  this.template = '<div class="modal-header"><h3 class="modal-title">Confirm</h3></div><div class="modal-body">{{data.text}}</div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';
  this.controller = 'ConfirmModalController';
})
.factory('$confirm', function($modal, $confirmModalSettings) {
  return function(data, func, settings) {
    settings = settings || $confirmModalSettings;
    
    if ('templateUrl' in settings && 'template' in settings) {
      delete settings.template;
    }
    
    settings.resolve = {data: function() { return data; }};

    var modal = $modal.open(settings);

    modal.result.then(func);
  };
})
.directive('confirm', function($confirm) {
    return {
        priority: 1,
        restrict: 'A',
        scope: {
          confirmIf: "=",
          ngClick: '&',
          confirm: '@'
        },
        link: function(scope, element, attrs) {
          function unbind() {
            element.unbind("click");
            return element;
          }
          
          function bind(func) {
            element.bind("click", func);
            return element;
          }
          
          function bindConfirm() {
            unbind().bind(function() {
            	$confirm({text: scope.confirm}, scope.ngClick);
            });
          }

          if ('confirmIf' in attrs) {
            scope.$watch('confirmIf', function(newVal) {
              if (newVal) {
                bindConfirm();
              } else {
                unbind().bind(function() {
                  scope.$apply(function() {
                    scope.ngClick();
                  });
                  console.log(scope);
                });
              }
            });
          } else {
            bindConfirm();
          }
        }
    }
});

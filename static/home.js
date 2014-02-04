var app = angular.module('main', ['toaster'])

app.controller('IndexCtrl', function ($scope) {

});

//Loads the menu from a given template file and inserts it it to the <div menu> tag
app.directive('menu', function($http) {
    return {
        restrict: 'A',
        templateUrl: '/static/templateMenu.html',
        link: function(scope, element, attrs) {
            scope.fetchMenu();
        }
    }
});
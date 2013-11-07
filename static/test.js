
    alert('START');
    var app = angular.module('app', []);

    app.factory('testFactory', function ($http) {
                return {
                    getTests: function () {
                        alert('getTests');
                        return $http.get("/list")
                    }
                };
    });


    app.factory('notificationFactory', function () {

        return {
            success: function () {
                alert('success');
                //toastr.success("Success");
            },
            error: function (text) {
                alert(text);
                //toastr.error(text, "Error!");
            }
        };
    });


    app.controller('IndexCtrl', function ($scope, testFactory, notificationFactory) {
        alert('controller')
        $scope.list = [];

        var getListSuccessCallback = function (data, status, headers, config) {
            alert('callback');
            $scope.list = data;
        };

        var errorCallback = function (data, status, headers, config) {
            alert(data);
            notificationFactory.error(data.ExceptionMessage);
        };

        //testFactory.getTests();

        testFactory.getTests().success(getListSuccessCallback).error(errorCallback);

        $scope.getList = function () {
            alert('getList')
            return testFactory.getTests().success(getListSuccessCallback).error(errorCallback);
        };

    });
    alert('DONE');


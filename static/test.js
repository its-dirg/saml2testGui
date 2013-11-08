
    var app = angular.module('app', []);

    app.factory('testFactory', function ($http) {
        return {
            getTests: function () {
                //alert('getTests');
                return $http.get("/list")
            }
        };
    });

    app.factory('configFactory', function ($http) {
        return {
            getConfig: function () {
               // alert('getConfig');
                return $http.get("/config")
            }
        };
    });

    app.factory('runTestFactory', function ($http) {
        return {
            getTestResult: function () {
                //alert('runTestFactory');
                return $http.get("/run_test")
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


    app.controller('IndexCtrl', function ($scope, testFactory, notificationFactory, configFactory, runTestFactory) {
        //alert('controller')
        $scope.testList = [];
        $scope.configList = [];
        $scope.testResult = "Empty";

        var getListSuccessCallback = function (data, status, headers, config) {
            //alert('getListSuccessCallback');
            $scope.testList = data;
        };

        var getConfigSuccessCallback = function (data, status, headers, config) {
            //alert('getConfigSuccessCallback');

            $scope.configList = data;
        };

        var getTestResultSuccessCallback = function (data, status, headers, config) {
            //alert(data);
            tests = data['tests'];
            testIds = []

            for (var i =0; i < tests.length; i++){
                alert(tests[i].name);
            }

            //alert(testIds);

            $scope.testResult = tests;
        };

        var errorCallback = function (data, status, headers, config) {
            //alert(data);
            notificationFactory.error(data.ExceptionMessage);
        };

        testFactory.getTests().success(getListSuccessCallback).error(errorCallback);
        configFactory.getConfig().success(getConfigSuccessCallback).error(errorCallback);

        $scope.testClick = function (id) {
            alert(id)
        };

        $scope.runTest = function () {
            return runTestFactory.getTestResult().success(getTestResultSuccessCallback).error(errorCallback);
        };
    });




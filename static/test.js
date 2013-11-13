
    var app = angular.module('app', []);

    app.factory('testFactory', function ($http) {
        return {
            getTests: function (treeType) {
                //alert("getTests");
                return $http.get("/list", {params: { "treeType": treeType}});
            }
        };
    });

    app.factory('configFactory', function ($http) {
        return {
            getConfig: function () {
               // alert('getConfig');
                return $http.get("/config");
            }
        };
    });

    app.factory('runTestFactory', function ($http) {
        return {
            getTestResult: function (testname) {
                targetFile = $('#targetIdp').val();
                return $http.get("/run_test", {params: { "testname": testname, "targetFile": targetFile}});
            }
        };
    });

    app.factory('notificationFactory', function () {

        return {
            success: function () {
                //alert('success');
                //toastr.success("Success");
            },
            error: function (text) {
                //alert(text);
                //toastr.error(text, "Error!");
            }
        };
    });


    app.controller('IndexCtrl', function ($scope, testFactory, notificationFactory, configFactory, runTestFactory) {
        //alert('controller')
        $scope.configList = [];
        $scope.testResult = "Empty";
        $scope.tree = "Nothing";

        $scope.items = [
            { type: 'Top down' },
            { type: 'Bottom up' }
        ];

        $scope.selectedItem = $scope.items[0];

        var getListSuccessCallback = function (data, status, headers, config) {
            //alert('getListSuccessCallback');
            $scope.tree = data;
        };

        var getConfigSuccessCallback = function (data, status, headers, config) {
            //alert('getConfigSuccessCallback');

            $scope.configList = data;
        };

        var getTestResultSuccessCallback = function (data, status, headers, config) {
            //alert(data);
            var tests = data['tests'];

            $scope.testResult = tests;
        };

        var errorCallback = function (data, status, headers, config) {
            //alert(data);
            notificationFactory.error(data.ExceptionMessage);
        };

        testFactory.getTests($scope.selectedItem.type).success(getListSuccessCallback).error(errorCallback);
        configFactory.getConfig().success(getConfigSuccessCallback).error(errorCallback);

        $scope.runTest = function (testname) {
            //alert(testname);
            return runTestFactory.getTestResult(testname).success(getTestResultSuccessCallback).error(errorCallback);
        };

        $scope.updateTree = function () {
            testFactory.getTests($scope.selectedItem.type).success(getListSuccessCallback).error(errorCallback);
        }

    });




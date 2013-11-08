
    var app = angular.module('app', []);

    app.factory('testFactory', function ($http) {
        return {
            getTests: function () {
                //alert('getTests');
                return $http.get("/list");
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
                return $http.get("/run_test", {params: { "testname": testname }});
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
            var tests = data['tests'];
            var testIds = [];

            /*
            var test1 =new Object();
            test1.name = "Daniel";
            test1.status = "1";

            var test2 =new Object();
            test2.name = "Bert";
            test2.status = "1";

            var test3 =new Object();
            test3.name = "Bert";
            test3.status = "2";

            var testList = [test1, test2, test3];
            */

            //'[{"status": "1" , "name":"namn1"},{"status": "1" , "name":"namn2"},{"status": "2" , "name":"namn3"}]'

            for (var i = 0; i < tests.length; i++){
                testIds.push(tests[i].name);
            }

            $scope.testResult = [{"status":1, "name":"namn1"},{"status":1, "name":"namn2"},{"status":2, "name":"namn3"}];
        };

        var errorCallback = function (data, status, headers, config) {
            //alert(data);
            notificationFactory.error(data.ExceptionMessage);
        };

        testFactory.getTests().success(getListSuccessCallback).error(errorCallback);
        configFactory.getConfig().success(getConfigSuccessCallback).error(errorCallback);

        $scope.testClick = function (id) {
            //alert(id)
        };

        $scope.runTest = function (testname) {
            return runTestFactory.getTestResult(testname).success(getTestResultSuccessCallback).error(errorCallback);
        };
    });




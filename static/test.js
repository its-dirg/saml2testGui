
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


    app.controller('IndexCtrl', function ($scope, testFactory, notificationFactory, configFactory) {
        //alert('controller')
        $scope.list = [];

        var getListSuccessCallback = function (data, status, headers, config) {
            alert('getListSuccessCallback');
            $scope.list = data;
        };

        var getConfigSuccessCallback = function (data, status, headers, config) {
            //alert('getConfigSuccessCallback');

            alert(data[0].Name);

            /*
            var newdiv = document.createElement("SELECT");
            var opt = document.createElement("OPTION");
            opt.appendChild(document.createTextNode("test1"));
            newdiv.appendChild(opt);
            document.body.appendChild(newdiv);
            */

            $scope.list = data;
        };

        var errorCallback = function (data, status, headers, config) {
            alert(data);
            notificationFactory.error(data.ExceptionMessage);
        };

        //testFactory.getTests();

        //testFactory.getTests().success(getListSuccessCallback).error(errorCallback);

        $scope.getList = function () {
            return testFactory.getTests().success(getListSuccessCallback).error(errorCallback);
        };

        $scope.getConfigFileList = function () {
            return configFactory.getConfig().success(getConfigSuccessCallback).error(errorCallback);
        };
    });




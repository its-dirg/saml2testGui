
var app = angular.module('main', ['toaster'])

app.factory('basicConfigFactory', function ($http) {
    return {
        getBasicConfig: function () {
            return $http.get("/basic_config");
        }
    };
});

app.factory('interationConfigFactory', function ($http) {
    return {
        getInterationConfig: function () {
            return $http.get("/interaction_config");
        }
    };
});

app.controller('IndexCtrl', function ($scope, basicConfigFactory, interationConfigFactory, toaster) {

    $scope.basicConfig;
    $scope.interactionConfigList;

    var getBasicConfigSuccessCallback = function (data, status, headers, config) {
        $scope.basicConfig = data;
    };

    var getInteractionConfigSuccessCallback = function (data, status, headers, config) {
        $scope.interactionConfigList = data;
    };

    var errorCallback = function (data, status, headers, config) {
        notificationFactory.error(data.ExceptionMessage);
    };

    basicConfigFactory.getBasicConfig().success(getBasicConfigSuccessCallback).error(errorCallback);
    interationConfigFactory.getInterationConfig().success(getInteractionConfigSuccessCallback).error(errorCallback);

    $scope.test = function () {
        alert("test");
    };

    $scope.addInteraction = function () {
        /*
        entry = [{"label": "url", "value": ""},
            {"label": "Title", "value": ""},
            {"label": "page-type", "value": ""},
            {"label": "type", "value": ""},
            {"label": "index", "value": ""},
            { "label": "set", "value": ""}
        ];
        $scope.interactionConfigList.push(entry);
        */
    };

});




var app = angular.module('main', ['toaster'])

app.factory('basicConfigFactory', function ($http) {
    return {
        getBasicConfig: function () {
            return $http.get("/get_basic_config");
        },
        postBasicConfig: function (basicConfig) {
            return $http.post("/post_basic_config", {"basicConfig": basicConfig});
        }
    };
});

app.factory('interactionConfigFactory', function ($http) {
    return {
        getInteractionConfig: function () {
            return $http.get("/interaction_config");
        }
    };
});

app.controller('IndexCtrl', function ($scope, basicConfigFactory, interactionConfigFactory, toaster) {

    $scope.basicConfig;
    $scope.interactionConfigList;

    var getBasicConfigSuccessCallback = function (data, status, headers, config) {
        $scope.basicConfig = data;
    };

    var postBasicConfigSuccessCallback = function (data, status, headers, config) {
        alert("postBasicConfigSuccessCallback");
    };


    var getInteractionConfigSuccessCallback = function (data, status, headers, config) {
        $scope.interactionConfigList = data;
    };

    var errorCallback = function (data, status, headers, config) {
        notificationFactory.error(data.ExceptionMessage);
    };

    basicConfigFactory.getBasicConfig().success(getBasicConfigSuccessCallback).error(errorCallback);
    interactionConfigFactory.getInteractionConfig().success(getInteractionConfigSuccessCallback).error(errorCallback);

    $scope.test = function () {
        alert("test");
    };

    $scope.addInteraction = function () {

        nextIndex = $scope.interactionConfigList.length

        entry = {"id": nextIndex,
                 "rows": [{"label": "url", "value": ""},
                            {"label": "Title", "value": ""},
                            {"label": "page-type", "value": ""},
                            {"label": "type", "value": ""},
                            {"label": "index", "value": ""},
                            { "label": "set", "value": ""}
                         ]
                }

        $scope.interactionConfigList.push(entry);
    };

    $scope.tryToRemoveInteraction = function (index) {
        bootbox.dialog({
            message: "Du you really want to remove this interaction?",
            title: "Interaction information required",
            buttons: {
                danger: {
                    label: "No",
                    className: "btn-default"
                },
                success: {
                    label: "Yes",
                    className: "btn-primary",
                    callback: function () {
                        removeInteraction(index);
                    }
                }
            }
        });
    }

    var removeInteraction = function (index) {
        var interactionList = $scope.interactionConfigList
        var indexToRemove;

        for (var i = 0; i < interactionList.length; i++){
            if (interactionList[i].id == index){
                indexToRemove = i;
                break;
            }
        }

        $scope.interactionConfigList.splice(indexToRemove, 1);
        //Manually updating the view since it's the code is executed in a callback function
        $scope.$apply();
    }

    $scope.saveInteraction = function(){
        /*
            Extract the updated information from the input form informarion (the form show have an action, see html return by interaction)
         */
        basicConfigFactory.postBasicConfig($scope.basicConfig).success(postBasicConfigSuccessCallback).error(errorCallback);
    }

});



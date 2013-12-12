
var app = angular.module('main', ['toaster'])

app.factory('basicConfigFactory', function ($http) {
    return {
        getBasicConfig: function () {
            return $http.get("/get_basic_config");
        },
        postBasicConfig: function (metadata, entityID) {

            return $http.post("/post_basic_config", {"metadata": metadata, "entityID": entityID});
        }
    };
});

app.factory('interactionConfigFactory', function ($http) {
    return {
        getInteractionConfig: function () {
            return $http.get("/get_interaction_config");
        },
        postInteractionConfig: function (interactionConfigList) {
            return $http.post("/post_interaction_config", {"interactionConfigList": interactionConfigList});
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

    var postInteractionConfigSuccessCallback = function (data, status, headers, config) {
        alert("postInteractionConfigSuccessCallback");
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

    $scope.saveBasicConfig = function(){
        var metadata = $('#Metadata').val();
        var entityID = $('#Entity_id').val();

        basicConfigFactory.postBasicConfig(metadata, entityID).success(postBasicConfigSuccessCallback).error(errorCallback);
    }

    $scope.saveInteractionConfig = function(){
        $( ".block" ).each(function() {
            var thisBlockId = $(this).attr('id');

            var newUrl = $(this).find("#url").val();
            var newTitle = $(this).find("#Title").val();
            var newPageType = $(this).find("#page-type").val();
            var newType = $(this).find("#type").val();
            var newIndex = $(this).find("#index").val();
            var newSet = $(this).find("#set").val();

            for (var i = 0; i < $scope.interactionConfigList.length; i++){
                if ($scope.interactionConfigList[i].id == thisBlockId){

                    $scope.interactionConfigList[i].rows[0].value = newUrl;
                    $scope.interactionConfigList[i].rows[1].value = newTitle;
                    $scope.interactionConfigList[i].rows[2].value = newPageType;
                    $scope.interactionConfigList[i].rows[3].value = newType;
                    $scope.interactionConfigList[i].rows[4].value = newIndex;
                    $scope.interactionConfigList[i].rows[5].value = newSet;
                }
            }
        });

        //Update $scope.interactionConfigList with the data from the block and send this to the testHandler for insertion
        interactionConfigFactory.postInteractionConfig($scope.interactionConfigList).success(postInteractionConfigSuccessCallback).error(errorCallback);
    }


});



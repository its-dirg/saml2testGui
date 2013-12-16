
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
            return $http.post("/post_interaction_config", {"convertedInteractionList": interactionConfigList});
        }
    };
});

app.factory('uploadMetadataFactory', function ($http) {
    return {
        postMetadata: function (metadata) {
            return $http.post("/post_metadata", {"metadata": metadata});
        }
    };
});

app.factory('resetTargetJsonFactory', function ($http) {
    return {
        postResetTargetJson: function () {
            return $http.post("/temp_reset_target_json");
        }
    };
});

app.factory('targetJsonFactory', function ($http) {
    return {

        downloadTargetJson: function () {
            return $http.get("/download_target_json");
        },

        uploadTargetJson: function (targetFileContent) {
            return $http.post("/upload_target_json", {"targetFileContent": targetFileContent});
        }
    };
});

app.controller('IndexCtrl', function ($scope, basicConfigFactory, interactionConfigFactory, uploadMetadataFactory, resetTargetJsonFactory, targetJsonFactory, toaster) {

    $scope.basicConfig;
    $scope.convertedInteractionList;

    /*
    Något konstigt när man laddar upp data i sessionen och och trycker på refresh så uppdaters
    interaction om man inte sparat dessa, men det gör inte basic config?!
    */

    var getBasicConfigSuccessCallback = function (data, status, headers, config) {
        alert("asd")
        $scope.basicConfig = data;
        alert(JSON.stringify($scope.basicConfig))
    };

    var postBasicConfigSuccessCallback = function (data, status, headers, config) {
        alert("postBasicConfigSuccessCallback");
    };

    var postMetadataSuccessCallback = function (data, status, headers, config) {
        alert("postMetadataSuccessCallback");
    };

    var postResetTargetJsonSuccessCallback = function (data, status, headers, config) {
        alert("postResetTargetJsonSuccessCallback");
    };

    var downloadTargetJsonSuccessCallback = function (data, status, headers, config) {
        targetContent = JSON.stringify(data["target"])
        var a = document.createElement("a");
        a.download = "target.json";
        a.href = "data:text/plain;base64," + btoa(targetContent);
        a.click();
        e.preventDefault();
    };

    var reloadTargetJsonSuccessCallback = function (data, status, headers, config) {
        alert("reloadTargetJsonSuccessCallback");
    };

    var updateConfigFields = function(){
        alert("updateConfigFields");

        //Since no info is stored on the server in the a session it's not necessary to show this info before now
        basicConfigFactory.getBasicConfig().success(getBasicConfigSuccessCallback).error(errorCallback);
        interactionConfigFactory.getInteractionConfig().success(getInteractionConfigSuccessCallback).error(errorCallback);
        $scope.$apply();
    }

    var uploadTargetJsonSuccessCallback = function (data, status, headers, config) {
        alert("uploadTargetJsonSuccessCallback");
        updateConfigFields();
    };

    var getInteractionConfigSuccessCallback = function (data, status, headers, config) {
        $scope.convertedInteractionList = data;
        $scope.originalInteractionList = angular.copy(data);

        for (var i = 0; i < data.length; i++){
           $scope.convertedInteractionList[i]['entry']['pagetype'] = data[i]['entry']['page-type']
        }
    };

    var postInteractionConfigSuccessCallback = function (data, status, headers, config) {
        alert("postInteractionConfigSuccessCallback");
    };

    var errorCallback = function (data, status, headers, config) {
        bootbox.alert(data.ExceptionMessage);
    };

    $scope.test = function () {
        alert("test");
    };

    $scope.addInteraction = function () {

        nextIndex = $scope.convertedInteractionList.length

        entry = {"id": nextIndex,
                 "entry": {
                            "matches": {
                                "url": "",
                                "title": ""
                            },
                            "pagetype": "",
                            "control": {
                                "type": "",
                                "set": {}
                            }
                        }
                }

        $scope.convertedInteractionList.push(entry);
        $scope.originalInteractionList.push(entry);
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
        var interactionList = $scope.convertedInteractionList
        var indexToRemove;

        for (var i = 0; i < interactionList.length; i++){
            if (interactionList[i].id == index){
                indexToRemove = i;
                break;
            }
        }

        $scope.convertedInteractionList.splice(indexToRemove, 1);
        $scope.originalInteractionList.splice(indexToRemove, 1);
        //Manually updating the view since it's the code is executed in a callback function
        $scope.$apply();
    }

    $scope.saveBasicConfig = function(){
        var metadata = $('#metadata').val();
        var entityID = $('#entity_id').val();

        basicConfigFactory.postBasicConfig(metadata, entityID).success(postBasicConfigSuccessCallback).error(errorCallback);
    }

    $scope.saveInteractionConfig = function(){
        $( ".block" ).each(function() {
            var thisBlockId = $(this).attr('id');

            var newUrl = $(this).find("#url").val();
            var newTitle = $(this).find("#title").val();
            var newPageType = $(this).find("#pagetype").val();
            var newType = $(this).find("#type").val();
            var newIndex = $(this).find("#index").val();
            var newSet = $(this).find("#set").val();

            for (var i = 0; i < $scope.originalInteractionList.length; i++){
                if ($scope.originalInteractionList[i].id == thisBlockId){

                    $scope.originalInteractionList[i]['entry']['matches']['url'] = newUrl;
                    $scope.originalInteractionList[i]['entry']['matches']['title'] = newTitle;
                    $scope.originalInteractionList[i]['entry']['page-type'] = newPageType;
                    $scope.originalInteractionList[i]['entry']['control']['type'] = newType;
                    $scope.originalInteractionList[i]['entry']['control']['index'] = newIndex;
                    $scope.originalInteractionList[i]['entry']['control']['set'] = JSON.parse(newSet);
                }
            }

        });

        interactionConfigFactory.postInteractionConfig($scope.originalInteractionList).success(postInteractionConfigSuccessCallback).error(errorCallback);
    }

    $scope.uploadMetadataFile = function(){
        var file = document.getElementById("metadataFile").files[0];

        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {

                uploadMetadataFactory.postMetadata(evt.target.result).success(postMetadataSuccessCallback).error(errorCallback);
                //Has to be done since this code is executed outside of
                $scope.$apply();

                //alert(evt.target.result);
            }
            reader.onerror = function (evt) {
                alert("error reading file");
            }
        }
    }

    $scope.resetTargetJson = function(){
        resetTargetJsonFactory.postResetTargetJson().success(postResetTargetJsonSuccessCallback).error(errorCallback);
    }

    $scope.downloadTargetJson = function(){
        targetJsonFactory.downloadTargetJson().success(downloadTargetJsonSuccessCallback).error(errorCallback);
    }

    $scope.uploadTargetJson = function(){
        var file = document.getElementById("targetFile").files[0];

        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                targetJsonFactory.uploadTargetJson(evt.target.result).success(uploadTargetJsonSuccessCallback).error(errorCallback);
                //Has to be done since this code is executed outside of
                $scope.$apply();
            }
            reader.onerror = function (evt) {
                alert("error reading file");
            }
        }
    }

    $scope.reloadTargetJson = function(){
        updateConfigFields();
    }

});

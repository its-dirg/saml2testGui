
var app = angular.module('main', ['toaster'])

app.factory('basicConfigFactory', function ($http) {
    return {
        getBasicConfig: function () {
            return $http.get("/get_basic_config");
        },
        postBasicConfig: function (name_format, entityID) {
            return $http.post("/post_basic_config", {"name_format": name_format, "entityID": entityID});
        }
    };
});

app.factory('interactionConfigFactory', function ($http) {
    return {
        getInteractionConfig: function () {
            return $http.get("/get_interaction_config");
        },
        postInteractionConfig: function (interactionList) {
            return $http.post("/post_interaction_config", {"interactionList": interactionList});
        }
    };
});

app.factory('uploadMetadataFactory', function ($http) {
    return {
        postMetadataFile: function (metadataFile) {
            return $http.post("/post_metadata_file", {"metadataFile": metadataFile});
        },
        postMetadataUrl: function (metadataUrl) {
            return $http.post("/post_metadata_url", {"metadataUrl": metadataUrl});
        }
    };
});

app.factory('resetConfigFileFactory', function ($http) {
    return {
        postResetConfigFile: function () {
            return $http.post("/temp_reset_config_file");
        }
    };
});

app.factory('configFileFactory', function ($http) {
    return {

        downloadConfigFile: function () {
            return $http.get("/download_config_file");
        },

        uploadConfigFile: function (configFileContent) {
            return $http.post("/upload_config_file", {"configFileContent": configFileContent});
        },

        createNewConfigFile: function () {
            return $http.get("/create_new_config_file");
        },

        doesConfigFileExist: function () {
            return $http.get("/does_config_file_exist");
        }

    };
});

app.controller('IndexCtrl', function ($scope, basicConfigFactory, interactionConfigFactory, uploadMetadataFactory, resetConfigFileFactory, configFileFactory, toaster) {

    $scope.basicConfig;
    $scope.convertedInteractionList;

    var getBasicConfigSuccessCallback = function (data, status, headers, config) {
        $scope.basicConfig = data;
        //alert("Basic config successfully LOADED")
    };

    var postBasicConfigSuccessCallback = function (data, status, headers, config) {
        alert("Basic config successfully SAVED");
    };

    var postMetadataFileSuccessCallback = function (data, status, headers, config) {
        alert("Metadata file successfully SAVED");
    };

    var postMetadataUrlSuccessCallback = function (data, status, headers, config) {
        alert("Metadata url successfully SAVED");
    };

    var postResetConfigFileSuccessCallback = function (data, status, headers, config) {
        alert("Target json successfully RESTORED");
        updateConfigFields();
    };

    var downloadConfigFileSuccessCallback = function (data, status, headers, config) {
        configDict = JSON.stringify(data["configDict"])
        var a = document.createElement("a");
        a.download = "config.json";
        a.href = "data:text/plain;base64," + btoa(configDict);

        //Appending the element a to the body is only necessary for the download to work in firefox
        document.body.appendChild(a)
        a.click();
        document.body.removeChild(a)

        e.preventDefault();
        //alert("Target json successfully DOWNLOADED");
    };

    var reloadConfigFileSuccessCallback = function (data, status, headers, config) {
        alert("Target json successfully REFRESHED");
    };

    var updateConfigFields = function(){
        //TODO remove this
        $scope.basicConfig = {"entity_id": ""}

        //Since no info is stored on the server in the a session it's not necessary to show this info before now
        basicConfigFactory.getBasicConfig().success(getBasicConfigSuccessCallback).error(errorCallback);
        interactionConfigFactory.getInteractionConfig().success(getInteractionConfigSuccessCallback).error(errorCallback);
    }

    var uploadConfigFileSuccessCallback = function (data, status, headers, config) {
        alert("Target json successfully UPLOADED");
        updateConfigFields();
    };

    var createNewConfigFileSuccessCallback = function (data, status, headers, config) {
        //alert("New Target json successfully CREATED");
    };

    var showNoConfigAvailable = function(){
        bootbox.alert("No configurations available. Either the session may have timed out or no configuration has be created or uploaded to the server.");
    }

    var reloadDoesConfigFileExistSuccessCallback = function (data, status, headers, config) {
        var doesConfigFileExist = data['doesConfigFileExist'];

        if (doesConfigFileExist == true){
            updateConfigFields();
        }else{
            showNoConfigAvailable();
        }

    };

    var downloadDoesConfigFileExistSuccessCallback = function (data, status, headers, config) {
        var doesConfigFileExist = data['doesConfigFileExist'];

        if (doesConfigFileExist == true){
            configFileFactory.downloadConfigFile().success(downloadConfigFileSuccessCallback).error(errorCallback);
        }else{
            showNoConfigAvailable();
        }

    };

    var getInteractionConfigSuccessCallback = function (data, status, headers, config) {
        $scope.convertedInteractionList = data;
        $scope.originalInteractionList = angular.copy(data);

        for (var i = 0; i < data.length; i++){
           $scope.convertedInteractionList[i]['entry']['pagetype'] = data[i]['entry']['page-type']
        }
        //alert("interaction successfully LOADED");
    };

    var postInteractionConfigSuccessCallback = function (data, status, headers, config) {
        alert("interaction successfully SAVED");
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
        var name_format = $('#name_format').val();
        var entityID = $('#entity_id').val();

        basicConfigFactory.postBasicConfig(name_format, entityID).success(postBasicConfigSuccessCallback).error(errorCallback);
    }

    $scope.saveInteractionConfig = function(){

        $(".block").each(function() {

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

                    break;
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

                uploadMetadataFactory.postMetadataFile(evt.target.result).success(postMetadataFileSuccessCallback).error(errorCallback);
                //Has to be done since this code is executed outside of
                $scope.$apply();

                //alert(evt.target.result);
            }
            reader.onerror = function (evt) {
                alert("error reading file");
            }
        }
    }

    $scope.resetConfigFile = function(){
        resetConfigFileFactory.postResetConfigFile().success(postResetConfigFileSuccessCallback).error(errorCallback);
    }

    $scope.downloadConfigFile = function(){
        configFileFactory.doesConfigFileExist().success(downloadDoesConfigFileExistSuccessCallback).error(errorCallback);
    }

    $scope.uploadConfigFile = function(){
        var file = document.getElementById("targetFile").files[0];

        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                configFileFactory.uploadConfigFile(evt.target.result).success(uploadConfigFileSuccessCallback).error(errorCallback);
                //Has to be done since this code is executed outside of
                $scope.$apply();
            }
            reader.onerror = function (evt) {
                alert("error reading file");
            }
        }
    }

    $scope.reloadConfigFile = function(){
        configFileFactory.doesConfigFileExist().success(reloadDoesConfigFileExistSuccessCallback).error(errorCallback);
    }
    
    $scope.createNewConfigFile = function(){
        bootbox.dialog({
            message: "All your existing configurations which is not downloaded will be overwritten. Are you sure you want to create a new configuration?",
            title: "Create new file",
            buttons: {
                danger: {
                    label: "No",
                    className: "btn-default"
                },
                success: {
                    label: "Yes",
                    className: "btn-primary",
                    callback: function () {
                        configFileFactory.createNewConfigFile().success(createNewConfigFileSuccessCallback).error(errorCallback);
                        updateConfigFields();
                        $scope.$apply();
                    }
                }
            }
        });
    }

    $scope.uploadMetadataUrl = function(){
        var metadataUrl = $("#metadataUrl").val();

        uploadMetadataFactory.postMetadataUrl(metadataUrl).success(postMetadataUrlSuccessCallback).error(errorCallback);
    }
});

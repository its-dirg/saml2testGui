
var app = angular.module('main', ['toaster'])

/**
 * Handles basic related configuration requests made to the server
 */
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

/**
 * Handles interaction related configuration requests made to the server
 */
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

/**
 * Handles metadata related requests made to the server
 */
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

/**
 * Handles configuration related requests made to the server
 */
app.factory('configFileFactory', function ($http) {
    return {

        requestDownloadConfigFile: function () {
            return $http.get("/download_config_file");
        },

        uploadConfigFile: function (configFileContent) {
            return $http.post("/upload_config_file", {"configFileContent": configFileContent});
        },

        createNewConfigFileRequest: function () {
            return $http.get("/create_new_config_file");
        },

        doesConfigFileExist: function () {
            return $http.get("/does_config_file_exist");
        }

    };
});

app.controller('IndexCtrl', function ($scope, basicConfigFactory, interactionConfigFactory, uploadMetadataFactory, configFileFactory, toaster) {

    $scope.basicConfig;
    $scope.convertedInteractionList;

    /**
     * Stores the basic configuration returned from the server
     * @param data - The result returned from the server
     * @param status - The status on the response from the server
     * @param headers - The header on the response from the server
     * @param config - The configuration on the response from the server
     */
    function getBasicConfigSuccessCallback(data, status, headers, config) {
        $scope.basicConfig = data;
    };


    /**
     * Confirms that the basic configuration has successfully been stored on the server
     * @param data - The result returned from the server
     * @param status - The status on the response from the server
     * @param headers - The header on the response from the server
     * @param config - The configuration on the response from the server
     */
    function postBasicConfigSuccessCallback(data, status, headers, config) {
        alert("Basic config successfully SAVED");
    };


    /**
     * Confirms that the uploaded metadata file has successfully been stored on the server
     * @param data - The result returned from the server
     * @param status - The status on the response from the server
     * @param headers - The header on the response from the server
     * @param config - The configuration on the response from the server
     */
    function postMetadataFileSuccessCallback(data, status, headers, config) {
        alert("Metadata file successfully SAVED");
    };


    /**
     * Confirms that the metadata extracted from the url has successfully been stored on the server
     * @param data - The result returned from the server
     * @param status - The status on the response from the server
     * @param headers - The header on the response from the server
     * @param config - The configuration on the response from the server
     */
    function postMetadataUrlSuccessCallback(data, status, headers, config) {
        alert("Metadata url successfully SAVED");
    };


    /**
     * Confirms that the config file has successfully been downloaded from the server
     * @param data - The result returned from the server
     * @param status - The status on the response from the server
     * @param headers - The header on the response from the server
     * @param config - The configuration on the response from the server
     */
    function downloadConfigFileSuccessCallback(data, status, headers, config) {
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

    /**
     * Requests the latest config file from the server
     */
    function requestLatestConfigFileFromServer(){
        basicConfigFactory.getBasicConfig().success(getBasicConfigSuccessCallback).error(errorCallback);
        interactionConfigFactory.getInteractionConfig().success(getInteractionConfigSuccessCallback).error(errorCallback);
    }

    /**
     * Confirms that the config file has successfully been uploaded to the server
     * @param data - The result returned from the server
     * @param status - The status on the response from the server
     * @param headers - The header on the response from the server
     * @param config - The configuration on the response from the server
     */
    function uploadConfigFileSuccessCallback(data, status, headers, config) {
        alert("Target json successfully UPLOADED");
        $("#modalWindowUploadConfigurationFile").modal('toggle');
        requestLatestConfigFileFromServer();
    };


    /**
     * Confirms that a new config file has successfully been created on the server
     * @param data - The result returned from the server
     * @param status - The status on the response from the server
     * @param headers - The header on the response from the server
     * @param config - The configuration on the response from the server
     */
    function createNewConfigFileSuccessCallback(data, status, headers, config) {
        requestLatestConfigFileFromServer();
    };

    /**
     * Show a "No configuration is available" error dialog
     */
    function showNoConfigAvailable(){
        bootbox.alert("No configurations available. Either the session may have timed out or no configuration has be created or uploaded to the server.");
    }

    /**
     * Confirms that a there exists a configuration file on the server
     * @param data - The result returned from the server
     * @param status - The status on the response from the server
     * @param headers - The header on the response from the server
     * @param config - The configuration on the response from the server
     */
    function reloadDoesConfigFileExistSuccessCallback(data, status, headers, config) {
        var doesConfigFileExist = data['doesConfigFileExist'];

        if (doesConfigFileExist == true){
            requestLatestConfigFileFromServer();
        }
    };


    /**
     * Confirms that a there exists a configuration file on the server. If configuration file exist then it's downloaded
     * @param data - The result returned from the server
     * @param status - The status on the response from the server
     * @param headers - The header on the response from the server
     * @param config - The configuration on the response from the server
     */
    function downloadDoesConfigFileExistSuccessCallback(data, status, headers, config) {
        var doesConfigFileExist = data['doesConfigFileExist'];

        if (doesConfigFileExist == true){
            configFileFactory.requestDownloadConfigFile().success(downloadConfigFileSuccessCallback).error(errorCallback);
        }else{
            showNoConfigAvailable();
        }

    };


    /**
     * Confirms that the interaction blocks successfully has been returned from the server
     * @param data - The result returned from the server
     * @param status - The status on the response from the server
     * @param headers - The header on the response from the server
     * @param config - The configuration on the response from the server
     */
    function getInteractionConfigSuccessCallback(data, status, headers, config) {
        $scope.convertedInteractionList = data;
        $scope.originalInteractionList = angular.copy(data);

        for (var i = 0; i < data.length; i++){
           $scope.convertedInteractionList[i]['entry']['pagetype'] = data[i]['entry']['page-type']
        }
    };


    /**
     * Confirms that the interaction blocks successfully has been uploaded to the server
     * @param data - The result returned from the server
     * @param status - The status on the response from the server
     * @param headers - The header on the response from the server
     * @param config - The configuration on the response from the server
     */
    function postInteractionConfigSuccessCallback(data, status, headers, config) {
        alert("interaction successfully SAVED");
    };


    /**
     * Shows error message dialog
     * @param data - The result returned from the server
     * @param status - The status on the response from the server
     * @param headers - The header on the response from the server
     * @param config - The configuration on the response from the server
     */
    function errorCallback(data, status, headers, config) {
        bootbox.alert(data.ExceptionMessage);
    };


    /**
     * Removes the interaction block
     * @param interactionBlockId - The id of interaction block
     */
    function removeInteractionBlock(interactionBlockId) {
        var interactionList = $scope.convertedInteractionList
        var indexToRemove;

        for (var i = 0; i < interactionList.length; i++){
            if (interactionList[i].id == interactionBlockId){
                indexToRemove = i;
                break;
            }
        }

        $scope.convertedInteractionList.splice(indexToRemove, 1);
        $scope.originalInteractionList.splice(indexToRemove, 1);
        //Manually updating the view since it's the code is executed in a callback function
        $scope.$apply();
    }

    /**
     * Requests to save the configuration on the server
     */
    function requestSaveBasicConfig(){
        var name_format = $('#name_format').val();
        var entityID = $('#entity_id').val();

        basicConfigFactory.postBasicConfig(name_format, entityID).success(postBasicConfigSuccessCallback).error(errorCallback);
    }

    /**
     * Request to save the interaction blocks on the server
     */
    function requestToSaveInteractionConfig(){

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

    /**
     * TODO remvoe only used in test purposes
     */
    $scope.test = function () {
        alert("test");
    };

    /**
     * Adding a new interaction block
     */
    $scope.addInteractionBlock = function () {

        nextIndex = $scope.convertedInteractionList.length

        var newInteractionBlock = {"id": nextIndex,
                 "entry": {
                            "matches": {
                                "url": "",
                                "title": "Empty"
                            },
                            "pagetype": "",
                            "control": {
                                "index": "0",
                                "type": "",
                                "set": {}
                            }
                        }
                }

        $scope.convertedInteractionList.push(newInteractionBlock);
        $scope.originalInteractionList.push(newInteractionBlock);
    };

    /**
     * Creates a "confirm that you want to remove this interaction block" dialog
     * @param interactionBlockId - The id of interaction block
     */
    $scope.createConfirmRemoveInteractionBlockDialog = function (index) {
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
                        removeInteractionBlock(index);
                    }
                }
            }
        });
    }

    /**
     * Request to save configuration to the server
     */
    $scope.requestToSaveConfig = function(){
        requestSaveBasicConfig();
        requestToSaveInteractionConfig();
    }

    /**
     * Uploads metadata to server by using post request
     */
    $scope.uploadMetadataFile = function(){
        var file = document.getElementById("metadataFile").files[0];

        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {

                uploadMetadataFactory.postMetadataFile(evt.target.result).success(postMetadataFileSuccessCallback).error(errorCallback);
                //Has to be done since this code is executed outside of
                $scope.$apply();
            }
            reader.onerror = function (evt) {
                alert("error reading file");
            }
        }
    }

    /**
     * Send a download config request to the server
     */
    $scope.requestDownloadConfigFile = function(){
        configFileFactory.doesConfigFileExist().success(downloadDoesConfigFileExistSuccessCallback).error(errorCallback);
    }

    /**
     * Upload config file to the server
     */
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

    configFileFactory.doesConfigFileExist().success(reloadDoesConfigFileExistSuccessCallback).error(errorCallback);


    /**
     *  Shows new configuration dialog
     */
    $scope.showCreateNewConfigDialog = function(){
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
                        configFileFactory.createNewConfigFileRequest().success(createNewConfigFileSuccessCallback).error(errorCallback);
                        $scope.$apply();
                    }
                }
            }
        });
    }

    /**
     * Request upload metadata from url
     */
    $scope.requestUploadMetadataUrl = function(){
        var metadataUrl = $("#metadataUrl").val();
        uploadMetadataFactory.postMetadataUrl(metadataUrl).success(postMetadataUrlSuccessCallback).error(errorCallback);
    }

    /**
     * Shows the upload configuration file dialog
     */
    $scope.showModalUploadConfigWindow = function(){
        $("#modalWindowUploadConfigurationFile").modal('toggle');
    }
});

//Loads the menu from a given template file and inserts it it to the <div menu> tag
app.directive('menu', function($http) {
    return {
        restrict: 'A',
        templateUrl: '/static/templateMenu.html',
        link: function(scope, element, attrs) {
        }
    }
});
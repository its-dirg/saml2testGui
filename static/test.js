
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
        $scope.testResult = "";
        $scope.tree = "Nothing";
        var testIsOpen = [];

        $scope.items = [
            { type: 'Top down' },
            { type: 'Bottom up' }
        ];

        $scope.selectedItem = $scope.items[0];

        var getListSuccessCallback = function (data, status, headers, config) {
            //alert('getListSuccessCallback');
            $scope.tree = buildTree(data);
        };

        var getConfigSuccessCallback = function (data, status, headers, config) {
            //alert('getConfigSuccessCallback');

            $scope.configList = data;
        };

        var getTestResultSuccessCallback = function (data, status, headers, config) {
            /*
            alert(data['errorlog']);
            alert(data['result']['status']);
            alert(data['result']['id']);
            var tests = data['result']['tests'];
            */

            var testID = data['result']['id'];

            showTextArea(testID);
            enterTestResult(data);

            showResultStatus(data);

            $scope.testResult = data;
        };

        var errorCallback = function (data, status, headers, config) {
            //alert(data);
            notificationFactory.error(data.ExceptionMessage);
        };

        var enterTestResult = function(data){
            testID = data['result']['id'];

            var testElement = document.getElementById(testID);
            var child = testElement.children[3];

            var numberOfResults = data['result']['tests'].length;
            var resultString = "";

            for (var i= 0; i < numberOfResults; i++){
                resultName =  data['result']['tests'][i].name;
                resultStatus = data['result']['tests'][i].status;

                resultString = resultString + resultStatus + " : " + resultName + "\n";
            }

            var txtNode = document.createTextNode(resultString);
            child.appendChild(txtNode);
        }

        var showResultStatus = function(data){

            var testID = data['result']['id'];
            var testElement = document.getElementById(testID);
            var child = testElement.children[1];

            var txtNode = document.createTextNode(data['result']['status']);

            var text = child.firstChild;
            child.removeChild(text);
            child.appendChild(txtNode);

        }

        var buildTree = function (newTree){
            //Sort tree elements by name or test result

            var flatTree = [];

            for (var i = 0; i < newTree.length; i++) {
                var element = newTree[i];
                flatTree.push(element);
                if (element.children.length > 0){
                    flatTree = flatTree.concat(buildTree(element.children));
                }
            }
            return flatTree;
        }

        testFactory.getTests($scope.selectedItem.type).success(getListSuccessCallback).error(errorCallback);
        configFactory.getConfig().success(getConfigSuccessCallback).error(errorCallback);

        $scope.runTest = function (testID) {
            //alert(testID);
            return runTestFactory.getTestResult(testID).success(getTestResultSuccessCallback).error(errorCallback);
        };

        $scope.updateTree = function () {
            testFactory.getTests($scope.selectedItem.type).success(getListSuccessCallback).error(errorCallback);
        }

        $scope.handleTextArea = function (testID) {
            var hasShownTextArea = showTextArea(testID);

            if (!hasShownTextArea){
                //Test is opened
                var index = testIsOpen.indexOf(testID);
                testIsOpen.splice(index, 1);

                var testElement = document.getElementById(testID);
                var child = testElement.children[3];
                testElement.removeChild(child);
            }
        }

        var showTextArea = function(testID){
            var value = $.inArray(testID, testIsOpen);

            if (value == -1){
                //Test is closed
                testIsOpen.push(testID);

                var testElement = document.getElementById(testID);
                var textArea = document.createElement("TEXTAREA");
                textArea.setAttribute("cols","120");
                textArea.setAttribute("rows","5");
                testElement.appendChild(textArea);

                return true;
            }
            return false
        }

    });



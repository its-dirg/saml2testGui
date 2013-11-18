
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
        getTestResult: function (testname, testid) {

            targetFile = $('#targetIdp').val();
            return $http.get("/run_test", {params: { "testname": testname, "targetFile": targetFile, "testid": testid}});
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
    $scope.tree = "None";
    $scope.originalTree;
    var testIsOpen = [];

    $scope.items = [
        { type: 'Top down' },
        { type: 'Bottom up' },
        { type: 'Bottom up flat'}
    ];

    $scope.selectedItem = $scope.items[1];

    var getListSuccessCallback = function (data, status, headers, config) {
        //alert('getListSuccessCallback');
        treeType = data["treeType"]

        $scope.originalTree = data["tree"];

        if (treeType == "Bottom up flat"){
            $scope.tree = buildTreeFlatBottomUp(data["tree"]);
        }else if(treeType == "Bottom up"){
            $scope.tree = buildTree(data["tree"]);
        }else if(treeType == "Top down"){
            $scope.tree = buildTree(data["tree"]);
        }
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
        testid = data['testid'];

        for (var i = 0; i < $scope.tree.length; i++){
            if ($scope.tree[i].testid == testid){
                $scope.tree[i].result = data['result'];
            }
        }

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

    var buildTreeFlatBottomUp = function (newTree){
        //Sort tree elements by name or test result

        var flatTree = [];

        for (var i = 0; i < newTree.length; i++) {
            var element = newTree[i];

            if (element.level == 1){
                flatTree.push(element);
                if (element.children.length > 0){
                    flatTree = flatTree.concat(buildTreeFlatBottomUp(element.children));
                }
            }else{
                element.level=2;

                if (element.children.length > 0){
                    flatTree = flatTree.concat(buildTreeFlatBottomUp(element.children));
                }
                flatTree.push(element);
            }

        }
        return flatTree;
    }

    testFactory.getTests($scope.selectedItem.type).success(getListSuccessCallback).error(errorCallback);
    configFactory.getConfig().success(getConfigSuccessCallback).error(errorCallback);

    $scope.runTest = function (testID, testid) {
        return runTestFactory.getTestResult(testID, testid).success(getTestResultSuccessCallback).error(errorCallback);
    };

    $scope.updateTree = function () {
        testFactory.getTests($scope.selectedItem.type).success(getListSuccessCallback).error(errorCallback);
    }

    $scope.removeTestResult = function (testid) {

        for (var i = 0; i < $scope.tree.length; i++){
            if ($scope.tree[i].testid == testid){
                delete $scope.tree[i].result;
            }
        }
    }

    var shouldOpen = true;

    $scope.identifyTestNode = function (testid) {

        var children = findTestInOriginalTree($scope.originalTree, testid);


        alert(children);
/*
        if(shouldOpen){
            showChildrenInTree(children, true);
            shouldOpen = false;
        }else{
            showChildrenInTree(children, false);
            shouldOpen = true;
        }
*/
        showChildrenInTree(children, true);
    }

    var findTestInOriginalTree = function (tree, targetTestID) {
        var result = null;

        for (var i = 0; i < tree.length; i++){
            numberOfChildren = tree[i].children.length

            if(numberOfChildren != 0){
                if (tree[i].testid == targetTestID){
                    result =  tree[i].children;
                    break;
                }
                else if (result == null){
                    result =  findTestInOriginalTree(tree[i].children, targetTestID);
                }
            }
        }
        return result;
    }

    var showChildrenInTree = function (children, visible) {

        for(var j= 0; j < children.length; j++){
            for (var i = 0; i < $scope.tree.length; i++){
                if (children[j].testid == $scope.tree[i].testid){
                    $scope.tree[i].visible = visible;
                }
            }
        }
    }
});



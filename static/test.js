
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
    $scope.currentFlattenedTree = "None";
    $scope.currentOriginalTree;

    $scope.topDownTree;
    $scope.bottomUpTree;
    $scope.flatBottomUpTree;

    var testIsOpen = [];



    $scope.items = [
        { type: 'Top down' },
        { type: 'Bottom up' },
        { type: 'Bottom up flat'}
    ];

    $scope.selectedItem = $scope.items[1];

    var getListSuccessCallback = function (data, status, headers, config) {
        //alert('getListSuccessCallback');
        $scope.topDownTree = data["topDownTree"];
        $scope.bottomUpTree = data["bottomUpTree"];
        $scope.flatBottomUpTree = data["flatBottomUpTree"];

        changeCurrentTree($scope.selectedItem.type);
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

        var id = data['result']['id'];
        testid = data['testid'];

        for (var i = 0; i < $scope.currentFlattenedTree.length; i++){
            if ($scope.currentFlattenedTree[i].testid == testid){
                $scope.currentFlattenedTree[i].result = data['result'];
            }
        }
        $scope.testResult = data;

    };

    var errorCallback = function (data, status, headers, config) {
        //alert(data);
        notificationFactory.error(data.ExceptionMessage);
    };

    var buildTree = function (newTree){
        //Sort currentFlattenedTree elements by name or test result

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

    testFactory.getTests($scope.items[1].type).success(getListSuccessCallback).error(errorCallback);
    configFactory.getConfig().success(getConfigSuccessCallback).error(errorCallback);

    $scope.runTest = function (id, testid) {
        findTestInTree($scope.bottomUpTree)
        runTestFactory.getTestResult(id, testid).success(getTestResultSuccessCallback).error(errorCallback);
    };

    $scope.updateTree = function () {
        changeCurrentTree($scope.selectedItem.type);
    }

    var changeCurrentTree = function (treeType) {
        if (treeType == "Bottom up flat") {
            $scope.currentOriginalTree = $scope.flatBottomUpTree;
            $scope.currentFlattenedTree = buildTreeFlatBottomUp($scope.flatBottomUpTree);
        } else if (treeType == "Bottom up") {
            $scope.currentOriginalTree = $scope.bottomUpTree;
            $scope.currentFlattenedTree = buildTree($scope.bottomUpTree);
        } else if (treeType == "Top down") {
            $scope.currentOriginalTree = $scope.topDownTree;
            $scope.currentFlattenedTree = buildTree($scope.topDownTree);
        }
    }

    $scope.removeTestResult = function (testid) {

        for (var i = 0; i < $scope.currentFlattenedTree.length; i++){
            if ($scope.currentFlattenedTree[i].testid == testid){
                delete $scope.currentFlattenedTree[i].result;
            }
        }
    }

    var shouldOpen = true;

    $scope.identifyTestNode = function (testid) {

        var children = findTestInTree($scope.currentOriginalTree, testid);

        if(shouldOpen){
            showChildrenInTree(children, true);
            shouldOpen = false;
        }else{
            showChildrenInTree(children, false);
            shouldOpen = true;
        }

    }

    var findTestInTree = function (tree, targetID) {
        var result = null;

        for (var i = 0; i < tree.length; i++){
            numberOfChildren = tree[i].children.length

            if(numberOfChildren != 0){
                if (tree[i].testid == targetID){
                    result =  tree[i].children;
                    break;
                }
                else if (result == null){
                    result =  findTestInTree(tree[i].children, targetID);
                }
            }
        }
        return result;
    }

    var showChildrenInTree = function (children, visible) {

        for(var j= 0; j < children.length; j++){
            for (var i = 0; i < $scope.currentFlattenedTree.length; i++){
                if (children[j].testid == $scope.currentFlattenedTree[i].testid){
                    $scope.currentFlattenedTree[i].visible = visible;
                }
            }
        }
    }
});



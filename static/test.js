
var app = angular.module('main', ['toaster'])

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


app.controller('IndexCtrl', function ($scope, testFactory, notificationFactory, configFactory, runTestFactory, toaster) {
    //alert('controller')
    $scope.configList = [];
    $scope.testResult = "";
    $scope.currentFlattenedTree = "None";
    $scope.currentOriginalTree;

    $scope.topDownTree;
    $scope.bottomUpTree;
    $scope.flatBottomUpTree;

    $scope.numberOfTestsStarted = 0;

    $scope.resultSummary = {'success': 0, 'failed': 0};

    var testIsOpen = [];
    var shouldOpen = true;

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

        i = writeResultToTree(data);

        $scope.numberOfTestsStarted--;
        if ($scope.numberOfTestsStarted <= 0){
            $('button').prop('disabled', false);
            var resultString = "Successful tests: " + $scope.resultSummary.success +"\n"+ " Failed tests: " + $scope.resultSummary.failed
            toaster.pop('note', "Result summary", resultString);
        }
    };

    var errorCallback = function (data, status, headers, config) {
        //alert(data);
        notificationFactory.error(data.ExceptionMessage);
    };

    testFactory.getTests($scope.selectedItem.type).success(getListSuccessCallback).error(errorCallback);
    configFactory.getConfig().success(getConfigSuccessCallback).error(errorCallback);

    $scope.runMultipleTest = function (id, testid) {

        var test = findTestInTreeByTestid($scope.bottomUpTree, testid);

        /*  If the current tree layout is a topdown tree the tree has to be converted since the "top
            down" and "bottom up" doesn't contain the same testID numbers */
        if (test == null){
            convertedTestsToRun = convertFromBottomUpToTopDownNodes(id);

            for (var i = 0; i < convertedTestsToRun.length; i++){
                runTestFactory.getTestResult(convertedTestsToRun[i].id, convertedTestsToRun[i].testid).success(getTestResultSuccessCallback).error(errorCallback);
            }
        }else{
            var testsToRun = getTestAndSubTests(test);
            $scope.resetNodes(testsToRun);

            //Uses runOneTest in order to gather all result summay code in one place
            for (var i = 0; i < testsToRun.length; i++){
                $scope.runOneTest(testsToRun[i].id, testsToRun[i].testid), false;
            }
        }

        $scope.numberOfTestsStarted = testsToRun.length;
    };

    $scope.runOneTest = function (id, testid, isRunningSingelTest) {
        //Reset test summary or else the result of multiply runs for the same test will be presented
        $scope.resultSummary = {'success': 0, 'failed': 0};
        $('button').prop('disabled', true);

        runTestFactory.getTestResult(id, testid).success(getTestResultSuccessCallback).error(errorCallback);

        if (isRunningSingelTest){
            $scope.numberOfTestsStarted = 1;
        }

    };

    $scope.runAllTest = function () {
        var treeSize = $scope.currentFlattenedTree.length;
        $scope.resetAll();

        for (var i = 0; i < treeSize; i++){

            var id = $scope.currentFlattenedTree[i].id;
            var testid = $scope.currentFlattenedTree[i].testid;

            $scope.runOneTest(id, testid, false);
        }

        $scope.numberOfTestsStarted = treeSize;
    };

    $scope.updateTree = function () {
        changeCurrentTree($scope.selectedItem.type);
    }

    $scope.removeTestResult = function (testid) {
        for (var i = 0; i < $scope.currentFlattenedTree.length; i++){
            if ($scope.currentFlattenedTree[i].testid == testid){
                delete $scope.currentFlattenedTree[i].result;
            }
        }
    }

    $scope.showOrHideTests = function (testid) {

        var test = findTestInTreeByTestid($scope.currentOriginalTree, testid);
        var children = test.children;

        if(children[0].visible == false){
            showChildrenInTree(children, true);
        }else if (children[0].visible == true){
            children = getTestAndSubTests(test);
            showChildrenInTree(children, false);
            test.visible = true;
        }
    }

    $scope.showOrHideResult = function (testid) {
        test = findTestInTreeByTestid($scope.currentFlattenedTree, testid);

        if (test.showResult == true){
            test.showResult = false;
        }else{
            test.showResult = true;
        }
    }

    $scope.exportTestResultToExcel = function (testid) {
        var a = document.createElement('a');
        var data_type = 'data:application/vnd.ms-excel';

        var tbl = generateExportResultTable();
        var table_html = tbl.outerHTML.replace(/ /g, '%20');

        a.href = data_type + ', ' + table_html;
        a.download = 'exported_table' + '.xls';
        a.click();
        e.preventDefault();
    }

    $scope.exportTestResultToTextFile = function (testid) {

        var resultString  = generateExportResultString();
        var a = document.createElement("a");

        a.download = "export.txt";
        a.href = "data:text/plain;base64," + btoa(resultString);
        a.click();
        e.preventDefault();
    }

    $scope.resetAll = function () {
        var tree = $scope.currentFlattenedTree;

        for (var i = 0; i < tree.length; i++){
            tree[i].result = null;
            tree[i].status = null;
        }
    }

    $scope.resetNodes = function (nodes) {
        for (var i = 0; i < nodes.length; i++){
            nodes[i].result = null;
            nodes[i].status = null;
        }
    }

    $scope.instructionVisible = false;

    $scope.toggleInstructionVisibility = function () {
        if ($scope.instructionVisible == true){
            $scope.instructionVisible = false;
        }else{
            $scope.instructionVisible = true;
        }
    }

    var writeResultToTree = function(data) {
        testid = data['testid'];
        var testResultList = [];
        var resultString;

        for (var i = 0; i < $scope.currentFlattenedTree.length; i++) {
            if ($scope.currentFlattenedTree[i].testid == testid) {
                testList = data['result']['tests'];

                for (var j = 0; j < testList.length; j++) {
                    testResultList.push(testList[j]);
                    testList[j]['status'] = convertStatusToText(testList[j]['status']);
                }

                $scope.currentFlattenedTree[i].result = testResultList;

                $scope.currentFlattenedTree[i].status = convertStatusToText(data['result']['status']);
                countSuccessAndFails(data['result']['status']);

                return i;
            }
        }
    }

    var generateExportResultString = function(){
        var tree = $scope.currentFlattenedTree;
        var resultString = "";

        for(var i = 0; i < tree.length; i++){

            if (tree[i].result != null){
                resultString += JSON.stringify(tree[i].id) + "\n";
                resultString += JSON.stringify(tree[i].result) + "\n";
            }
        }
        return resultString;
    }

    var convertFromBottomUpToTopDownNodes = function (id){
        var test = findTestInTreeByID($scope.bottomUpTree, id);
        var testsToRun = getTestAndSubTests(test);
        var convertedTestsToRun = [];

        for (var j = 0; j < testsToRun.length; j++){
            convertedTest = findTestInTreeByID($scope.topDownTree, testsToRun[j].id);
            convertedTestsToRun.push(convertedTest);
        }
        return convertedTestsToRun;
    }

    var getTestAndSubTests = function (test){
        var children = test.children;
        var subChildrenList = [];
        subChildrenList.push(test);

        for (var i = 0; i < children.length; i++){
            subChildrenList = subChildrenList.concat(getTestAndSubTests(children[i]));
        }
        return subChildrenList;
    }

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

    var changeCurrentTree = function (treeType) {
        if (treeType == "Bottom up flat") {
            $scope.currentOriginalTree = $scope.flatBottomUpTree;
            $scope.currentFlattenedTree = buildTree($scope.flatBottomUpTree);
        } else if (treeType == "Bottom up") {
            $scope.currentOriginalTree = $scope.bottomUpTree;
            $scope.currentFlattenedTree = buildTree($scope.bottomUpTree);
        } else if (treeType == "Top down") {
            $scope.currentOriginalTree = $scope.topDownTree;
            $scope.currentFlattenedTree = buildTree($scope.topDownTree);
        }
    }

    var findTestInTreeByTestid = function (tree, targetTestid) {
        var result = null;

        for (var i = 0; i < tree.length; i++){
            numberOfChildren = tree[i].children.length


            if (tree[i].testid == targetTestid){
                result =  tree[i];
                break;
            }
            else if (result == null && numberOfChildren != 0){
                result =  findTestInTreeByTestid(tree[i].children, targetTestid);
            }

        }
        return result;
    }

    var findTestInTreeByID = function (tree, targetID) {
        var result = null;

        for (var i = 0; i < tree.length; i++){
            numberOfChildren = tree[i].children.length


            if (tree[i].id == targetID){
                result =  tree[i];
                break;
            }
            else if (result == null && numberOfChildren != 0){
                result =  findTestInTreeByID(tree[i].children, targetID);
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

    var generateExportResultTable = function () {
        var tbl = document.createElement("table");
        var row;
        var column1;
        var column2;
        var text1;
        var text2;

        var result;

        for (var i = 0; i < $scope.currentFlattenedTree.length; i++){
            row = document.createElement("tr");
            column1 = document.createElement("td");
            column2 = document.createElement("td");

            result = $scope.currentFlattenedTree[i].result;

            if(result != null){
                text1 = document.createTextNode($scope.currentFlattenedTree[i].id);
                text2 = document.createTextNode(JSON.stringify(result));
                column2.appendChild(text2);

                tbl.appendChild(row);
                row.appendChild(column1);
                row.appendChild(column2);
                column1.appendChild(text1);
            }

       }

        return tbl;
    }

    var convertStatusToText = function (status) {
        if (status == 0){
            return "INFORMATION";
        }else if (status == 1){
            return "OK";
        }else if (status == 2){
            return "WARNING";
        }else if (status == 3){
            return "ERROR";
        }else if (status == 4){
            return "CRITICAL";
        }else if (status == 5){
            return "INTERACTION";
        }
    };

    var countSuccessAndFails = function (status) {
        if (status == 0 || status == 1){
            $scope.resultSummary.success += 1;
            return;
        }
        $scope.resultSummary.failed += 1;
    };
});



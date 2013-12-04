
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
        },
        getAllTestResult: function (testname) {
            targetFile = $('#targetIdp').val();
            return $http.get("/run_test", {params: { "testname": testname, "targetFile": targetFile}});
        }
    };
});

app.factory('enterTargetDataFactory', function ($http) {
    return {
        enterTargetData: function (title, redirectUri, username, password) {
            return $http.post("/enter_target_data", {"title": title, "redirectUri": redirectUri, "username": username, "password": password});
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


app.controller('IndexCtrl', function ($scope, testFactory, notificationFactory, configFactory, runTestFactory, enterTargetDataFactory, toaster) {
    //alert('controller')
    $scope.configList = [];
    $scope.testResult = "";
    $scope.currentFlattenedTree = "None";
    $scope.currentOriginalTree;
    $scope.topDownTree;
    $scope.bottomUpTree;
    $scope.flatBottomUpTree;
    $scope.numberOfTestsStarted = 0;
    var addedIds = []

    $scope.resultSummary = {'success': 0, 'failed': 0};

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

        if (data['testid'] == null){
            writeResultToTreeBasedOnId(data);
        }else{
            writeResultToTreeBasedOnTestid(data);
        }

        $scope.numberOfTestsStarted--;

        if ($scope.numberOfTestsStarted <= 0){
            $('button').prop('disabled', false);

            var resultString = "Successful tests: " + $scope.resultSummary.success + "\n" + " Failed tests: " + $scope.resultSummary.failed
            toaster.pop('note', "Result summary", resultString);
            addedIds = []
        }
    };

    var getEnterTargetDataSuccessCallback = function (data, status, headers, config) {
        alert('getEnterTargetDataSuccessCallback');
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
                $scope.runOneTest(testsToRun[i].id, testsToRun[i].testid), "multipleTest";
            }
        }

        $scope.numberOfTestsStarted = testsToRun.length;
    };

    $scope.runOneTest = function (id, testid, numberOfTest) {
        //Reset test summary or else the result of multiply runs for the same test will be presented
        $scope.resultSummary = {'success': 0, 'failed': 0};
        $('button').prop('disabled', true);

        if (numberOfTest == "singleTest"){
            $scope.numberOfTestsStarted = 1;
            runTestFactory.getTestResult(id, testid).success(getTestResultSuccessCallback).error(errorCallback);

        }else if(numberOfTest == "allTest"){
            runTestFactory.getAllTestResult(id).success(getTestResultSuccessCallback).error(errorCallback);

        }else{
            runTestFactory.getTestResult(id, testid).success(getTestResultSuccessCallback).error(errorCallback);
        }

    };

    $scope.runAllTest = function () {
        var treeSize = $scope.currentFlattenedTree.length;
        var executedIdList = []
        $scope.resetAll();

        for (var i = 0; i < treeSize; i++){

            var id = $scope.currentFlattenedTree[i].id;
            var testid = $scope.currentFlattenedTree[i].testid;

            $scope.runOneTest(id, testid, "allTest");

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

    var latestExecutedTestid

    var enterResultToTree = function (data, i) {
        testList = data['result']['tests'];
        var testResultList = [];

        for (var j = 0; j < testList.length; j++) {
            testResultList.push(testList[j]);
            var statusNumber = testList[j]['status'];
            testList[j]['status'] = convertStatusToText(statusNumber);

            if (statusNumber == 5){
                latestExecutedTestid = data['testid'];

                $('#modalWindow').modal('show');
                $('#modalContent').empty();

                // Change the form action to log_in
                var loginForm = document.createElement('html');
                loginForm.innerHTML = testList[j].message;
                var formtag = loginForm.getElementsByTagName('form')[0];
                formtag.setAttribute('action', '/login');

                //Create a iframe and present the login screen inside the iframe
                var iframe = document.createElement('iframe');
                iframe.setAttribute('width', '100%');
                iframe.setAttribute('height', '750px');
                $('#modalContent').append(iframe);
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(loginForm.innerHTML);
                iframe.contentWindow.document.close();
            }
        }

        $scope.currentFlattenedTree[i].result = testResultList;

        $scope.currentFlattenedTree[i].status = convertStatusToText(data['result']['status']);
        countSuccessAndFails(data['result']['status']);
    }

    function getHtmlObject() {
        var test = findTestInTreeByTestid($scope.currentFlattenedTree, latestExecutedTestid);
        var subResults = test['result'];

        for (var i = 0; i < subResults.length; i++) {
            if (subResults[i]['status'] == "INTERACTION") {
                var htmlString = subResults[i]['message'];
                break;
            }
        }

        var htmlElement = document.createElement('html');
        htmlElement.innerHTML = htmlString;
        return htmlElement;
    }

    $scope.click = function(){
        window.postBack("roland", "dianakra");
    }

    window.postBack = function(username, password){
        alert("postBack");

        var htmlElement = getHtmlObject();

        var title = htmlElement.getElementsByTagName('title')[0].innerHTML;

        var inputElementList = htmlElement.getElementsByTagName('input');
        for (var j=0; j < inputElementList.length; j++){
            if (inputElementList[j].getAttribute('name') == 'redirect_uri'){
                var redirectUri = inputElementList[j].getAttribute('value');
                break;
            }
        }

        $('#modalWindow').modal('hide');

        alert("before enterTargetDataFactory");
        enterTargetDataFactory.enterTargetData(title, redirectUri, username, password).success(getEnterTargetDataSuccessCallback).error(errorCallback);
        alert("after enterTargetDataFactory");
    }

    var writeResultToTreeBasedOnTestid = function(data) {
        testid = data['testid'];

        for (var i = 0; i < $scope.currentFlattenedTree.length; i++) {
            if ($scope.currentFlattenedTree[i].testid == testid) {
                enterResultToTree(data, i);
            }
        }
    }

    var writeResultToTreeBasedOnId = function(data) {
        id = data['result']['id'];

        for (var i = 0; i < $scope.currentFlattenedTree.length; i++) {
            if ($scope.currentFlattenedTree[i].id == id) {
                if ($.inArray(id, addedIds) == -1){
                    enterResultToTree(data, i);
                }
            }
        }
        addedIds.push(id);
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
        var matchingTest = null;

        for (var i = 0; i < tree.length; i++){
            numberOfChildren = tree[i].children.length

            if (tree[i].testid == targetTestid){
                matchingTest =  tree[i];
                break;
            }
            else if (matchingTest == null && numberOfChildren != 0){
                matchingTest =  findTestInTreeByTestid(tree[i].children, targetTestid);
            }

        }
        return matchingTest;
    }

    var findTestInTreeByID = function (tree, targetID) {
        var matchingTest = null;

        for (var i = 0; i < tree.length; i++){
            numberOfChildren = tree[i].children.length


            if (tree[i].id == targetID){
                matchingTest =  tree[i];
                break;
            }
            else if (matchingTest == null && numberOfChildren != 0){
                matchingTest =  findTestInTreeByID(tree[i].children, targetID);
            }

        }
        return matchingTest;
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

    var countSuccessAndFails = function(status){
        if (status == 0 || status == 1){
            $scope.resultSummary.success++;
        }else{
            $scope.resultSummary.failed++;
        }
    }

});



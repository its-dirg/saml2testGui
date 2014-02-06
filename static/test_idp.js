
var app = angular.module('main', ['toaster'])

app.factory('testFactory', function ($http) {
    return {
        getTests: function (treeType) {
            return $http.get("/list_tests", {params: { "treeType": treeType}});
        }
    };
});

app.factory('runTestFactory', function ($http) {
    return {
        getTestResult: function (testname, testid) {
            return $http.get("/run_test", {params: { "testname": testname, "testid": testid}});
        },
        getAllTestResult: function (testname) {
            return $http.get("/run_test", {params: { "testname": testname}});
        }
    };
});

app.factory('postBasicInteractionDataFactory', function ($http) {
    return {
        postBasicInteractionData: function (title, redirectUri, pageType, controlType) {
            return $http.post("/post_basic_interaction_data", {"title": title, "redirectUri": redirectUri, "pageType": pageType, "controlType": controlType});
        }
    };
});

app.factory('postResetInteractionFactory', function ($http) {
    return {
        postResetInteraction: function () {
            return $http.post("/reset_interaction");
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

app.factory('errorReportFactory', function ($http) {
    return {
        postErrorReport: function (reportEmail, reportMessage, testResults) {
            return $http.post("/post_error_report", {"reportEmail": reportEmail, "reportMessage": reportMessage, "testResults": testResults});
        }
    };
});

app.controller('IndexCtrl', function ($scope, testFactory, notificationFactory, runTestFactory, postBasicInteractionDataFactory, postResetInteractionFactory, errorReportFactory, toaster) {
    $scope.testResult = "";
    $scope.currentFlattenedTree = "None";
    $scope.currentOriginalTree;
    $scope.topDownTree;
    $scope.bottomUpTree;
    $scope.flatBottomUpTree;
    $scope.numberOfTestsRunning = 0;
    var addedIds = []

    $scope.resultSummary = {'success': 0, 'failed': 0};

    $scope.items = [
        { type: 'Top down' },
        { type: 'Bottom up' },
        { type: 'Bottom up flat'}
    ];

    $scope.selectedItem = $scope.items[1];

    var getListSuccessCallback = function (data, status, headers, config) {
        $scope.topDownTree = data["topDownTree"];
        $scope.bottomUpTree = data["bottomUpTree"];
        $scope.flatBottomUpTree = data["flatBottomUpTree"];

        changeCurrentTree($scope.selectedItem.type);

        $("[data-toggle='tooltip']").tooltip();
    }

    var isRunningAllTests = false;

    var getTestResultSuccessCallback = function (data, status, headers, config) {
        if (data['testid'] == null){
            isRunningAllTests = true;
            writeResultToTreeBasedOnId(data);
        }else{
            writeResultToTreeBasedOnTestid(data);
        }

        $scope.numberOfTestsRunning--;

        if ($scope.numberOfTestsRunning <= 0){
            resetFlags();

            var resultString = "Successful tests: " + $scope.resultSummary.success + "\n" + " Failed tests: " + $scope.resultSummary.failed
            toaster.pop('note', "Result summary", resultString);
            addedIds = []
        }
    };

    var resetFlags = function(){
        $('button').prop('disabled', false);
        isRunningAllTests = false;
        hasShownInteractionConfigDialog = false;
        hasShownWrongPasswordDialog = false;
        isShowingErrorMessage = false;
    }

    var getPostBasicDataSuccessCallback = function (data, status, headers, config) {
        //TODO It this nessecerry?
    };

    var getPostResetDataSuccessCallback = function (data, status, headers, config) {
        //TODO It this nessecerry?
    };

    var getPostErrorReportSuccessCallback = function (data, status, headers, config) {
        alert("getPostErrorReportSuccessCallback");
    };

    var isShowingErrorMessage = false;

    var errorCallback = function (data, status, headers, config) {

        if (!isShowingErrorMessage){
            isShowingErrorMessage = true;

            bootbox.alert(data.ExceptionMessage, function() {
                resetFlags();
            });
        }
    };

    testFactory.getTests($scope.selectedItem.type).success(getListSuccessCallback).error(errorCallback);

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

        $scope.numberOfTestsRunning = testsToRun.length;
    };

    $scope.runOneTest = function (id, testid, numberOfTest) {
        //Reset test summary or else the result of multiply runs for the same test will be presented
        $scope.resultSummary = {'success': 0, 'failed': 0};
        $('button').prop('disabled', true);

        if (numberOfTest == "singleTest"){
            $scope.numberOfTestsRunning = 1;
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

        $scope.numberOfTestsRunning = treeSize;
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

    $scope.showOrHideResult = function (testid, testIndex) {
        test = findTestInTreeByTestid($scope.currentFlattenedTree, testid);

        if (test.showResult == true){
            test.showResult = false;
            $("#resultButton" + testIndex).html('Show result');
        }else{
            test.showResult = true;
            $("#resultButton" + testIndex).html('Hide result');
        }
    }

    $scope.showOrHideDebugLog = function (testid, testIndex) {
        test = findTestInTreeByTestid($scope.currentFlattenedTree, testid);

        if (test.showDebugLog == true){
            test.showDebugLog = false;
            $("#debugLogButton" + testIndex).html('Show debug log');
        }else{
            test.showDebugLog = true;
            $("#debugLogButton" + testIndex).html('Hide debug log');
        }
    }

    $scope.exportTestResultToExcel = function () {
        var a = document.createElement('a');
        var data_type = 'data:application/vnd.ms-excel';

        var tbl = generateExportResultTable();
        var table_html = tbl.outerHTML.replace(/ /g, '%20');

        a.href = data_type + ', ' + table_html;
        a.download = 'exported_table' + '.xls';

        //Appending the element a to the body is only necessary for the download to work in firefox
        document.body.appendChild(a)
        a.click();
        document.body.removeChild(a)

        e.preventDefault();
    }

    $scope.exportTestResultToTextFile = function () {

        var resultString  = JSON.stringify(exportResult)
        var a = document.createElement("a");

        a.download = "export.txt";
        a.href = "data:text/plain;base64," + btoa(resultString);

        //Appending the element a to the body is only necessary for the download to work in firefox
        document.body.appendChild(a)
        a.click();
        document.body.removeChild(a)

        e.preventDefault();
    }

    $scope.resetAll = function () {
        var tree = $scope.currentFlattenedTree;

        for (var i = 0; i < tree.length; i++){
            tree[i].result = null;
            tree[i].status = null;
            tree[i].debugLog = null;
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

    var latestExecutedTestid;

    var createIframeAndShowInModelWindow = function(data) {

        var subTestList = data['result']['tests'];
        var lastElement = subTestList.length -1;

        $('#modalWindowIframe').modal('show');
        $('#modalIframeContent').empty();

        //Resets the foundInteractionStatus to false if the user exit the log in window
        $('#modalWindowIframe').on('hidden.bs.modal', function (e) {
            foundInteractionStatus = false;
        });

        // Change the form action to log_in
        var loginForm = document.createElement('html');
        loginForm.innerHTML = subTestList[lastElement].message;
        var formtag = loginForm.getElementsByTagName('form')[0];
        formtag.setAttribute('action', '/post_final_interaction_data');

        //Create a iframe and present the login screen inside the iframe
        var iframe = document.createElement('iframe');
        iframe.setAttribute('width', '100%');
        iframe.setAttribute('height', '750px');

        $('#modalIframeContent').append("<h1>Information</h1><span>In order to use this application you need to log in to the IDP. The information will be stored which means that you only have to do this once  </span>");
        $('#modalIframeContent').append(iframe);

        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(loginForm.innerHTML);
        iframe.contentWindow.document.close();

    }

    var foundInteractionStatus = false;
    var hasShownInteractionConfigDialog = false;

    function createInteractionConfigDialog(data) {
        bootbox.dialog({
            message: "The server are missing some interaction configurations. Do you want the system to try insert the interaction configuration?",
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
                        createIframeAndShowInModelWindow(data);
                    }
                }
            }
        });
    }

    var handleInteraction = function (data) {
        if (foundInteractionStatus == false) {
            foundInteractionStatus = true;

            if (isRunningAllTests){
                var test = findTestInTreeByID($scope.currentFlattenedTree, data['result']['id']);
            }else{
                var test = findTestInTreeByTestid($scope.currentFlattenedTree, data['testid']);
            }

            var subResults = test['result'];

            for (var i = 0; i < subResults.length; i++) {
                if (subResults[i]['status'] == "INTERACTION") {
                    var htmlString = subResults[i]['message'];

                    var unFormatedUrl = subResults[i]['url']
                    var url= unFormatedUrl.substr(0, unFormatedUrl.indexOf('?'));

                    break;
                }
            }

            var htmlElement = document.createElement('html');
            htmlElement.innerHTML = htmlString;

            var title = htmlElement.getElementsByTagName('title')[0].innerHTML;

            //TODO I don't know how to identify the property
            var pageType = "login";

            var formTags = htmlElement.getElementsByTagName('form');
            if (formTags.length > 0){
                var controlType = "form"
            }

            postBasicInteractionDataFactory.postBasicInteractionData(title, url, pageType, controlType).success(getPostBasicDataSuccessCallback).error(errorCallback);

            if (!hasShownInteractionConfigDialog){

                hasShownInteractionConfigDialog = true;
                createInteractionConfigDialog(data);
            }
        }
    }

    var hasShownWrongPasswordDialog = false;

    function createWrongPasswordDialog() {
        bootbox.dialog({
            message: "Unknown user or wrong password. Do you want to reset interaction configurations?",
            title: "Error occured",
            buttons: {
                danger: {
                    label: "No",
                    className: "btn-default"
                },
                success: {
                    label: "Yes",
                    className: "btn-primary",
                    callback: function () {
                        postResetInteractionFactory.postResetInteraction().success(getPostResetDataSuccessCallback).error(errorCallback);
                    }
                }
            }
        });
    }

    function handleError() {
        var lastElement = subTestList.length - 1;

        var errorMessage = subTestList[lastElement].message

        if (errorMessage.indexOf("Unknown user or wrong password") != -1) {

            if (!hasShownWrongPasswordDialog) {
                hasShownWrongPasswordDialog = true;
                createWrongPasswordDialog();
                //alert("Unknown user or wrong password. Do you want to reset interaction configurations?");

            }
        }
    }

    var formatSubTests = function (subTest) {

        //if (subTest.status = )

        return subTest.status + " : " + subTest.id + " : " + subTest.name
    }


    var exportResult = []

    var enterExportData = function(id, result, debugLog){

        var resultClone = jQuery.extend(true, [], result);

        for (var i = 0; i < exportResult.length; i++){
            if (id == exportResult[i].id){
                exportResult.splice(i, 1);
            }
        }

        exportResult.push({"id": id,
                   "result": resultClone,
                   "debugLog": debugLog});

    }

    var enterResultToTree = function (data, i) {

        var subTestList = data['result']['tests'];

        for (var j = 0; j < subTestList.length; j++) {
            var statusNumber = subTestList[j].status;
            subTestList[j]['status'] = convertStatusToText(statusNumber);
        }
        $scope.currentFlattenedTree[i].result = subTestList;

        var convertedDebugLog = data['debugLog'];
        convertedDebugLog = convertedDebugLog.replace(/\n/g, '<br />');
        $scope.currentFlattenedTree[i].debugLog = [{"debugMessage" : convertedDebugLog}];

        enterExportData($scope.currentFlattenedTree[i].id, data['result']['tests'], data['debugLog']);

        $scope.currentFlattenedTree[i].status = convertStatusToText(data['result']['status']);
        countSuccessAndFails(data['result']['status']);


        statusNumber = data['result']['status'];

        if (statusNumber == 5) {
            handleInteraction(data);
        }
        else if (statusNumber == 3) {
            handleError();
        }
    }

    window.postBack = function(){
        //A bug appers when interactions without login screen
        setTimeout(function() {
            $('#modalWindowIframe').modal('hide');
            foundInteractionStatus = false;
            var infoString = "The interaction data was successfully stored on the server. Please rerun the tests, it's possible that more interaction data has to be collected and stored on the server"

            //toaster.pop('success', "Log in", infoString);
            bootbox.alert(infoString);
        }, 200);
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
        var column3;
        var text1;
        var text2;
        var text3;

        var result;

        for (var i = 0; i < exportResult.length; i++){
            row = document.createElement("tr");
            column1 = document.createElement("td");
            column2 = document.createElement("td");
            column3 = document.createElement("td");

            text1 = document.createTextNode(exportResult[i].id);
            text2 = document.createTextNode(JSON.stringify(exportResult[i].result));
            text3 = document.createTextNode(exportResult[i].debugLog);

            tbl.appendChild(row);
            row.appendChild(column1);
            row.appendChild(column2);
            row.appendChild(column3);

            column1.appendChild(text1);
            column2.appendChild(text2);
            column3.appendChild(text3);
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

    $scope.test = function () {
        alert("test");
    };

    $scope.showModalWindowsErrorReport = function () {

        $('#modalWindowErrorReport').modal('show');
        $('#reportForm')[0].reset();

    };

    $scope.sendReport = function () {
        $('#modalWindowErrorReport').modal('hide');

        //Get data from text fields and send it to the server the get the file reuse exporty txt file
        var email = $('#reportEmail').val();
        var message = $('#reportMessage').val();

        testResults = JSON.stringify(exportResult);

        errorReportFactory.postErrorReport(email, message, testResults).success(getPostErrorReportSuccessCallback).error(errorCallback);
    };

});

//Loads the menu from a given template file and inserts it it to the <div menu> tag
app.directive('menu', function($http) {
    return {
        restrict: 'A',
        templateUrl: '/static/templateMenu.html',
        link: function(scope, element, attrs) {
            scope.fetchMenu();
        }
    }
});

app.directive('directiveCallback', function(){
    return function(scope, element, attrs){
        attrs.$observe('directiveCallback',function(){
            if (attrs.directiveCallback == "true"){
                $("[data-toggle='tooltip']").tooltip();
            }
        });
    }
})



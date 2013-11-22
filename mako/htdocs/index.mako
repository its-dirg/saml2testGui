## index.html
<%inherit file="base.mako"/>


<toaster-container toaster-options="{'time-out': 6000}"></toaster-container>

<div ng-controller="IndexCtrl" >
    <div class="container">

        <div class="headline">
        Test tool for saml
        </div>

        <div id="formContainer" class="jumbotron">

            Tree layout:
            <br>
            <select ng-model="selectedItem"
                ng-options="item.type for item in items" ng-change="updateTree();">
            </select>

            <br>

            Available configurations:
            <select id="targetIdp">
                <option ng-repeat="tests in configList | orderBy:'Name':true">
                     {{tests.Name}}
                </option>
            </select>

            <br>

            <!-- The information box -->
            <div class="informationBox">
                <div class="row" id="no-hover">

                  <div class="col-xs-12 col-md-9">In the table bellow all tests are presented. Test which depend on others are makred with a little black arrow. In order to see the sub tests press the row containing an arrow. Tests could be executed at three levels, first of a single test could be executed. Then a test and it's sub tests could be executed by pressing the button "Run test". Last of all tests could be executed by pressing the button "Run all tests". The result of the tests are presented by color encoding the row containing the test and a written status. In order to get a more detailed version of the test result press the button "Show result"</div>

                    <div class="col-xs-12 col-md-3">
                        <div class="colorExampleBox" id="totalStatusINFORMATION">
                            INFORMATION
                        </div>

                        <div class="colorExampleBox" id="totalStatusOK">
                            OK
                        </div>

                        <div class="colorExampleBox" id="totalStatusWARNING">
                            WARNING
                        </div>

                        <div class="colorExampleBox" id="totalStatusINTERACTION">
                            INTERACTION
                        </div>

                        <div class="colorExampleBox" id="totalStatusERROR">
                            ERROR
                        </div>

                        <div class="colorExampleBox" id="totalStatusCRITICAL">
                            CRITICAL
                        </div>
                  </div>
                </div>
            </div>

            <br>

            <!-- The headline of the test table -->
            <div class="col-lg-7" id="testHeadline">
                Test
                <button class="btn btn-primary btn-sm" ng-click="resetAll();">Reset GUI</button>
            </div>

            <div class="col-lg-1" id="testHeadline">
                Status
            </div>

           <!-- Export button -->
            <div class="col-lg-2" id="testHeadline">
                <div class="btn-group">
                    <button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown">
                        Export
                        <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu">
                        <li ng-click="exportTestResultToTextFile();"><a>Export result to excel file</a></li>
                        <li ng-click="exportTestResultToExcel();"><a>Export result to text file</a></li>
                    </ul>
                </div>
            </div>

            <!-- Run all tests button-->
            <div class="col-lg-2" id="testHeadline">
                <button class="btn btn-primary" ng-click="runAllTest();">Run all tests</button>
            </div>

            <br>

            <!-- The code which genertaes the rows of the test table -->
            <div ng-repeat="data in currentFlattenedTree" class="row">

                <div ng-show="data.visible == true" id="testRow">

                    <!-- Tree containging all the tests -->
                    <div class="col-lg-7" id="totalStatus{{data.status}}" ng-click="showOrHideTests(data.testid);">
                        <div id="level{{data.level}}">

                            <span class="glyphicon glyphicon-info-sign" rel="tooltip" title="{{data.descr}}" id="infoIcon"></span>

                            <img src="static/pitures/arrowRight.png" ng-show="data.hasChildren == true">

                            <span ng-click="removeTestResult(data.testid);" rel="tooltip" title="{{data.descr}}">{{data.id}}</span>

                        </div>
                    </div>

                    <!-- Status of a given test -->
                    <div class="col-lg-1" id="totalStatus{{data.status}}">
                        {{data.status}}
                     </div>

                    <!-- Show or hide result button -->
                    <div class="col-lg-2" id="totalStatus{{data.status}}">
                        <div class="btn btn-default btn-xs" ng-click="showOrHideResult(data.testid);">Show result</div>
                    </div>

                    <!-- Run test buttons -->
                    <div class="col-lg-2" id="totalStatus{{data.status}}">

                        <div class="btn-group">
                            <button class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" id="runButton">
                                Run test
                                <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu">
                                <li ng-click="runMultipleTest(data.id, data.testid);"><a>Run test and sub tests</a></li>
                                <li ng-click="runOneTest(data.id, data.testid, true);"><a>Run this test only</a></li>
                            </ul>
                        </div>

                    </div>

                    <br>

                    <!-- Result frame containing the result of a executed test -->
                    <div class="resultFrame" ng-show="data.showResult == true">
                        Result:
                        <br>

                        <div ng-repeat="test in data.result">{{test}}</div>

                    </div>

                </div>

            </div>

            <div>
                Test summary for last executed test: <p>Successful tests:{{resultSummary.success}}</p> <p>Failed tests:{{resultSummary.failed}}</p>
            </div>

        </div>
    </div>
</div>


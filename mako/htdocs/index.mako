## index.html
<%inherit file="base.mako"/>

<%block name="script">
    <!-- Add more script imports here! -->
    <script src="/static/bootbox.min.js"></script>
</%block>

<%block name="css">
    <!-- Add more css imports here! -->
    <link rel="stylesheet" type="text/css" href="/static/saml2testgui.css">
</%block>

<%block name="title">
    Saml2test application
</%block>

<%block name="header">
    ${parent.header()}
</%block>

<%block name="headline">
    <div ng-controller="IndexCtrl">
</%block>


<%block name="body">

    Tree layout:
    <br>
    <select ng-model="selectedItem"
        ng-options="item.type for item in items" ng-change="updateTree();">
    </select>

    <br>

    <div ng-click="toggleInstructionVisibility();" ng-show="instructionVisible == true" id="instructions">
        <img src="static/pitures/arrowDown.png">
        Hide instructions
    </div>

    <div ng-click="toggleInstructionVisibility();" ng-show="instructionVisible == false" id="instructions">
        <img src="static/pitures/arrowRight.png">
        Show instructions
    </div>

    <!-- The information box -->
    <div class="informationBox" ng-show="instructionVisible == true">
        <div class="row" id="no-hover">

            <div class="col-xs-12 col-md-9">
                In the table bellow all tests are presented. Test which depend on others are
                makred with a little black arrow. In order to see the sub tests press the row containing an arrow.
                <br>
                Tests could be executed at three levels. First of a single test could be executed or a test and
                it's sub tests could be executed. In order to do this press the button "Run test" and then choose the appropriate alternative.
                Then last alternative is to execute all tests by pressing the button "Run all tests".
                <br>
                The result of the tests are presented by color encoding the row containing the test and a written status.
                In order to get a more detailed version of the test result press the button "Show result". The result
                of the test could be exported to either excel or a text file, by pressing the button export and choose the appropriate alternative.

            </div>

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
        <button class="btn btn-primary btn-sm" ng-click="resetAll();">Reset Tests</button>
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
                <li ng-click="exportTestResultToTextFile();"><a>Export result to text file</a></li>
                <li ng-click="exportTestResultToExcel();"><a>Export result to excel file</a></li>
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
                        <li ng-click="runOneTest(data.id, data.testid, 'singleTest');"><a>Run this test only</a></li>
                    </ul>
                </div>

            </div>

            <br>

            <!-- Result frame containing the result of a executed test -->
            <div class="resultFrame" ng-show="data.showResult == true">
                Result:
                <br>

                <!--
                <div ng-repeat="test in data.result">{{test.status}} : {{test.id}} : {{test.name}}</div>
                -->

                <div ng-repeat="test in data.result">{{test}}</div>

            </div>
        </div>
    </div>
</%block>

<%block name="footer">
    </div>

    <!-- Modal window-->
    <div class="modal fade" id="modalWindow" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content" id="modalContent">

            </div>
        </div>
    </div>

    <script type="text/javascript" src="/static/saml2test.js"></script>

    ${parent.footer()}
</%block>
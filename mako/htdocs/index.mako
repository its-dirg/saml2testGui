## index.html
<%inherit file="base.mako"/>

<div ng-controller="IndexCtrl" >
    <div class="container">
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

            <div class="col-lg-8" id="testHeadline">
                Test
            </div>

            <div class="col-lg-2" id="testHeadline">
                Status
            </div>

            <div class="col-lg-2" id="testHeadline">
                <button type="button" class="btn btn-primary btn-sm">Run all tests</button>
            </div>

            <br>

            <!--- Id på raden ska vara ett nummer istället för data.id detta eftersom att då vet man vilken rad man tryck på --->
            <div ng-repeat="data in tree" class="row">

                <div ng-show="data.visible == true">


                    <div class="col-lg-8" id="level{{data.level}}" ng-click="identifyTestNode(data.testid);">
                        <img src="static/pitures/arrowRight.png" ng-show="data.hasChildren == true">

                        <span ng-click="removeTestResult(data.testid);">{{data.id}}</span>
                    </div>

                    <div class="col-lg-2" id="status">
                        Status
                    </div>


                    <div class="col-lg-2" id="runTestButton">
                        <button type="button" class="btn btn-primary btn-sm" ng-click="runTest(data.id, data.testid);">Run test</button>
                    </div>

                    <textarea ng-show="data.result" cols="120" rows="5">{{data.result}}</textarea>


                </div>

            </div>

        </div>
    </div>

</div>


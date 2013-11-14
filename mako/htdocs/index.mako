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


            <div class="col-lg-8">
                Test
            </div>

            <div class="col-lg-2" id="status">
                <span>
                Status
                </span>
            </div>

            <div class="col-lg-2" id="runTestButton">
                <span>
                Button
                </span>
            </div>


            <!--- Start starting point for tree containing all tests --->

            <div ng-repeat="data in tree" class="row" id="{{data.id}}">

                <div class="col-lg-8" id="level{{data.level}}" ng-click="handleTextArea(data.id);">
                    {{data.id}}
                </div>

                <div class="col-lg-2" id="status">
                    Status
                </div>

                <div class="col-lg-2" id="runTestButton">
                    <button type="button" class="btn btn-primary btn-sm" ng-click="runTest(data.id);">Run test</button>
                </div>
            </div>

        </div>
    </div>

</div>


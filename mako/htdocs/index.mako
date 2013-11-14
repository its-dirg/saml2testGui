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


            <div class="col-lg-6">
                Test
            </div>

            <div class="col-lg-6" id="block">
                <span style="display: inline" id="status">
                Status
                </span>

                <span>
                Button
                </span>
            </div>

            <!--- Start starting point for tree containing all tests --->
            <div ng-repeat="data in tree" class="row" ng-include="'tree_item_renderer.html'">
            </div>

            Result:
            <div ng-show="testResult">{{testResult}}</div>


        </div>
    </div>

</div>



<!--- Script used to actually generate the tree containing the tests  --->
<script type="text/ng-template"  id="tree_item_renderer.html">


    <!--- The element in which the test info is stored --->
    <div class="col-lg-6" id="level{{data.level}}">
        {{data.id}}
    </div>

    <div class="col-lg-6" id="block">
        <span style="display: inline" id="status">
            Status
        </span>

        <button type="button" class="btn btn-primary btn-sm" ng-click="runTest(data.id);">Run test</button>
    </div>

    <div ng-repeat="data in data.children" class="row" ng-include="'tree_item_renderer.html'">
    </div>

</script>



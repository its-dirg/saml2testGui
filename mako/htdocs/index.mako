## index.html
<%inherit file="base.mako"/>

<div ng-controller="IndexCtrl" >
    <div class="container">
        <div class="row">

            <div class="jumbotron">

                <div class="col-md-12">

                    <h1> Tests </h1>

                    <!--- Start starting point for tree containing all tests --->
                    <ul>
                        <li ng-repeat="data in tree" ng-include="'tree_item_renderer.html'"></li>
                    </ul>


                    <h1>Test configurations:</h1>
                    <br>
                    <select id="targetIdp">
                        <option ng-repeat="tests in configList | orderBy:'Name':true">
                             {{tests.Name}}
                        </option>
                    </select>
                    <br>

                    <h1>Result</h1>

                    <div ng-show="testResult">{{testResult}}</div>
                </div>
          </div>
        </div>
    </div>

</div>



<!--- Script used to actually generate the tree containing the tests  --->
<script type="text/ng-template"  id="tree_item_renderer.html">
    <div ng-click="runTest(data.id);">{{data.id}}</div>
    <ul>
        <li ng-repeat="data in data.children" ng-include="'tree_item_renderer.html'"></li>
    </ul>
</script>



## index.html
<%inherit file="base.mako"/>

<div ng-controller="IndexCtrl" >

    <script type="text/ng-template"  id="tree_item_renderer.html">
        {{data.id}}
        <ul>
            <li ng-repeat="data in data.children" ng-include="'tree_item_renderer.html'" ng-click="runTest(data.id);"></li>
        </ul>
    </script>


    <h1> Tests </h1>

    <ul>
        <li ng-repeat="data in tree" ng-include="'tree_item_renderer.html'" ng-click="runTest(data.id);"></li>
    </ul>


    <h1>Test configurations:</h1>
    <br>
    <select>
        <option ng-repeat="tests in configList | orderBy:'Name':true">
             <span>{{tests.Name}}</span>
        </option>
    </select>
    <br>

    <h1>Result</h1>

    <div ng-show="testResult">{{testResult}}</div>

</div>




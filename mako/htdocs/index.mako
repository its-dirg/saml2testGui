## index.html
<%inherit file="base.mako"/>

<div ng-controller="IndexCtrl" >

    <h1>Tests</h1>

    <div ng-repeat="tests in testList | orderBy:'id':true" ng-click="testClick(tests.id);">
        <span>{{tests.id}}</span>
    </div>


    <h1>Test configurations:</h1>
    <br>
    <select>
        <option ng-repeat="tests in configList | orderBy:'Name':true">
             <span>{{tests.Name}}</span>
        </option>
    </select>
    <br>

    <button ng-click="runTest();">Run "log-in-out" test</button>

    <h1>Result</h1>
    <div ng-show="testResult">{{testResult}}</div>

</div>
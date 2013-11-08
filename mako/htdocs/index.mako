## index.html
<%inherit file="base.mako"/>

<div ng-controller="IndexCtrl" >

    <h1>Tests</h1>

    <div ng-repeat="tests in testList | orderBy:'id':true" ng-click="runTest(tests.id);">
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

    <h1>Result</h1>
    <!---
    <div ng-repeat="t in testResult" | filter: { status: '1' }>{{t.name}}</div>

    Den sorterar inte ut efter status som den ska!!!
    --->
    <div ng-repeat="t in testResult" | filter: { status : 1}>{{t}}</div>
</div>
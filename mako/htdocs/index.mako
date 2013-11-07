## index.html
<%inherit file="base.mako"/>

<%!
    def helloWorld(a_value):
      """
      A hello world function.
      :return: A vallue.
      """
      return "From function: " + a_value
%>

<!--

<%block name="header">
    <!-- List all type of tests -->
</%block>

this is the body content.


${a_value}
<br />
${helloWorld(a_value)}

-->

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


     <!---
    <div ng-repeat="tests in list | orderBy:'Name':true">
        <span>{{tests.Name}}</span>
    </div>



    --->

</div>
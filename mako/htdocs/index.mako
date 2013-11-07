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
    <button ng-click="getList();">GETList</button>

    <br>

    <div ng-repeat="tests in list | orderBy:'id':true">
        <span>{{tests.id}}</span>
    </div>


    <button ng-click="getConfigFileList();">GET CONFIG LIST</button>
    <br>
    <select>
        <option ng-repeat="tests in list | orderBy:'Name':true">
             <span>{{tests.Name}}</span>
        </option>
    </select>


     <!---
    <div ng-repeat="tests in list | orderBy:'Name':true">
        <span>{{tests.Name}}</span>
    </div>



    --->

</div>
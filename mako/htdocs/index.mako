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


<%block name="header">
    List all type of tests
</%block>

this is the body content.

${a_value}
<br />
${helloWorld(a_value)}


<div ng-controller="IndexCtrl" >
    <div ng-click="getList();">CLICK ME</div>
    <div ng-repeat="tests in list order by id">
        <span>{{tests.id}}</span>
    </div>

</div>
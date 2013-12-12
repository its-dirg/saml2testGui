## index.html
<%inherit file="base.mako"/>

<%block name="script">
    <!-- Add more script imports here! -->
    <script src="/static/bootbox.min.js" xmlns="http://www.w3.org/1999/html"></script>
</%block>

<%block name="css">
    <!-- Add more css imports here! -->
    <link rel="stylesheet" type="text/css" href="/static/test_config.css">
</%block>

<%block name="title">
    Saml2test application
</%block>

<%block name="header">
    ${parent.header()}
</%block>

<%block name="headline">
    <div ng-controller="IndexCtrl">
</%block>


<%block name="body">

    <div id="content">

        <h2>Configurations</h2>

        <button class="btn btn-primary btn-sm" ng-click="test();">Upload configurations</button>
        <button class="btn btn-primary btn-sm" ng-click="test();">Download configurations</button>

        <hr>

        <form action="/post_basic_config" method="post" >
            <div class="row" ng-repeat="entry in basicConfig">

                <div class="col-lg-1" id="label">
                    {{entry.label}}
                </div>

                <div class="col-lg-11">
                    <input type="text" name="{{entry.label}}" value="{{entry.value}}" id="{{entry.label}}">
                </div>

                <br>

            </div>
        </form>

        <button class="btn btn-primary btn-sm" ng-click="saveBasicConfig();">Save configurations</button>

        <hr>

        Interaction: <button class="btn btn-default btn-sm" ng-click="addInteraction();">+</button>

        <div class="block" ng-repeat="entry in interactionConfigList" id="{{entry.id}}">
            <form>
                id:{{entry.id}}
                <div class="row" ng-repeat="row in entry.rows">
                    <div class="col-lg-2" id="label">
                        {{row.label}}
                    </div>

                    <div class="col-lg-10">
                        <input type="text" name="firstname" value="{{row.value}}" id="{{row.label}}">
                    </div>

                    <br>

                </div>
            </form>

            <div class="close">
                <button class="btn btn-danger btn-sm" ng-click="tryToRemoveInteraction(entry.id);">X</button>
            </div>
        </div>

        <button class="btn btn-primary btn-sm" ng-click="saveInteractionConfig();">Save configurations</button>

    </div>
</%block>

<%block name="footer">
    </div>

    <script type="text/javascript" src="/static/test_config.js"></script>

    ${parent.footer()}
</%block>
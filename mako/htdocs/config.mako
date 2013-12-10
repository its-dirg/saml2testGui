## index.html
<%inherit file="base.mako"/>

<%block name="script">
    <!-- Add more script imports here! -->
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

        <form>
            <div class="row" ng-repeat="entry in basicConfig">

                <div class="col-lg-1" id="label">
                    {{entry.label}}
                </div>

                <div class="col-lg-11">
                    <input type="text" name="firstname" value="{{entry.value}}">
                </div>

                <br>

            </div>
        </form>

        <hr>

        Interaction: <button class="btn btn-default btn-sm" ng-click="addInteraction();">+</button>

        <!--
        Each block has to contain a index so it will be possible to remove them dosen't looks like it's working right now
        -->

        <div class="block" ng-repeat="entry in interactionConfigList">
            <form>
                <div class="row" ng-repeat="row in entry[0].rows">

                    <div class="col-lg-2" id="label">
                        {{row.label}}
                    </div>

                    <div class="col-lg-10">
                        <input type="text" name="firstname" value="{{row.value}}">
                    </div>

                    <br>

                </div>

            </form>

            <div class="close">
                <button class="btn btn-danger btn-sm" ng-click="test();">X</button>
            </div>
        </div>

        <button class="btn btn-primary btn-sm" ng-click="test();">Save configurations</button>

    </div>
</%block>

<%block name="footer">
    </div>

    <script type="text/javascript" src="/static/test_config.js"></script>

    ${parent.footer()}
</%block>
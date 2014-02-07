## index.html
<%inherit file="base.mako"/>

<%block name="script">
    <!-- Add more script imports here! -->
    <script src="/static/bootbox.min.js" xmlns="http://www.w3.org/1999/html"></script>
</%block>

<%block name="css">
    <!-- Add more css imports here! -->
    <link rel="stylesheet" type="text/css" href="/static/idp_config.css">
</%block>

<%block name="title">
    Saml2test application
</%block>

<%block name="header">
    ${parent.header()}
</%block>

<%block name="headline">
    <div menu></div>

    <div ng-controller="IndexCtrl">
</%block>


<%block name="body">

    <div id="content">

        <h2>IDP configuration:
            <button class="btn btn-primary btn-sm" ng-click="reloadConfigFile();">
                <span class="glyphicon glyphicon-refresh"></span>
            </button>
        </h2>

        <form>
            <div class="row">
                <div class="col-lg-2">
                    Create new config:
                </div>

                <div class="col-lg-10">
                    <button class="btn btn-primary btn-sm" ng-click="createNewConfigFile();">Create configurations</button>
                    <br>
                    <br>
                </div>
            </div>

             <div class="row">
                <div class="col-lg-2">
                    Upload config file:
                </div>

                <div class="col-lg-10">

                    <input type="file" name="file" id="targetFile">
                    <button class="btn btn-primary btn-sm" ng-click="uploadConfigFile();">Upload configurations</button>
                    <br>
                    <br>
                </div>
            </div>

             <div class="row">
                <div class="col-lg-2">
                    Download config file:
                </div>

                <div class="col-lg-10">
                    <button class="btn btn-primary btn-sm" ng-click="downloadConfigFile();">Download configurations</button>
                </div>
            </div>
        </form>

        <hr>

        <!-- HIDE EVERY THING UNDER THIS LINE UNTIL DATA IS STORED IN THE SESSION -->

<!-- ################################################################################################# -->
        <div ng-show="basicConfig">
            <form>
                <div class="row">
                    <div class="col-lg-2">
                        Upload metadata file:
                    </div>

                    <div class="col-lg-10">
                        <input type="file" name="file" id="metadataFile">
                        <button class="btn btn-primary btn-sm" ng-click="uploadMetadataFile();">Upload</button>
                        <br>
                        <br>
                    </div>
                </div>

                <div class="row">
                    <div class="col-lg-2" id="label">
                        Upload metadata by url:
                    </div>

                    <div class="col-lg-10">
                        <input type="text" value="https://localhost:4545/temp_get_metadata" id="metadataUrl">
                        <button class="btn btn-primary btn-sm" ng-click="uploadMetadataUrl();">Upload</button>
                        <br>
                        <br>
                    </div>
                </div>

                <hr>
<!-- ################################################################################################# -->

                <div class="row" ng-repeat="(key, data) in basicConfig">
                    <div class="col-lg-2" id="label">
                        {{key}}:
                    </div>

                    <div class="col-lg-10">
                        <input type="text" value="{{data}}" id="{{key}}">
                    </div>
                </div>
            </form>

            <button class="btn btn-primary btn-sm" ng-click="saveBasicConfig();">Save configurations</button>

            <hr>
<!-- ################################################################################################# -->

            Interaction: <button class="btn btn-default btn-sm" ng-click="addInteraction();">+</button>

            <div class="block" ng-repeat="entry in convertedInteractionList" id="{{entry.id}}">
                <form>

                    <div class="row" ng-repeat="(key, data) in entry.entry.matches">
                        <div class="col-lg-2">
                            {{key}}:
                        </div>

                        <div class="col-lg-10">
                            <input type="text" value="{{data}}" id="{{key}}">
                        </div>
                        <br>
                    </div>

                    <div class="row">
                        <div class="col-lg-2">
                            page-type:
                        </div>

                        <div class="col-lg-10">
                            <input type="text" value="{{entry.entry.pagetype}}" id="pagetype">
                        </div>
                        <br>
                    </div>

                    <div class="row" ng-repeat="(key, data) in entry.entry.control">
                        <div class="col-lg-2">
                            {{key}}:
                        </div>

                        <div class="col-lg-10">
                            <input type="text" value="{{data}}" id="{{key}}">
                        </div>
                        <br>
                    </div>

                </form>

                <div class="close">
                    <button class="btn btn-danger btn-sm" ng-click="tryToRemoveInteraction(entry.id);">X</button>
                </div>
            </div>

            <br>

            <button class="btn btn-primary btn-sm" ng-click="saveInteractionConfig();">Save configurations</button>
        </div>
    </div>
</%block>

<%block name="footer">
    </div>

    <script type="text/javascript" src="/static/idp_config.js"></script>
    ${parent.footer()}
</%block>
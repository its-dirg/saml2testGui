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

        <h2>
            IDP configuration:
        </h2>

        <div class="row">
            <div class="col-sm-4">
                <button class="btn btn-primary btn-sm" ng-click="showCreateNewConfigDialog();">
                    <span class="glyphicon glyphicon-file"></span>
                    Create new configurations
                </button>
            </div>

            <div class="col-sm-4">
                <button class="btn btn-primary btn-sm" ng-click="showModalUploadConfigWindow();">
                    <span class="glyphicon glyphicon-open"></span>
                    Upload configurations
                </button>
            </div>

            <div class="col-sm-4">
                <button class="btn btn-primary btn-sm" ng-click="requestDownloadConfigFile();">
                    <span class="glyphicon glyphicon-download-alt"></span>
                    Download configurations
                </button>
            </div>
        </div>

        <hr>

        <!-- HIDE EVERY THING UNDER THIS LINE UNTIL DATA IS STORED IN THE SESSION -->

<!-- ################################################################################################# -->
        <div ng-show="basicConfig">

            <div class="row">
                <div class="col-sm-2">
                    Upload metadata file:
                </div>

                <div class="col-sm-10">
                    <input type="file" name="file" id="metadataFile">
                    <button class="btn btn-default btn-sm" ng-click="uploadMetadataFile();">Upload</button>
                    <br>
                    <br>
                </div>
            </div>

            <div class="row">
                <div class="col-sm-2" id="label">
                    Upload metadata by url:
                </div>

                <div class="col-sm-10">
                    <input type="text" id="metadataUrl">
                    <button class="btn btn-default btn-sm" ng-click="requestUploadMetadataUrl();">Upload</button>
                    <br>
                    <br>
                </div>
            </div>

            <hr>
<!-- ################################################################################################# -->

            <div class="row" ng-repeat="(key, data) in basicConfig">
                <div class="col-sm-2" id="label">
                    {{key}}:
                </div>

                <div class="col-sm-10">
                    <input type="text" value="{{data}}" id="{{key}}">
                </div>
            </div>


            <hr>
<!-- ################################################################################################# -->

            Interaction: <button class="btn btn-default btn-sm" ng-click="addInteractionBlock();">+</button>

            <div class="block" ng-repeat="entry in convertedInteractionList" id="{{entry.id}}">

                <div class="row" ng-repeat="(key, data) in entry.entry.matches">
                    <div class="col-sm-2">
                        {{key}}:
                    </div>

                    <div class="col-sm-10">
                        <input type="text" value="{{data}}" id="{{key}}">
                    </div>
                    <br>
                </div>

                <div class="row">
                    <div class="col-sm-2">
                        page-type:
                    </div>

                    <div class="col-sm-10">
                        <input type="text" value="{{entry.entry.pagetype}}" id="pagetype">
                    </div>
                    <br>
                </div>

                <div class="row" ng-repeat="(key, data) in entry.entry.control">
                    <div class="col-sm-2">
                        {{key}}:
                    </div>

                    <div class="col-sm-10">
                        <input type="text" value="{{data}}" id="{{key}}">
                    </div>
                    <br>
                </div>

                <div class="close">
                    <button class="btn btn-danger btn-sm" ng-click="createConfirmRemoveInteractionBlockDialog(entry.id);">X</button>
                </div>
            </div>

            <br>

            <button class="btn btn-primary btn-sm" ng-click="requestToSaveConfig();">Save configurations</button>
        </div>
    </div>

    <div class="modal fade" id="modalWindowUploadConfigurationFile" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <input type="file" name="file" id="targetFile">
                <button class="btn btn-primary btn-sm" ng-click="uploadConfigFile();">Upload configurations</button>
            </div>
        </div>
    </div>

</%block>

<%block name="footer">
    </div>

    <script type="text/javascript" src="/static/idp_config.js"></script>
    ${parent.footer()}
</%block>
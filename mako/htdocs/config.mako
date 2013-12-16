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

        <button class="btn btn-primary btn-sm" ng-click="resetTargetJson();">Reset Target.json</button>

        <hr>

        <h2>Configurations</h2>

        <form>
             <div class="row">

                <div class="col-lg-2">
                    Upload config file:
                </div>

                <div class="col-lg-10">

                    <input type="file" name="file" id="targetFile">
                    <button class="btn btn-primary btn-sm" ng-click="uploadTargetJson();">Upload configurations</button>
                    <br>
                    <br>
                </div>
            </div>

             <div class="row">

                <div class="col-lg-2">
                    Download config file:
                </div>

                <div class="col-lg-10">
                    <button class="btn btn-primary btn-sm" ng-click="downloadTargetJson();">Download configurations</button>
                </div>
            </div>
        </form>

        <hr>

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
                    <input type="text" value="" id="entity_id">
                </div>
            </div>

            <div class="row">
                <div class="col-lg-2" id="label">
                    Entity id:
                </div>

                <div class="col-lg-10">
                    <input type="text" value="{{basicConfig.entity_id}}" id="entity_id">
                </div>
            </div>
        </form>


        <button class="btn btn-primary btn-sm" ng-click="saveBasicConfig();">Save configurations</button>

        <hr>

        Interaction: <button class="btn btn-default btn-sm" ng-click="addInteraction();">+</button>

        <div class="block" ng-repeat="entry in convertedInteractionList" id="{{entry.id}}">
            <form>
                id:{{entry.id}}

                <div class="row">
                    <div class="col-lg-2">
                        Url:
                    </div>

                    <div class="col-lg-10">
                        <input type="text" value="{{entry.entry.matches.url}}" id="url">
                    </div>
                    <br>
                </div>
                <div class="row">
                    <div class="col-lg-2">
                        Title:
                    </div>

                    <div class="col-lg-10">
                        <input type="text" value="{{entry.entry.matches.title}}" id="title">
                    </div>
                    <br>
                </div>
                <div class="row">
                    <div class="col-lg-2">
                        Page-type:
                    </div>

                    <div class="col-lg-10">
                        <input type="text" value="{{entry.entry.pagetype}}" id="pagetype">
                    </div>
                    <br>
                </div>
                <div class="row">
                    <div class="col-lg-2">
                        Type:
                    </div>

                    <div class="col-lg-10">
                        <input type="text" value="{{entry.entry.control.type}}" id="type">
                    </div>
                    <br>
                </div>
                <div class="row">
                    <div class="col-lg-2">
                        Index:
                    </div>

                    <div class="col-lg-10">
                        <input type="text" value="{{entry.entry.control.index}}" id="index">
                    </div>
                    <br>
                </div>
                <div class="row">
                    <div class="col-lg-2">
                        Set:
                    </div>

                    <div class="col-lg-10">
                        <input type="text" value="{{entry.entry.control.set}}" id="set">
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
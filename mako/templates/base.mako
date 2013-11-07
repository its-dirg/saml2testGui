<!DOCTYPE html>
<html ng-app="app">
    <head>
        <script src="/static/angular.min.js"></script>
        <script src="/static/jquery.min.1.9.1.js"></script>
        <script src="/static/bootstrap/js/bootstrap.min.js"></script>
        <link href="/static/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
    </head>
    <body>
        <div class="header">
            <%block name="header"/>
        </div>

        ${self.body()}

        <div class="footer">
            <%block name="footer">

            </%block>
        </div>
        <script src="/static/test.js"></script>
    </body>
</html>
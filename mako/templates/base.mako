<!DOCTYPE html>
<html ng-app="main">
    <head>
        <script src="/static/angular.js" ></script>
        <script src="/static/jquery.min.1.9.1.js"></script>
        <script src="/static/bootstrap/js/bootstrap.min.js"></script>
        <link href="/static/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">
        <link rel="stylesheet" type="text/css" href="/static/basic.css">
        <link rel="stylesheet" type="text/css" href="/static/toaster.css">

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
        <script src="/static/toaster.js"></script>
    </body>
</html>
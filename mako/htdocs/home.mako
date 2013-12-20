## index.html
<%inherit file="base.mako"/>

<%block name="script">
    <!-- Add more script imports here! -->
</%block>

<%block name="css">
    <!-- Add more css imports here! -->
</%block>

<%block name="title">
    Saml2test application
</%block>

<%block name="header">
    ${parent.header()}
</%block>

<%block name="headline">
    <div ng-controller="IndexCtrl">

    <script language="JavaScript" type="text/javascript" src="/static/menu.js"></script>
</%block>


<%block name="body">

    <h2>Home page</h2>
    <span style="font-size:17px">
        SAML2test is a tests tool that will allow an independent validation
        of a specific instance of a SAML2 entity. It will test not only if the
        instance works according to the SAML2 standard but also if it complies
        with a specific profile of SAML2.
    </span>

</%block>

<%block name="footer">
    </div>

    ${parent.footer()}
</%block>
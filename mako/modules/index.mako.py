# -*- encoding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 9
_modified_time = 1386585580.684137
_enable_loop = True
_template_filename = 'mako/htdocs/index.mako'
_template_uri = 'index.mako'
_source_encoding = 'utf-8'
_exports = [u'body', u'title', u'headline', u'script', u'header', u'footer', u'css']


def _mako_get_namespace(context, name):
    try:
        return context.namespaces[(__name__, name)]
    except KeyError:
        _mako_generate_namespaces(context)
        return context.namespaces[(__name__, name)]
def _mako_generate_namespaces(context):
    pass
def _mako_inherit(template, context):
    _mako_generate_namespaces(context)
    return runtime._inherit_from(context, u'base.mako', _template_uri)
def render_body(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        __M_locals = __M_dict_builtin(pageargs=pageargs)
        def body():
            return render_body(context._locals(__M_locals))
        parent = context.get('parent', UNDEFINED)
        def title():
            return render_title(context._locals(__M_locals))
        def headline():
            return render_headline(context._locals(__M_locals))
        def script():
            return render_script(context._locals(__M_locals))
        def header():
            return render_header(context._locals(__M_locals))
        def footer():
            return render_footer(context._locals(__M_locals))
        def css():
            return render_css(context._locals(__M_locals))
        __M_writer = context.writer()
        # SOURCE LINE 2
        __M_writer(u'\n\n')
        if 'parent' not in context._data or not hasattr(context._data['parent'], 'script'):
            context['self'].script(**pageargs)
        

        # SOURCE LINE 7
        __M_writer(u'\n\n')
        if 'parent' not in context._data or not hasattr(context._data['parent'], 'css'):
            context['self'].css(**pageargs)
        

        # SOURCE LINE 12
        __M_writer(u'\n\n')
        if 'parent' not in context._data or not hasattr(context._data['parent'], 'title'):
            context['self'].title(**pageargs)
        

        # SOURCE LINE 16
        __M_writer(u'\n\n')
        if 'parent' not in context._data or not hasattr(context._data['parent'], 'header'):
            context['self'].header(**pageargs)
        

        # SOURCE LINE 20
        __M_writer(u'\n\n')
        if 'parent' not in context._data or not hasattr(context._data['parent'], 'headline'):
            context['self'].headline(**pageargs)
        

        # SOURCE LINE 24
        __M_writer(u'\n\n\n')
        if 'parent' not in context._data or not hasattr(context._data['parent'], 'body'):
            context['self'].body(**pageargs)
        

        # SOURCE LINE 196
        __M_writer(u'\n\n')
        if 'parent' not in context._data or not hasattr(context._data['parent'], 'footer'):
            context['self'].footer(**pageargs)
        

        return ''
    finally:
        context.caller_stack._pop_frame()


def render_body(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        def body():
            return render_body(context)
        __M_writer = context.writer()
        # SOURCE LINE 27
        __M_writer(u'\n\n    Tree layout:\n    <br>\n    <select ng-model="selectedItem"\n        ng-options="item.type for item in items" ng-change="updateTree();">\n    </select>\n\n    <br>\n\n    Available configurations:\n    <select id="targetIdp">\n        <option ng-repeat="tests in configList | orderBy:\'Name\':true">\n             {{tests.Name}}\n        </option>\n    </select>\n\n    <br>\n\n    <div ng-click="toggleInstructionVisibility();" ng-show="instructionVisible == true" id="instructions">\n        <img src="static/pitures/arrowDown.png">\n        Hide instructions\n    </div>\n\n    <div ng-click="toggleInstructionVisibility();" ng-show="instructionVisible == false" id="instructions">\n        <img src="static/pitures/arrowRight.png">\n        Show instructions\n    </div>\n\n    <!-- The information box -->\n    <div class="informationBox" ng-show="instructionVisible == true">\n        <div class="row" id="no-hover">\n\n            <div class="col-xs-12 col-md-9">\n                In the table bellow all tests are presented. Test which depend on others are\n                makred with a little black arrow. In order to see the sub tests press the row containing an arrow.\n                <br>\n                Tests could be executed at three levels. First of a single test could be executed or a test and\n                it\'s sub tests could be executed. In order to do this press the button "Run test" and then choose the appropriate alternative.\n                Then last alternative is to execute all tests by pressing the button "Run all tests".\n                <br>\n                The result of the tests are presented by color encoding the row containing the test and a written status.\n                In order to get a more detailed version of the test result press the button "Show result". The result\n                of the test could be exported to either excel or a text file, by pressing the button export and choose the appropriate alternative.\n\n            </div>\n\n            <div class="col-xs-12 col-md-3">\n                <div class="colorExampleBox" id="totalStatusINFORMATION">\n                    INFORMATION\n                </div>\n\n                <div class="colorExampleBox" id="totalStatusOK">\n                    OK\n                </div>\n\n                <div class="colorExampleBox" id="totalStatusWARNING">\n                    WARNING\n                </div>\n\n                <div class="colorExampleBox" id="totalStatusINTERACTION">\n                    INTERACTION\n                </div>\n\n                <div class="colorExampleBox" id="totalStatusERROR">\n                    ERROR\n                </div>\n\n                <div class="colorExampleBox" id="totalStatusCRITICAL">\n                    CRITICAL\n                </div>\n          </div>\n        </div>\n    </div>\n\n    <br>\n\n    <!-- The headline of the test table -->\n    <div class="col-lg-7" id="testHeadline">\n        Test\n        <button class="btn btn-primary btn-sm" ng-click="resetAll();">Reset Tests</button>\n    </div>\n\n    <div class="col-lg-1" id="testHeadline">\n        Status\n    </div>\n\n    <!-- Export button -->\n    <div class="col-lg-2" id="testHeadline">\n        <div class="btn-group">\n            <button type="button" class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown">\n                Export\n                <span class="caret"></span>\n            </button>\n            <ul class="dropdown-menu">\n                <li ng-click="exportTestResultToTextFile();"><a>Export result to text file</a></li>\n                <li ng-click="exportTestResultToExcel();"><a>Export result to excel file</a></li>\n            </ul>\n        </div>\n    </div>\n\n    <!-- Run all tests button-->\n    <div class="col-lg-2" id="testHeadline">\n        <button class="btn btn-primary" ng-click="runAllTest();">Run all tests</button>\n    </div>\n\n    <br>\n\n    <!-- The code which genertaes the rows of the test table -->\n    <div ng-repeat="data in currentFlattenedTree" class="row">\n\n        <div ng-show="data.visible == true" id="testRow">\n\n            <!-- Tree containging all the tests -->\n            <div class="col-lg-7" id="totalStatus{{data.status}}" ng-click="showOrHideTests(data.testid);">\n                <div id="level{{data.level}}">\n\n                    <span class="glyphicon glyphicon-info-sign" rel="tooltip" title="{{data.descr}}" id="infoIcon"></span>\n\n                    <img src="static/pitures/arrowRight.png" ng-show="data.hasChildren == true">\n\n                    <span ng-click="removeTestResult(data.testid);" rel="tooltip" title="{{data.descr}}">{{data.id}}</span>\n\n                </div>\n            </div>\n\n            <!-- Status of a given test -->\n            <div class="col-lg-1" id="totalStatus{{data.status}}">\n                {{data.status}}\n             </div>\n\n            <!-- Show or hide result button -->\n            <div class="col-lg-2" id="totalStatus{{data.status}}">\n                <div class="btn btn-default btn-xs" ng-click="showOrHideResult(data.testid);">Show result</div>\n            </div>\n\n            <!-- Run test buttons -->\n            <div class="col-lg-2" id="totalStatus{{data.status}}">\n\n                <div class="btn-group">\n                    <button class="btn btn-primary btn-sm dropdown-toggle" data-toggle="dropdown" id="runButton">\n                        Run test\n                        <span class="caret"></span>\n                    </button>\n                    <ul class="dropdown-menu">\n                        <li ng-click="runMultipleTest(data.id, data.testid);"><a>Run test and sub tests</a></li>\n                        <li ng-click="runOneTest(data.id, data.testid, \'singleTest\');"><a>Run this test only</a></li>\n                    </ul>\n                </div>\n\n            </div>\n\n            <br>\n\n            <!-- Result frame containing the result of a executed test -->\n            <div class="resultFrame" ng-show="data.showResult == true">\n                Result:\n                <br>\n\n                <!--\n                <div ng-repeat="test in data.result">{{test.status}} : {{test.id}} : {{test.name}}</div>\n                -->\n\n                <div ng-repeat="test in data.result">{{test}}</div>\n\n            </div>\n        </div>\n    </div>\n\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


def render_title(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        def title():
            return render_title(context)
        __M_writer = context.writer()
        # SOURCE LINE 14
        __M_writer(u'\n    Saml2test application\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


def render_headline(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        def headline():
            return render_headline(context)
        __M_writer = context.writer()
        # SOURCE LINE 22
        __M_writer(u'\n    <div ng-controller="IndexCtrl">\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


def render_script(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        def script():
            return render_script(context)
        __M_writer = context.writer()
        # SOURCE LINE 4
        __M_writer(u'\n    <!-- Add more script imports here! -->\n    <script src="/static/bootbox.min.js"></script>\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


def render_header(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        def header():
            return render_header(context)
        parent = context.get('parent', UNDEFINED)
        __M_writer = context.writer()
        # SOURCE LINE 18
        __M_writer(u'\n    ')
        # SOURCE LINE 19
        __M_writer(unicode(parent.header()))
        __M_writer(u'\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


def render_footer(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        parent = context.get('parent', UNDEFINED)
        def footer():
            return render_footer(context)
        __M_writer = context.writer()
        # SOURCE LINE 198
        __M_writer(u'\n    </div>\n\n    <!-- Modal -->\n    <div class="modal fade" id="modalWindow" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\n        <div class="modal-dialog">\n            <div class="modal-content" id="modalContent">\n\n            </div>\n        </div>\n    </div>\n\n    <script type="text/javascript" src="/static/test.js"></script>\n\n    ')
        # SOURCE LINE 212
        __M_writer(unicode(parent.footer()))
        __M_writer(u'\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


def render_css(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        def css():
            return render_css(context)
        __M_writer = context.writer()
        # SOURCE LINE 9
        __M_writer(u'\n    <!-- Add more css imports here! -->\n    <link rel="stylesheet" type="text/css" href="/static/saml2testgui.css">\n')
        return ''
    finally:
        context.caller_stack._pop_frame()



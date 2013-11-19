# -*- encoding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 9
_modified_time = 1384850652.374426
_enable_loop = True
_template_filename = 'mako/htdocs/index.mako'
_template_uri = 'index.mako'
_source_encoding = 'utf-8'
_exports = []


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
        __M_writer = context.writer()
        # SOURCE LINE 2
        __M_writer(u'\n\n<div ng-controller="IndexCtrl" >\n    <div class="container">\n        <div id="formContainer" class="jumbotron">\n\n            Tree layout:\n            <br>\n            <select ng-model="selectedItem"\n                ng-options="item.type for item in items" ng-change="updateTree();">\n            </select>\n\n            <br>\n\n            Available configurations:\n            <select id="targetIdp">\n                <option ng-repeat="tests in configList | orderBy:\'Name\':true">\n                     {{tests.Name}}\n                </option>\n            </select>\n            <br>\n\n            <div class="col-lg-8" id="testHeadline">\n                Test\n            </div>\n\n            <div class="col-lg-2" id="testHeadline">\n                Status\n            </div>\n\n            <div class="col-lg-2" id="testHeadline">\n                <button type="button" class="btn btn-primary btn-sm">Run all tests</button>\n            </div>\n\n            <br>\n\n            <div ng-repeat="data in currentFlattenedTree" class="row">\n\n                <div ng-show="data.visible == true">\n\n\n                    <div class="col-lg-8" id="level{{data.level}}" ng-click="identifyTestNode(data.testid);">\n                        <img src="static/pitures/arrowRight.png" ng-show="data.hasChildren == true">\n\n                        <span ng-click="removeTestResult(data.testid);">{{data.id}}</span>\n                    </div>\n\n                    <div class="col-lg-2" id="status">\n                        {{data.result.status}}\n                    </div>\n\n\n                    <div class="col-lg-2" id="runTestButton">\n                        <button type="button" class="btn btn-primary btn-sm" ng-click="runTest(data.id, data.testid);">Run test</button>\n                    </div>\n\n                    <textarea ng-show="data.result" cols="120" rows="5">{{data.result}}</textarea>\n\n\n                </div>\n\n            </div>\n        </div>\n    </div>\n\n</div>\n\n')
        return ''
    finally:
        context.caller_stack._pop_frame()



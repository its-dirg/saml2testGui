# -*- encoding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 9
_modified_time = 1384348865.051581
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
        __M_writer(u'\n\n<div ng-controller="IndexCtrl" >\n    <div class="container">\n        <div id="formContainer" class="jumbotron">\n\n            Tree layout:\n            <br>\n            <select ng-model="selectedItem"\n                ng-options="item.type for item in items" ng-change="updateTree();">\n            </select>\n\n            <br>\n\n            Available configurations:\n            <select id="targetIdp">\n                <option ng-repeat="tests in configList | orderBy:\'Name\':true">\n                     {{tests.Name}}\n                </option>\n            </select>\n            <br>\n\n            <!--- Start starting point for tree containing all tests --->\n\n            <div class="col-lg-6">\n                Test\n            </div>\n\n            <div class="col-lg-6" id="block">\n                <span style="display: inline" id="status">\n                Status\n                </span>\n\n                <span>\n                Button\n                </span>\n            </div>\n\n            <ul>\n                <li ng-repeat="data in tree" ng-include="\'tree_item_renderer.html\'">\n                </li>\n            </ul>\n\n            Result:\n            <div ng-show="testResult">{{testResult}}</div>\n\n\n        </div>\n    </div>\n\n</div>\n\n\n\n<!--- Script used to actually generate the tree containing the tests  --->\n<script type="text/ng-template"  id="tree_item_renderer.html">\n\n    <!--- The element in which the test info is stored --->\n    <div class="row">\n        <div class="col-lg-6">\n            {{data.id}}\n        </div>\n\n        <div class="col-lg-6" id="block">\n                <span style="display: inline" id="status">\n                Status\n                </span>\n\n                <button type="button" class="btn btn-primary btn-sm" ng-click="runTest(data.id);">Run test</button>\n\n        </div>\n    </div>\n    <ul>\n        <li ng-repeat="data in data.children" ng-include="\'tree_item_renderer.html\'">\n        </li>\n    </ul>\n</script>\n\n\n')
        return ''
    finally:
        context.caller_stack._pop_frame()



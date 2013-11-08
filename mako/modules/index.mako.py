# -*- encoding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 9
_modified_time = 1383901456.922067
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
        __M_writer(u'\n\n<div ng-controller="IndexCtrl" >\n\n    <h1>Tests</h1>\n\n    <div ng-repeat="tests in testList | orderBy:\'id\':true" ng-click="testClick(tests.id);">\n        <span>{{tests.id}}</span>\n    </div>\n\n\n    <h1>Test configurations:</h1>\n    <br>\n    <select>\n        <option ng-repeat="tests in configList | orderBy:\'Name\':true">\n             <span>{{tests.Name}}</span>\n        </option>\n    </select>\n    <br>\n\n    <button ng-click="runTest();">Run "log-in-out" test</button>\n\n    <h1>Result</h1>\n    <div ng-show="testResult">{{testResult}}</div>\n\n</div>')
        return ''
    finally:
        context.caller_stack._pop_frame()



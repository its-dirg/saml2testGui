# -*- encoding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 9
_modified_time = 1384332174.656741
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
        __M_writer(u'\n\n<div ng-controller="IndexCtrl" >\n    <div class="container">\n        <div class="row">\n\n            <div class="jumbotron">\n\n                <!---\n                <table class="table table-hover">\n                    <tr>\n                        <th>Test</th>\n                        <th>Status</th>\n                        <th>Run test</th>\n                    </tr>\n\n                    <tr>\n                        <td  ng-click="click();">row 1, cell 1</td>\n                        <td>row 1, cell 2</td>\n                        <td><button>tests</button></td>\n                    </tr>\n\n                    <tr>\n                        <td>row 2, cell 1</td>\n                        <td>row 2, cell 2</td>\n                        <td><button>tests</button></td>\n                    </tr>\n\n                    <tr>\n                        <td>row 3, cell 1</td>\n                        <td>row 3, cell 2</td>\n                        <td><button>tests</button></td>\n                    </tr>\n                </table>\n                --->\n\n                <h1>Tests </h1>\n                    <!--- Start starting point for tree containing all tests --->\n                    <ul>\n                        <li ng-repeat="data in tree" ng-include="\'tree_item_renderer.html\'">\n                        </li>\n                    </ul>\n\n                    <h1>Test configurations:</h1>\n                    <br>\n                    <select id="targetIdp">\n                        <option ng-repeat="tests in configList | orderBy:\'Name\':true">\n                             {{tests.Name}}\n                        </option>\n                    </select>\n                    <br>\n\n                    <h1>Result</h1>\n\n                    <div ng-show="testResult">{{testResult}}</div>\n\n                </div>\n            </div>\n        </div>\n    </div>\n\n</div>\n\n\n\n<!--- Script used to actually generate the tree containing the tests  --->\n<script type="text/ng-template"  id="tree_item_renderer.html">\n\n    <!--- The element in which the test info is stored --->\n    <div ng-click="runTest(data.id);">{{data.id}}</div>\n\n    <ul>\n        <li ng-repeat="data in data.children" ng-include="\'tree_item_renderer.html\'">\n        </li>\n    </ul>\n</script>\n\n\n')
        return ''
    finally:
        context.caller_stack._pop_frame()



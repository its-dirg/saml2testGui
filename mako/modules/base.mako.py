# -*- encoding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 9
_modified_time = 1386074310.756666
_enable_loop = True
_template_filename = u'mako/templates/base.mako'
_template_uri = u'base.mako'
_source_encoding = 'utf-8'
_exports = [u'header', u'footer']


def render_body(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        __M_locals = __M_dict_builtin(pageargs=pageargs)
        def header():
            return render_header(context._locals(__M_locals))
        self = context.get('self', UNDEFINED)
        def footer():
            return render_footer(context._locals(__M_locals))
        __M_writer = context.writer()
        # SOURCE LINE 1
        __M_writer(u'<!DOCTYPE html>\n<html ng-app="main">\n    <head>\n        <script src="/static/angular.js" ></script>\n        <script src="/static/jquery.min.1.9.1.js"></script>\n        <script src="/static/bootstrap/js/bootstrap.min.js"></script>\n        <link href="/static/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen">\n        <link rel="stylesheet" type="text/css" href="/static/basic.css">\n        <link rel="stylesheet" type="text/css" href="/static/toaster.css">\n\n    </head>\n    <body>\n\n        <div class="header">\n            ')
        if 'parent' not in context._data or not hasattr(context._data['parent'], 'header'):
            context['self'].header(**pageargs)
        

        # SOURCE LINE 15
        __M_writer(u'\n        </div>\n\n        ')
        # SOURCE LINE 18
        __M_writer(unicode(self.body()))
        __M_writer(u'\n\n        <div class="footer">\n            ')
        if 'parent' not in context._data or not hasattr(context._data['parent'], 'footer'):
            context['self'].footer(**pageargs)
        

        # SOURCE LINE 23
        __M_writer(u'\n        </div>\n        <script src="/static/test.js"></script>\n        <script src="/static/toaster.js"></script>\n    </body>\n</html>')
        return ''
    finally:
        context.caller_stack._pop_frame()


def render_header(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        def header():
            return render_header(context)
        __M_writer = context.writer()
        return ''
    finally:
        context.caller_stack._pop_frame()


def render_footer(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        def footer():
            return render_footer(context)
        __M_writer = context.writer()
        # SOURCE LINE 21
        __M_writer(u'\n\n            ')
        return ''
    finally:
        context.caller_stack._pop_frame()



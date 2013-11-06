# -*- encoding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 8
_modified_time = 1383745225.804381
_enable_loop = True
_template_filename = 'mako/htdocs/list.mako'
_template_uri = 'list.mako'
_source_encoding = 'utf-8'
_exports = [u'header']


# SOURCE LINE 4

def helloWorld(a_value):
  """
      A hello world function.
      :return: A vallue.
      """
  return "From function: " + a_value


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
        a_value = context.get('a_value', UNDEFINED)
        def header():
            return render_header(context.locals_(__M_locals))
        __M_writer = context.writer()
        # SOURCE LINE 2
        __M_writer(u'\n\n')
        # SOURCE LINE 11
        __M_writer(u'\n\n\n')
        if 'parent' not in context._data or not hasattr(context._data['parent'], 'header'):
            context['self'].header(**pageargs)
        

        # SOURCE LINE 16
        __M_writer(u'\n\nthis is the body content.\n\n')
        # SOURCE LINE 20
        __M_writer(unicode(a_value))
        __M_writer(u'\n<br />\n')
        # SOURCE LINE 22
        __M_writer(unicode(helloWorld(a_value)))
        return ''
    finally:
        context.caller_stack._pop_frame()


def render_header(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        def header():
            return render_header(context)
        __M_writer = context.writer()
        # SOURCE LINE 14
        __M_writer(u'\n    List all type of tests\n')
        return ''
    finally:
        context.caller_stack._pop_frame()



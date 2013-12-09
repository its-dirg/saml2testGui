# -*- coding: utf-8 -*-


__author__ = 'haho0032'
#Imports within the project
from dirg_util.log import create_logger
from dirg_util.http_util import HttpHandler
from dirg_util.session import Session
from saml2testGui.TestHandler import Test

#External imports
import importlib
import argparse
from cherrypy import wsgiserver
from cherrypy.wsgiserver import ssl_pyopenssl
from beaker.middleware import SessionMiddleware
from mako.lookup import TemplateLookup


#Lookup for all mako templates.
LOOKUP = TemplateLookup(directories=['mako/templates', '/opt/dirg/dirg-util/mako/templates', 'mako/htdocs'],
                        module_directory='mako/modules',
                        input_encoding='utf-8',
                        output_encoding='utf-8')

global CACHE
CACHE = {}

def application(environ, start_response):
    """
    WSGI application. Handles all requests.
    :param environ: WSGI enviroment.
    :param start_response: WSGI start response.
    :return: Depends on the request. Always a WSGI response where start_response first have to be initialized.
    """
    session = Session(environ)

    http_helper = HttpHandler(environ, start_response, session, logger)

    parameters = http_helper.query_dict()

    test = Test(environ, start_response, session, logger, LOOKUP, config, parameters, CACHE)
    path = http_helper.path()

    http_helper.log_request()
    response = None
    if http_helper.verify_static(path):
        return http_helper.handle_static(path)

    if test.verify(path):
        return test.handle(path)

    if response is None:
        response = http_helper.http404()

    http_helper.log_response(response)
    return response


if __name__ == '__main__':
    #This is equal to a main function in other languages. Handles all setup and starts the server.

    #Read arguments.
    parser = argparse.ArgumentParser()
    parser.add_argument(dest="config")
    args = parser.parse_args()
    global config
    config = importlib.import_module(args.config)

    global logger
    logger = create_logger(config.LOG_FILE)

    global SRV
    SRV = wsgiserver.CherryPyWSGIServer(('0.0.0.0', config.PORT), SessionMiddleware(application, config.SESSION_OPTS))
    SRV.stats['Enabled'] = True
    #SRV = wsgiserver.CherryPyWSGIServer(('0.0.0.0', config.PORT), application)
    if config.HTTPS:
        SRV.ssl_adapter = ssl_pyopenssl.pyOpenSSLAdapter(config.SERVER_CERT, config.SERVER_KEY, config.CERT_CHAIN)
    logger.info("Server starting")
    print "Server is listening on port: %s" % config.PORT
    try:
        SRV.start()
    except KeyboardInterrupt:
        SRV.stop()

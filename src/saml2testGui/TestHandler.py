import json
from saml2.httputil import Response

__author__ = 'haho0032'

class Test:

    def __init__(self, environ, start_response, session, logger, lookup):
        """
        Constructor for the class.
        :param environ:        WSGI enviroment
        :param start_response: WSGI start_respose
        :param session:        Beaker session
        :param logger:         Class to perform logging.
        """
        self.environ = environ
        self.start_response = start_response
        self.session = session
        self.logger = logger
        self.lookup = lookup
        self.urls = {
            "" : "index.mako",
            "list" : None
        }

    def verify(self, path):
        for url, file in self.urls.iteritems():
            if path == url:
                return True

    def handle(self, path):
        if path == "":
            return self.handleIndex(self.urls[path])
        elif path == "list":
            return self.handleList()

    def handleIndex(self, file):
        resp = Response(mako_template=file,
                        template_lookup=self.lookup,
                        headers=[])
        argv = {
            "a_value": "Hello world"
        }
        return resp(self.environ, self.start_response, **argv)

    def handleList(self):
        myJson = json.dumps([{'id':'1'}, {'id':'3'}, {'id':'2'}])
        return self.returnJSON(myJson)

    def returnJSON(self, text):
        resp = Response(text, headers=[('Content-Type', "application/json")])
        return resp(self.environ, self.start_response)
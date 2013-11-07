import json
import subprocess
from saml2.httputil import Response, ServiceError


__author__ = 'haho0032'

class Test:
    IDP_TESTDRV = '/usr/local/bin/idp_testdrv.py'
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
        ok, p_out, p_err = self.runScript(['ls','-la'])
        ok, p_out, p_err = self.runScript([self.IDP_TESTDRV,'-l'])
        if (ok):
            myJson = p_out #[{'id':'1'}, {'id':'3'}, {'id':'2'}])
        else:
            return self.serviceError("Cannot list the tests.")
        return self.returnJSON(myJson)

    def returnJSON(self, text):
        resp = Response(text, headers=[('Content-Type', "application/json")])
        return resp(self.environ, self.start_response)


    def serviceError(self, message):
        message = {"ExceptionMessage": message}
        resp = ServiceError(json.dumps(message))
        return resp(self.environ, self.start_response)

    def runScript(self, command):
        try:
            p = subprocess.Popen(command,
                                 stdout=subprocess.PIPE,
                                 stderr=subprocess.PIPE)
            while(True):
                retcode = p.poll() #returns None while subprocess is running
                if(retcode is not None):
                    break
            p_out = p.stdout.read()
            p_err = p.stderr.read()
            return (True, p_out, p_err)
        except Exception as ex:
            self.logger.fatal("Can not run command: +" + ex.message)
            return (False, None, None)
# -*- coding: utf-8 -*-
__author__ = 'haho0032'
import cgi
import json
from oic.utils.http_util import NotFound
from urlparse import parse_qs
from StringIO import StringIO

class HttpHandler:

    def __init__(self, environ, start_response, session, logger):
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

    def transformPath(self, path):
        """
        Help method to point robots.txt to the path to the file.
        :param path: Requested path.
        :return: The path to robots.txt if requested, otherwise the unchanged path.
        """
        if path == "robots.txt":
            return "static/robots.txt"
        return path

    def verifyStatic(self, path):
        """
        Verifies if this is a file that should be in the static folder.
        :param path: Requested resource with path.
        :return: True if the file should be in the static folder, otherwise false.
        """
        path = self.transformPath(path)
        if path.startswith("static/"):
            return True
        return False

    def handleStatic(self, path):
        """
        Renders static pages.
        :param environ: wsgi environ
        :param start_response: wsgi start_response
        :param path: Requested resource.
        :return: WSGI response.
        """
        path = self.transformPath(path)
        self.logger.info("[static]sending: %s" % (path,))
        try:
            text = open(path).read()
            if path.endswith(".ico"):
                self.start_response('200 OK', [('Content-Type', "image/x-icon")])
            elif path.endswith(".html"):
                self.start_response('200 OK', [('Content-Type', 'text/html')])
            elif path.endswith(".json"):
                self.start_response('200 OK', [('Content-Type', 'application/json')])
            elif path.endswith(".txt"):
                self.start_response('200 OK', [('Content-Type', 'text/plain')])
            elif path.endswith(".css"):
                self.start_response('200 OK', [('Content-Type', 'text/css')])
            elif path.endswith(".js"):
                self.start_response('200 OK', [('Content-Type', 'text/javascript')])
            elif path.endswith(".xml"):
                self.start_response('200 OK', [('Content-Type', 'text/xml')])
            else:
                self.start_response('200 OK', [('Content-Type', "text/html")])
            return [text]
        except IOError:
            return self.Http404()

    def logResponse(self, response):
        """
        Logs a WSGI response.
        :param response: WSGI response.
        """
        self.logger.info("response:")
        self.logger.info(response)

    def logRequest(self):
        """
        Logs the WSGI request.
        """
        query = self.getQueryDict()
        if "CONTENT_TYPE" in self.environ:
            self.logger.info("CONTENT_TYPE:" + self.environ["CONTENT_TYPE"])
        if "REQUEST_METHOD" in self.environ:
            self.logger.info("CONTENT_TYPE:" + self.environ["REQUEST_METHOD"])
        path = self.getPath()
        self.logger.info("Path:" + self.getPath())
        self.logger.info("Query:")
        self.logger.info(query)

    @staticmethod
    def getQueryDictionary(environ):
        """
        Retrieves a dictionary with query parameters.
        Does not matter if the query parameters are POST or GET.
        Can handle JSON and URL encoded POST, otherwise the body is returned in a dictionare with the key post.
        :param environ: The wsgi enviroment.
        :return: A dictionary with query parameters.
        """
        qs = {}
        type = None
        query = environ.get("QUERY_STRING", "")
        if not query:
            try:
                length = int(environ["CONTENT_LENGTH"])
                body = environ["wsgi.input"].read(length)
                environ['wsgi.input'] = StringIO(body)
                if "CONTENT_TYPE" in environ and environ["CONTENT_TYPE"] == "application/json":
                    return json.loads(body)
                elif "CONTENT_TYPE" in environ and environ["CONTENT_TYPE"] == "application/x-www-form-urlencoded":
                    return parse_qs(body)
                else:
                    return {"post": body}
            except:
                pass

        else:
            qs = dict((k, v if len(v) > 1 else v[0]) for k, v in
                      parse_qs(query).iteritems())
        return qs

    def getQueryDict(self):
        """
        Retrieves a dictionary with query parameters.
        Does not matter if the query parameters are POST or GET.
        Can handle JSON and URL encoded POST, otherwise the body is returned in a dictionare with the key post.
        :return: A dictionary with query parameters.
        """
        return HttpHandler.getQueryDictionary(self.environ)

    def getPath(self):
        """
        Get the requested path.
        :return: Path as a string
        """
        return self.environ.get('PATH_INFO', '').lstrip('/')

    def Http404(self):
        """
        WSGI HTTP 404 response.
        :return WSGI response for HTTP 404.
        """
        resp = NotFound()
        return resp(self.environ, self.start_response)
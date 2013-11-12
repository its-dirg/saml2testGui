# -*- coding: utf-8 -*-

import json
import subprocess
from saml2.httputil import Response, ServiceError

import glob
from os.path import basename
import os

__author__ = 'haho0032'

class Test:
    IDP_TESTDRV = '/usr/local/bin/idp_testdrv.py'
    CONFIG_FILE_PATH = 'saml2test/configFiles/'

    def __init__(self, environ, start_response, session, logger, lookup, config, parameters):
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
        self.config = config
        self.parameters = parameters
        self.urls = {
            "" : "index.mako",
            "list" : None,
            "config" : None,
            "run_test" : None
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
        elif path == "config":
            return self.handleConfigFiles()
        elif path == "run_test":
            return self.handleRunTest()


    def handleIndex(self, file):
        resp = Response(mako_template=file,
                        template_lookup=self.lookup,
                        headers=[])
        argv = {
            "a_value": "Hello world"
        }
        return resp(self.environ, self.start_response, **argv)


    def handleList(self):
        ok, p_out, p_err = self.runScript([self.IDP_TESTDRV,'-l'])

        allTests = json.loads(p_out)

        childTestsList = []
        rootTestsList = []

        for item in allTests:
            if not ('depend' in item):
                newDict = self.createNewTestDict(item)
                rootTestsList.append(newDict)
            else:
                childTestsList.append(item)


        parentList = rootTestsList

        while len(childTestsList) > 0:
            newParentTestsList = []
            newChildTestsList = []

            for item in parentList:
                for child in childTestsList:
                    dependId = child['depend']

                    if len(dependId) == 1:
                        dependId = str(dependId[0])
                    else:
                        pass
                        #Kasta ett fel.

                    if item['id'] == dependId:
                        newChild = self.createNewTestDict(child)
                        item["children"].append(newChild)
                        newParentTestsList.append(newChild)

            for child in childTestsList:
                convertedChild = self.createNewTestDict(child)

                if not (convertedChild in newParentTestsList):
                    newChildTestsList.append(child)
                #else:
                    #print child

            childTestsList = newChildTestsList
            parentList = newParentTestsList

        #print rootTestsList

        #for item in sortedList:
           # print item['id']

        test = [{"id": "Node", "children": []}]
        test[0]["children"].append({"id": "Node2", "children": []})


        if (ok):
            myJson = json.dumps(rootTestsList) #json.dumps([{"id": "Node", "children": [{"id": "Node2","children": [{"id": "Node4","children": []}]}, {"id": "Node3","children": []}]}])
        else:
            return self.serviceError("Cannot list the tests.")
        return self.returnJSON(myJson)


    def handleConfigFiles(self):
        self.checkForNewConfigFiles()
        configJSONString = json.dumps(self.config.IDPTESTENVIROMENT)
        return self.returnJSON(configJSONString)


    def handleRunTest(self):
        incommingParameters = self.parameters['testname']

        if self.checkIfParameterIsLeagal(incommingParameters):
            ok, p_out, p_err = self.runScript([self.IDP_TESTDRV,'-J', 'configFiles/target.json', incommingParameters], "./saml2test")

            if (ok):
                return self.returnJSON(p_out)
            else:
                return self.serviceError("Cannot run test")

        return self.serviceError("The test is not valid")

    def createNewTestDict(self, item):
        newDict = {}
        newDict['id'] = str(item["id"])
        newDict['children'] = []
        return newDict

    def checkForNewConfigFiles(self):
        listedIdpEnviroments = []

        for dictionary in self.config.IDPTESTENVIROMENT:
            listedIdpEnviroments.append(dictionary["Name"])

        configPaths = glob.glob(self.CONFIG_FILE_PATH + "*.json")

        for path in configPaths:
            filename = basename(path)
            filenameNoExtention = os.path.splitext(filename)[0]

            """
            if (filenameNoExtention in listedIdpEnviroments):
                print filenameNoExtention
            else:
                print filenameNoExtention + " not specified in server_conf"
            """

    def checkIfParameterIsLeagal(self, tmpTest):
        testToRun = None
        ok, p_out, p_err = self.runScript([self.IDP_TESTDRV, '-l'])
        tests = json.loads(p_out)
        for test in tests:
            if test["id"] == tmpTest:
                testToRun = test["id"]
        if testToRun is None:
            return False
        else:
            return True


    def returnJSON(self, text):
        resp = Response(text, headers=[('Content-Type', "application/json")])
        return resp(self.environ, self.start_response)


    def serviceError(self, message):
        message = {"ExceptionMessage": message}
        resp = ServiceError(json.dumps(message))
        return resp(self.environ, self.start_response)


    def runScript(self, command, working_directory=None):
        try:
            p = subprocess.Popen(command,
                                 stdout=subprocess.PIPE,
                                 stderr=subprocess.PIPE,
                                 cwd=working_directory)
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
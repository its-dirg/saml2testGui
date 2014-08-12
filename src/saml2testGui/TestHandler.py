# -*- coding: utf-8 -*-
import cgi
import copy

import json
import subprocess
from saml2.httputil import Response, ServiceError

import uuid
import ast
import tempfile
import urllib2

import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

__author__ = 'haho0032'

class Test:
    #Only used to check to check for new config files this which does nothing useful at the moment
    CONFIG_FILE_PATH = 'saml2test/configFiles/'
    CONFIG_KEY = "target"

    def __init__(self, environ, start_response, session, logger, lookup, config, parameters, cache):
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
            #Calles from test_idp
            "test_idp" : "test_idp.mako",
            "list_tests" : None,
            "run_test" : None,
            "post_final_interaction_data" : None,
            "post_basic_interaction_data" : None,
            "reset_interaction" : None,
            "post_error_report": None,

            #Calles from config
            "idp_config" : "idp_config.mako",
            "get_basic_config" : None,
            "post_basic_config" : None,
            "get_interaction_config" : None,
            "post_interaction_config" : None,
            "post_metadata_file" : None,
            "download_config_file" : None,
            "upload_config_file" : None,
            "create_new_config_file": None,
            "does_config_file_exist": None,
            "post_metadata_url": None,

            #Calles from home
            "" : "home.mako"
        }
        self.cache = cache

    def verify(self, path):
        for url, file in self.urls.iteritems():
            if path == url:
                return True


    def handle(self, path):
        """
        Handles the incoming rest requests
        :param path: The path to the file or function requested by the client
        :return A response which could be encode as Json for example
        """

        #Calles from test_idp
        if path == "test_idp":
            return self.handleShowPage(self.urls[path])
        elif path == "list_tests":
            return self.handleListTests()
        elif path == "run_test":
            return self.handleRunTest()
        elif path == "post_final_interaction_data":
            return self.handlePostFinalInteractionData()
        elif path == "post_basic_interaction_data":
            return self.handlePostBasicInteractionData()
        elif path == "reset_interaction":
            return self.handleResetInteraction()
        elif path == "post_error_report":
            return self.handlePostErrorReport()

        #Calles from config_idp
        elif path == "idp_config":
            return self.handleShowPage(self.urls[path])
        elif path == "get_basic_config":
            return self.handleGetBasicConfig()
        elif path == "post_basic_config":
            return self.handlePostBasicConfig()
        elif path == "get_interaction_config":
            return self.handleGetInteractionConfig()
        elif path == "post_interaction_config":
            return self.handlePostInteractionConfig()
        elif path == "post_metadata_file":
            return self.handlePostMetadataFile()
        elif path == "download_config_file":
            return self.handleDownloadConfigFile()
        elif path == "upload_config_file":
            return self.handleUploadConfigFile()
        elif path == "create_new_config_file":
            return self.handleCreateNewConfigFile()
        elif path == "does_config_file_exist":
            return self.handleDoesConfigFileExist()
        elif path == "post_metadata_url":
            return self.handlePostMetadataUrl()

        #Calls made from home
        elif path == "":
            return self.handleShowPage(self.urls[path])

    #TODO enter Dirgs mail settings
    def handlePostErrorReport(self):
        """
        Sends a error report which contains a message and the last test results to Dirgs mail
        :return A default value which should be ignored
        """
        reportEmail = self.parameters['reportEmail']
        reportMessage = self.parameters['reportMessage']
        testResults = self.parameters['testResults']

        fromAdress = reportEmail
        toAddress  = 'drig@example.com'

        message = MIMEMultipart()
        message['From'] = fromAdress
        message['To'] = toAddress
        message['Subject'] = "Error report (saml2test)"

        filename = "error_report.txt"
        attachment = MIMEText(testResults)
        attachment.add_header('Content-Disposition', 'attachment', filename=filename)
        message.attach(attachment)

        message.attach(MIMEText(reportMessage, 'plain'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login("gmail username", "gmail password")
        text = message.as_string()
        server.sendmail(fromAdress, toAddress, text)

        return self.returnJSON({"asd": 1})


    def handlePostMetadataUrl(self):
        """
        Saves the posted metadata into the configuration
        :return A default value which should be ignored
        """
        metadataUrl = self.parameters['metadataUrl']
        metadata = urllib2.urlopen(metadataUrl).read()
        self.addMetdataToSession(metadata)

        print "Post metadata url: " + self.session[self.CONFIG_KEY]
        return self.returnJSON({"asd": 1})


    def handleDoesConfigFileExist(self):
        """
        Handles the request checking if the configuration file exists
        :return Returns a dictionary {"doesConfigFileExist" : true} if the session contains a config file else {"doesConfigFileExist" : false}
        """
        result = json.dumps({"doesConfigFileExist": self.CONFIG_KEY in self.session})
        return self.returnJSON(result)


    def handleShowPage(self, file):
        """
        Handles the request for specific web page
        :param file: The name of the .mako file requested by the user
        :return The html page which is based on the .mako file
        """
        resp = Response(mako_template=file,
                        template_lookup=self.lookup,
                        headers=[])
        argv = {
            "a_value": "Hello world"
        }

        return resp(self.environ, self.start_response, **argv)


    def handleListTests(self):
        """
        Run the underlying script in order to get a list containing all available tests
        :return A list with all the available tests
        """
        if "handleList_result" not in self.cache:

            if "test_list" not in self.cache:
                ok, p_out, p_err = self.runScript([self.config.SAML2TEST_PATH, '-l'])
                if ok:
                    self.cache["test_list"] = p_out
            else:
                ok = True

            allTests = json.loads(self.cache["test_list"])

            childTestsList, rootTestsList = self.identifyRootTests(allTests)
            bottomUpTree = self.insertRemaningChildTestsBottomUp(childTestsList, rootTestsList)
            self.setupTestId(bottomUpTree)

            result = {
                "bottomUpTree": bottomUpTree,
            }

            self.cache["handleList_result"] = result
        else:
            result = self.cache["handleList_result"]
            ok = True

        if (ok):
            myJson = json.dumps(result)
        else:
            return self.serviceError("Cannot list the tests.")
        return self.returnJSON(myJson)


    def writeToConfig(self, password=None, username=None):
        """
        Write user login details to the config file
        :param password: Login password which should be added to interaction config block
        :param username: Login username which should be added to interaction config block
        """
        interactionParameters = self.session['interactionParameters']

        title = interactionParameters['title']
        redirectUri = interactionParameters['redirectUri']
        pageType = interactionParameters['pageType']
        controlType = interactionParameters['controlType']

        configFileAsString = self.session[self.CONFIG_KEY]
        configFileAsDict = ast.literal_eval(configFileAsString)

        #create the new interaction object based on the parameters
        if password == None and username == None:
            set = {}
        else:
            set = {"login": username, "password": password}

        newInteraction = [
            {
                "matches": {
                    "url": redirectUri,
                    "title": title
                },
                "page-type": pageType,
                "control": {
                    "index": 0,
                    "type": controlType,
                    "set": set
                }
            }
        ]

        if not('interaction' in configFileAsDict):
            configFileAsDict['interaction'] = []

        configFileAsDict['interaction'].extend(newInteraction)

        self.session[self.CONFIG_KEY] = json.dumps(configFileAsDict)


    def handlePostFinalInteractionData(self):
        """
        Adds the username and the password in order to complete the interaction gathering cycle
        :return Returns a script tags which tells the gui to make a post back
        """
        try:
            username = self.parameters['login'][0]
            password = self.parameters['password'][0]

            self.writeToConfig(password, username)
        except KeyError:
            self.writeToConfig()

        htmlString = "<script>parent.postBack();</script>"
        return self.returnHTML(htmlString)


    def handlePostBasicInteractionData(self):
        """
        Adds the basic interaction information which doesn't need users input
        :return Default response, should be ignored
        """
        title = self.parameters['title']
        redirectUri = self.parameters['redirectUri']
        pageType = self.parameters['pageType']
        controlType = self.parameters['controlType']

        self.session['interactionParameters'] = {"title": title, "redirectUri": redirectUri, "pageType": pageType, "controlType": controlType}

        return self.returnJSON({"asd": "asd"})


    def handleResetInteraction(self):
        """
        Removes previously collected interaction details
        :return Default response, should be ignored
        """
        targetStringContent = self.session[self.CONFIG_KEY]
        targetDict = ast.literal_eval(targetStringContent)
        targetDict['interaction'] = []
        self.session[self.CONFIG_KEY] = str(targetDict)

        return self.returnHTML("<h1>Data</h1>")


    def handleRunTest(self):
        """
        Executes a test
        :return The result of the executed test
        """
        testToRun = self.parameters['testname']

        if 'testid' in self.parameters:
            testid = self.parameters['testid']
        else:
            testid = None

        if self.checkIfIncommingTestIsLeagal(testToRun):

            try:
                targetStringContent = self.session[self.CONFIG_KEY]
                targetDict = ast.literal_eval(targetStringContent)
            except ValueError:
                return self.serviceError("No configurations available. Add configurations and try again")

            outfile = tempfile.NamedTemporaryFile()

            json.dump(targetDict, outfile)
            outfile.flush()

            #Directs to the folder containing the saml2test config file
            ok, p_out, p_err = self.runScript([self.config.SAML2TEST_PATH,'-J', outfile.name, '-d', testToRun], "./saml2test")

            outfile.close()

            result = ""
            try:
                if len(p_out) > 0:
                    result = json.loads(p_out)
            except ValueError:
                return self.serviceError("saml2test is not returning json. Verify that saml2test is working correct!")
            try:
                if (ok):
                    response = {
                        "result": result,
                        "traceLog": cgi.escape(unicode(p_err, errors='replace')),
                        "testid": testid
                    }
                    return self.returnJSON(json.dumps(response))
                else:
                    return self.serviceError("Failed to run test")
            except ValueError:
                return self.serviceError("The configuration couldn't be decoded, it's possible that the metadata isn't correct. Check that the configurations is correct and try again.");

        return self.serviceError("The test is not valid")

    def handleGetBasicConfig(self):
        """
        :return: Basic configuration stored in the session
        """
        if self.CONFIG_KEY in self.session:
            configString = self.session[self.CONFIG_KEY]
            configDict = ast.literal_eval(configString)
            basicConfig = {"entity_id": configDict['entity_id'], "name_format": configDict['name_format']}
            return self.returnJSON(json.dumps(basicConfig))
        return self.serviceError("No configuration has been uploaded")


    def handlePostBasicConfig(self):
        """
        Stores the basic configuration in the session object.
        :return A default value which should be ignored
        """
        targetStringContent = self.session[self.CONFIG_KEY]
        targetDict = ast.literal_eval(targetStringContent)

        targetDict["entity_id"] = self.parameters['entityID']
        targetDict["name_format"] = self.parameters['name_format']
        targetAsString = str(targetDict)

        self.session[self.CONFIG_KEY] = targetAsString

        print "Post basic config: " + self.session[self.CONFIG_KEY]
        return self.returnJSON({"asd": 1})


    def handleGetInteractionConfig(self):
        """
        :return: Interaction configurations stored in the session object
        """
        if self.CONFIG_KEY in self.session:
            configString = self.session[self.CONFIG_KEY]
            configDict = ast.literal_eval(configString)

        interactionConfigList = self.addListIndexToInteractionBlockList(configDict)

        return self.returnJSON(json.dumps(interactionConfigList))


    def handlePostInteractionConfig(self):
        """
        Stores the interaction blocks int the session object
        :return Default response, should be ignored
        """
        interactionList = self.parameters['interactionList']
        interactionConfigList = []

        for entry in interactionList:
            interactionConfigList.append(entry['entry'])

        configString = self.session[self.CONFIG_KEY]
        configDict = ast.literal_eval(configString)

        configDict["interaction"] = interactionConfigList
        self.session[self.CONFIG_KEY] = json.dumps(configDict)

        print "Post interaction config: " + self.session[self.CONFIG_KEY]
        return self.returnJSON({"asd": 1})


    def addMetdataToSession(self, metadata):
        """
        Adds metadata to session
        :param metadata: Metadata which should be stored on the server
        """
        if (metadata.startswith('<?xml')):
            metadata = metadata.replace('\n', "")
            metadata = metadata.replace('\"', "\'")

            configString = self.session[self.CONFIG_KEY]
            configDict = ast.literal_eval(configString)

            configDict["metadata"] = ""

            newConfigString = json.dumps(configDict)
            newConfigString = newConfigString.replace("\"metadata\": \"\"", "\"metadata\": \"" + metadata + "\"")

            self.session[self.CONFIG_KEY] = newConfigString


    def handlePostMetadataFile(self):
        """
        Stores the metadata uploaded to the server
        """
        metadata = str(self.parameters['metadataFile'])

        self.addMetdataToSession(metadata)

        print "Post metadata file: " + self.session[self.CONFIG_KEY]
        return self.returnJSON({"asd": 1})


    def handleCreateNewConfigFile(self):
        """
        Creates a new config file based on a temple and saves it in the session
        :return Default response, should be ignored
        """
        templateFile = open("src/saml2testGui/template_config.json", "r")

        try:
            configString = templateFile.read()
            configDict = ast.literal_eval(configString)
            self.session[self.CONFIG_KEY] = str(configDict)
        finally:
            templateFile.close()

        print "Create: " + self.session[self.CONFIG_KEY]
        return self.returnJSON({"asd": 1})


    def handleUploadConfigFile(self):
        """
        Adds a uploaded config file to the session
        :return Default response, should be ignored
        """
        self.session[self.CONFIG_KEY] = str(self.parameters['configFileContent'])
        print "Upload target: " + self.session[self.CONFIG_KEY]
        return self.returnJSON({"target": "asd"})


    def handleDownloadConfigFile(self):
        """
        :return Return the configuration file stored in the session
        """
        configString = self.session[self.CONFIG_KEY]
        configDict = ast.literal_eval(configString)
        fileDict = json.dumps({"configDict": configDict})

        print "Download target: " + self.session[self.CONFIG_KEY]
        return self.returnJSON(fileDict)


    def checkIfKeyExistsOrSetDefaultValue(self, key, dict, defaultValue):
        """
        Checks if the incoming key exists in dict or sets default value
        :param key: The key to look up in the dictionary
        :param dict: The dictionary which should be looked up
        :param defaultValue: If the key does not this value will be returned
        :return: The value corresponding to the incoming key value or the default value
        """
        if key in dict:
            return dict[key]
        return defaultValue


    def addListIndexToInteractionBlockList(self, targetDict):
        """
        Adds indexes to the configuration list
        :param targetDict:
        :return: A list of interaction blocks where every block has a specific index
        """
        if not('interaction' in targetDict):
            targetDict['interaction'] = []

        interactionList = targetDict['interaction']
        newInteractionList = []

        loopIndex = 0;
        for entry in interactionList:
            entry['control']['index'] = self.checkIfKeyExistsOrSetDefaultValue("index", entry['control'], 0)
            entry['control']['set'] = self.checkIfKeyExistsOrSetDefaultValue("set", entry['control'], {})

            entry = {"id": loopIndex,
                     "entry": entry
            }

            newInteractionList.append(entry)
            loopIndex += 1
        return newInteractionList


    def createNewTestDict(self, testItem, level=1):
        """
        Creates a new test dictionary
        :param testItem: The test item on which the new test dict should be based upon
        :param level: The level of the test or sub-test are 1 by default
        :return: The new test dict
        """
        newDict = {}
        newDict['id'] = str(testItem["id"])
        newDict['children'] = []
        newDict['level'] = level
        newDict['testid'] = ""
        newDict['descr'] = str(testItem["name"]) #TODO "name" ska bytas up mot "descr" men alla test innehåller inte dessa attribut
        return newDict


    def identifyRootTests(self, allTests):
        """
        Identifies the root tests which is all test which doesn't depend on any other test
        :param allTests: A list containing all tests
        :return First it returns a list containing all test tests which depend on other tests. Secondly it returns a
                list containing all root tests.
        """
        childTestsList = []
        rootTestsList = []
        for item in allTests:
            if not ('depend' in item):
                newDict = self.createNewTestDict(item)
                rootTestsList.append(newDict)
            else:
                childTestsList.append(item)
        return childTestsList, rootTestsList


    def setupTestId(self, tree, visible=True):
        """
        Gives every test a unique id add show the root nodes
        :param tree: The tree which should be traversed
        :param visible: Boolean which indicates if the tree node should be visible or not.
        """
        for element in tree:
            element["visible"] = visible
            element["testid"] = uuid.uuid4().urn
            if element["children"] is not None and len(element["children"])>0:
                self.setupTestId(element["children"], False)


    def insertRemaningChildTestsBottomUp(self, childTestsList, leafTestList):
        """
        Inserts the child node according to bottom up tree parsing algorithm
        :param childTestsList: The child tests which depends on other tests
        :param leafTestList: Leaf test are tests that no other test depends upon
        """
        tree = []

        while len(leafTestList) > 0:
            newleafTestsList = []
            leafsToRemove = []

            for leaf in leafTestList:
                for child in childTestsList:
                    parentList = child['depend']

                    for parent in parentList:
                        parent = str(parent)

                        if leaf['id'] == parent:
                            newChild = self.createNewTestDict(child)
                            newChild["children"].append(copy.deepcopy(leaf))
                            newChild["hasChildren"] = True
                            #Gå igenom alla barn och uppdatera deras level med 1
                            self.updateChildrensLevel(newChild);

                            newleafTestsList.append(newChild)
                            leafsToRemove.append(leaf)

            for leaf in leafTestList:
                if not (leaf in leafsToRemove):
                    tree.append(leaf)

            leafTestList = newleafTestsList

        return tree


    def updateChildrensLevel(self, child):
        """
        Updates the level of a specific test
        :param child: The test who level should be updated
        """
        childrenList = child['children']
        for unvisitedChild in childrenList:
            unvisitedChild['level'] = child['level'] + 1
            self.updateChildrensLevel(unvisitedChild)


    def getChildren(self, child):
        """
        :return Collects and returns all children and sub children of a given node
        """
        childrenToVisitList = child['children']
        allChildren = []

        while len(childrenToVisitList) > 0:
            newChildrenToVisitList = []
            for childToVisit in childrenToVisitList:
                grandchildren = childToVisit['children']
                for grandChild in grandchildren:
                    newChildrenToVisitList.append(grandChild)
                childToVisit['children'] = []
                childToVisit['hasChildren'] = False
                childToVisit['level'] = 2
                allChildren.insert(0, childToVisit)

            childrenToVisitList = newChildrenToVisitList
        return allChildren


    def updateChildrensLevelFlat(self, child):
        childrenList = child['children']
        for unvisitedChild in childrenList:
            if (child['level'] + 1) > 2:
                unvisitedChild['level'] = 2;
            else:
                unvisitedChild['level'] = child['level'] + 1
            self.updateChildrensLevel(unvisitedChild)


    def checkIfIncommingTestIsLeagal(self, tmpTest):
        testToRun = None
        if "verify_test_dict" not in self.cache:
            self.cache["verify_test_dict"] = {}
            if "test_list" not in self.cache:
                ok, p_out, p_err = self.runScript([self.config.SAML2TEST_PATH, '-l'])
                if ok:
                    self.cache["test_list"] = p_out
            tests = json.loads(self.cache["test_list"])
            for test in tests:
                self.cache["verify_test_dict"][test["id"]] = True
                #if test["id"] == tmpTest:
                #    testToRun = test["id"]
        if tmpTest in self.cache["verify_test_dict"] and self.cache["verify_test_dict"][tmpTest] is True:
            return True
        else:
            return False


    def returnJSON(self, text):
        resp = Response(text, headers=[('Content-Type', "application/json")])
        return resp(self.environ, self.start_response)


    def returnHTML(self, text):
        resp = Response(text, headers=[('Content-Type', "text/html")])
        return resp(self.environ, self.start_response)


    def returnXml(self, text):
        resp = Response(text, headers=[('Content-Type', "text/xml")])
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
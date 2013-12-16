# -*- coding: utf-8 -*-
import cgi
import copy

import json
import shutil
import subprocess
from saml2.httputil import Response, ServiceError

import glob
from os.path import basename
import os
import uuid
import ast
from xml.etree import ElementTree

__author__ = 'haho0032'

class Test:
    IDP_TESTDRV = '/usr/local/bin/idp_testdrv.py'
    #Only used to check to check for new config files this which does nothing useful for the moment
    CONFIG_FILE_PATH = 'saml2test/configFiles/'
    TARGET_KEY = "target"

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
            "" : "index.mako",
            "list" : None,
            "config" : None,
            "run_test" : None,
            "final_target_data" : None,
            "basic_target_data" : None,
            "reset_target_data" : None,
            "test_config" : "config.mako",
            "get_basic_config" : None,
            "post_basic_config" : None,
            "get_interaction_config" : None,
            "post_interaction_config" : None,
            "post_metadata" : None,
            "temp_reset_target_json" : None,
            "download_target_json" : None,
            "upload_target_json" : None
        }
        self.cache = cache



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
        elif path == "final_target_data":
            return self.handleFinalTargetData()
        elif path == "basic_target_data":
            return self.handleBasicTargetData()
        elif path == "reset_target_data":
            return self.handleResetTargetData()
        elif path == "test_config":
            return self.handleTestConfig(self.urls[path])
        elif path == "get_basic_config":
            return self.handleGetBasicConfig()
        elif path == "post_basic_config":
            return self.handlePostBasicConfig()
        elif path == "get_interaction_config":
            return self.handleGetInteractionConfig()
        elif path == "post_interaction_config":
            return self.handlePostInteractionConfig()
        elif path == "post_metadata":
            return self.handlePostMetadata()
        elif path == "temp_reset_target_json":
            return self.handleResetTargetJson()
        elif path == "download_target_json":
            return self.handleDownloadTargetJson()
        elif path == "upload_target_json":
            return self.handleUploadTargetJson()

    def handleResetTargetJson(self):

        f = open(self.CONFIG_FILE_PATH + "/config_backup/target.json", "r")
        try:
            targetStringContent = f.read()
            targetDict = ast.literal_eval(targetStringContent)
            self.session[self.TARGET_KEY] = str(targetDict)
        finally:
            f.close()

        print "Reset: " + self.session[self.TARGET_KEY]
        return self.returnJSON({"asd": 1})

    def handleUploadTargetJson(self):

        self.session[self.TARGET_KEY] = str(self.parameters['targetFileContent'])

        print "Upload target: " + self.session[self.TARGET_KEY]
        return self.returnJSON({"target": "asd"})


    def handleDownloadTargetJson(self):

        if self.session[self.TARGET_KEY] != None:

            targetStringContent = self.session[self.TARGET_KEY]
            targetDict = ast.literal_eval(targetStringContent)
            fileDict = json.dumps({"target": targetDict})

            print "Download target: " + self.session[self.TARGET_KEY]
            return self.returnJSON(fileDict)

        return self.serviceError("No target configurations stored in the session")

    def handleIndex(self, file):
        resp = Response(mako_template=file,
                        template_lookup=self.lookup,
                        headers=[])
        argv = {
            "a_value": "Hello world"
        }

        #TODO this should be removed since the target file shouldn't be replaced ever time the site is loaded
        #shutil.copyfile(self.CONFIG_FILE_PATH + "/backup/target.json", self.CONFIG_FILE_PATH + "target.json")

        return resp(self.environ, self.start_response, **argv)

    def handleTestConfig(self, file):

        resp = Response(mako_template=file,
                        template_lookup=self.lookup,
                        headers=[])

        argv = {
            "a_value": "Hello world"
        }

        return resp(self.environ, self.start_response, **argv)


    def handleList(self):
        #Gör en knapp som ändrar synen på trädet
        #showBottomUp = self.parameters['treeType']
        if "handleList_result" not in self.cache:

            if "test_list" not in self.cache:
                ok, p_out, p_err = self.runScript([self.IDP_TESTDRV, '-l'])
                if ok:
                    self.cache["test_list"] = p_out
            else:
                ok = True
            #ok, p_out, p_err = self.runScript([self.IDP_TESTDRV, '-l'])
            allTests = json.loads(self.cache["test_list"])

            childTestsList, rootTestsList = self.identifyRootTests(allTests)

            topDownChildList = copy.deepcopy(childTestsList)
            topDownRootList = copy.deepcopy(rootTestsList)

            topDownTree = self.insertRemaningChildTestsTopdown(topDownChildList, topDownRootList)
            bottomUpTree = self.insertRemaningChildTestsBottomUp(childTestsList, rootTestsList)

            self.setupTestId(topDownTree)
            self.setupTestId(bottomUpTree)

            flatBottomUpTree = self.convertToFlatBottomTree(bottomUpTree)

            result = {
                "topDownTree": topDownTree,
                "bottomUpTree": bottomUpTree,
                "flatBottomUpTree": flatBottomUpTree
            }

            self.cache["handleList_result"] = result
        else:
            result = self.cache["handleList_result"]
            ok = True
        #currentFlattenedTree = [{'id': 'verify', 'level': '1', 'children': [{'id': 'authn', 'level': '2', 'children': [{'id': 'authn-post', 'level': '3', 'children': [{'id': 'authn-post-transient', 'level': '4', 'children': []}]}]}]}, {'id': 'ecp_authn', 'level': '1' , 'children': []}]

        if (ok):
            myJson = json.dumps(result) #json.dumps([{"id": "Node", "children": [{"id": "Node2","children": [{"id": "Node4","children": []}]}, {"id": "Node3","children": []}]}])
        else:
            return self.serviceError("Cannot list the tests.")
        return self.returnJSON(myJson)

    def handleConfigFiles(self):
        self.checkForNewConfigFiles()
        configJSONString = json.dumps(self.config.IDPTESTENVIROMENT)
        return self.returnJSON(configJSONString)

    def writeToTargetConfig(self, password=None, username=None):

        interactionParameters = self.session['interactionParameters']

        title = interactionParameters['title']
        redirectUri = interactionParameters['redirectUri']
        pageType = interactionParameters['pageType']
        controlType = interactionParameters['controlType']

        targetContent = self.session[self.TARGET_KEY]
        targetJson = json.loads(targetContent)

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

        if (targetJson.get('interaction') == None):
            targetJson['interaction'] = []

        targetJson['interaction'].extend(newInteraction)

        self.session[self.TARGET_KEY] = str(json.dumps(targetJson))



    def handleFinalTargetData(self):

        try:
            username = self.parameters['login'][0]
            password = self.parameters['password'][0]

            self.writeToTargetConfig(password, username)
        except KeyError:
            self.writeToTargetConfig()

        htmlString = "<script>parent.postBack();</script>"

        return self.returnHTML(htmlString)

    def handleBasicTargetData(self):
        title = self.parameters['title']
        redirectUri = self.parameters['redirectUri']
        pageType = self.parameters['pageType']
        controlType = self.parameters['controlType']

        self.session['interactionParameters'] = {"title": title, "redirectUri": redirectUri, "pageType": pageType, "controlType": controlType}

        return self.returnJSON({"asd": "asd"})

    #TODO Rmove this method it should not be nesseccery
    def handleResetTargetData(self):
        shutil.copyfile(self.CONFIG_FILE_PATH + "/backup/target.json", self.CONFIG_FILE_PATH + "target.json")
        return self.returnHTML("<h1>Data</h1>")

    def handleRunTest(self):
        testToRun = self.parameters['testname']
        targetFile = self.parameters['targetFile']

        if 'testid' in self.parameters:
            testid = self.parameters['testid']
        else:
            testid = None

        targetFile = targetFile.strip(' \n\t')

        if self.checkIfParamentersAreValid(targetFile, testToRun):
            #Directs to the folder containing the saml2test config file an enters the target.json files as a parameter to the test script
            #TODO Create a temp file which could be sent into the IDP_TESTDRV
            ok, p_out, p_err = self.runScript([self.IDP_TESTDRV,'-J', 'configFiles/'+ targetFile + '.json', testToRun], "./saml2test")

            #self.formatOutput(p_out)

            try:
                if (ok):
                    response = {
                        "result": json.loads(p_out),
                        "errorlog": cgi.escape(p_err),
                        "testid": testid
                    }
                    return self.returnJSON(json.dumps(response))
                else:
                    return self.serviceError("Cannot run test")
            except ValueError:
                return self.serviceError("Target.json couldn't be decoded, try to upload a new version")

        return self.serviceError("The test is not valid")

    #def formatOutput(self, p_out):
        #print (p_out[0])
        #returnValue = ""
        #for test in p_out:
           #print test.status

    def handleGetBasicConfig(self):


        if self.session[self.TARGET_KEY] != None:
            targetStringContent = self.session[self.TARGET_KEY]
            targetDict = ast.literal_eval(targetStringContent)

            basicConfig = {"metadata": "Find a way to handle metadata!!", "entity_id": targetDict['entity_id']}

            return self.returnJSON(json.dumps(basicConfig))

        return self.serviceError("No target configurations stored in the session")

    def handlePostBasicConfig(self):

        targetStringContent = self.session[self.TARGET_KEY]
        targetDict = ast.literal_eval(targetStringContent)

        targetDict["entity_id"] = self.parameters['entityID']
        targetAsString = str(targetDict)

        self.session[self.TARGET_KEY] = targetAsString

        print "Post basic config: " + self.session[self.TARGET_KEY]
        return self.returnJSON({"asd": 1})


    def handleGetInteractionConfig(self):

        if self.session[self.TARGET_KEY] != None:

            targetStringContent = self.session[self.TARGET_KEY]
            targetDict = ast.literal_eval(targetStringContent)

            interactionConfigList = self.createInteractionConfigList(targetDict)

            return self.returnJSON(json.dumps(interactionConfigList))


    def handlePostInteractionConfig(self):

        entryList = self.parameters['convertedInteractionList']
        interactionConfigList = []

        for entry in entryList:
            interactionConfigList.append(entry['entry'])

        targetStringContent = self.session[self.TARGET_KEY]
        targetDict = ast.literal_eval(targetStringContent)

        targetDict["interaction"] = interactionConfigList
        newTargetAsString = json.dumps(targetDict)
        self.session[self.TARGET_KEY] = newTargetAsString

        print "Post interaction config: " + self.session[self.TARGET_KEY]
        return self.returnJSON({"asd": 1})

    def handlePostMetadata(self):

        metadata = str(self.parameters['metadata'])

        if(metadata.startswith( '<?xml' )):

            targetStringContent = self.session[self.TARGET_KEY]
            targetDict = ast.literal_eval(targetStringContent)

            targetDict["metadata"] = ""

            targetString = json.dumps(targetDict)
            targetString =  targetString.replace("\"metadata\": \"\"", "\"metadata\": \"" + metadata + "\"")

            self.session[self.TARGET_KEY] = targetString

        print "Post metadata: " + self.session[self.TARGET_KEY]
        return self.returnJSON({"asd": 1})

    def createInteractionConfigList(self, targetDict):
        interactionElemetList = targetDict['interaction']
        interactionConfigList = []
        loopIndex = 0;
        for entry in interactionElemetList:

            entry = {"id": loopIndex,
                     "entry": entry
            }
            interactionConfigList.append(entry)
            loopIndex += 1
        return interactionConfigList

    def setDefaultValueToDictionary(self, key, dictionary):
        if key in dictionary.keys():
            return dictionary[key]
        else:
            return ""

    def createNewTestDict(self, item, level=1):
        newDict = {}
        newDict['id'] = str(item["id"])
        newDict['children'] = []
        newDict['level'] = level
        newDict['testid'] = ""
        newDict['descr'] = str(item["name"]) #"name" ska bytas up mot "descr" men alla test innehåller inte dessa attribut
        return newDict


    def identifyRootTests(self, allTests):
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
        for element in tree:
            element["visible"] = visible
            element["testid"] = uuid.uuid4().urn
            if element["children"] is not None and len(element["children"])>0:
                self.setupTestId(element["children"], False)


    def insertRemaningChildTestsBottomUp(self, childTestsList, leafTestList):
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
        childrenList = child['children']
        for unvisitedChild in childrenList:
            unvisitedChild['level'] = child['level'] + 1
            self.updateChildrensLevel(unvisitedChild)

    def convertToFlatBottomTree(self, bottomUpTree):
        flatBottomUpTree = []
        for rootTest in bottomUpTree:
            newTest = copy.deepcopy(rootTest)
            children = self.getChildren(newTest)
            newTest['children'] = children
            flatBottomUpTree.append(newTest)
        return flatBottomUpTree

    def getChildren(self, child):
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


    def insertRemaningChildTestsTopdown(self, childTestsList, parentList):
        tree = parentList #Tree will be correct since it working on pointers.

        while len(childTestsList) > 0:
            newParentTestsList = []
            newChildTestsList = []

            for parent in parentList:
                for child in childTestsList:
                    parentID = child['depend']

                    if len(parentID) == 1:
                        parentID = str(parentID[0])
                    else:
                        pass
                        #Kasta ett fel.

                    if parent['id'] == parentID:
                        childLevel = parent["level"] + 1
                        newChild = self.createNewTestDict(child, childLevel)
                        parent["children"].append(newChild)
                        parent["hasChildren"] = True
                        newParentTestsList.append(newChild)

            for child in childTestsList:
                for newParent in newParentTestsList:
                    if not (child['id'] == newParent['id']):
                        if not (child in newChildTestsList):
                            newChildTestsList.append(child)


            childTestsList = newChildTestsList
            parentList = newParentTestsList
        return tree

    def getListedIdpEnviroments(self):
        listedIdpEnviroments = []
        for dictionary in self.config.IDPTESTENVIROMENT:
            listedIdpEnviroments.append(dictionary["Name"])
        return listedIdpEnviroments

    def checkForNewConfigFiles(self):
        listedIdpEnviroments = self.getListedIdpEnviroments()

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


    def checkIfParamentersAreValid(self, targetFile, testToRun):
        listedIdpEnviroments = self.getListedIdpEnviroments();

        if targetFile in listedIdpEnviroments:
            if self.checkIfIncommingTestIsLeagal(testToRun):
                return True


    def checkIfIncommingTestIsLeagal(self, tmpTest):
        testToRun = None
        if "verify_test_dict" not in self.cache:
            self.cache["verify_test_dict"] = {}
            if "test_list" not in self.cache:
                ok, p_out, p_err = self.runScript([self.IDP_TESTDRV, '-l'])
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
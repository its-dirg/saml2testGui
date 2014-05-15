Run
####

Go to your SAML2testGui folder and open a terminal enter::

    python server.py server_conf

Create saml2test configuration for an idp:
******************************************

In order to run tests you have to create or upload an saml2test configuration for an idp. To do this you need to start the server.

#. Open a web browser go to:
#. https://[server url]:[server port]
#. Click on the tab called "Configure Idp"
#. Click on "Create configurations"
#. Upload the IDPs metadata
#. Enter entity_id
#. You shouldn't need to change the name_format
#. Remove the generated interaction-block, in some cases the application can gather this information by itself.


Start simple test idp:
**********************

Insert info/link for how to start a simple IDP

Run test:

Now you should be able to run tests.

#. Go to the page named "Test idp"
#. Run one or multiple tests
#. If you didn't add any interaction-blocks the application will most likely ask whether to gather the information by itself or not.
Note that while gathering information you need to run the test multiple time until all the information has been gathered.


Testing different IDP's:
************************
If you want to test different IDP's you need to create a “Test Target Configuration File” for every IDP.
This could be done manually, see `How to use SAML2test <https://dirg.org.umu.se/page/saml2test>`_, it's also possible to use "Configure IDP" page in the web interface.

Don't forget to upload the saml2test's metadata to the IDP you want to test.

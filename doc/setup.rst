Setup SAML2testGui:
###################

Configurate the server:
***********************

    #. Go to your SAML2testGui folder rename the file **server_conf.py.example** it should be named **server_conf.py**
    #. Open the server_conf.py
    #. If you want to use https you need certificates.
        * If you have access to production certificates you need to point them out. Point out all your certificates in the variables SERVER_CERT, SERVER_KEY and CERT_CHAIN.
        * If you do not have any production certificates you can generate self signed certificates by running the script [..]/httpsCert/create_key.sh. If you use this method the server_conf.py file need no changes.
        * To activate https you also need to set the variable HTTPS to True.
    #. You must take a look at all the settings in server_conf.py and adjust them for your needs.
    #. Set BASEURL to the url you want to use for the test tool
    #. Set PORT to the port you want to use. If HTTPS is True, this is your https port.

Generate test tool metadata:
----------------------------

    #. Open the saml2test folder ([your path]/saml2test/tests/idp_test)
    #. Copy the config.py.example
    #. Rename the copy config.py
    #. Edit the file. The most important information is:
        * BASE = the url too the test tool and port
        * Entity id
        * And the path to the Key and Certificate files
    #. Open a terminal
    #. Go to the folder [...]/saml2test/tests/idp_test
    #. Enter::

        make_metadata.py config.py > test_tool_metadata.xml

Configurate a simple test IDP:
******************************

In order to do this you need the pyoidc application. If you installed the application by using Yais the script should have asked whether you wanted to configure an test idp or not. By using Yais it's possible to reconfigure the idp by executing the script called configureSaml.sh.

    1. Open a terminal and enter::

        cd [your path]/yais/scipt/
        ./configureSaml.sh [path to the folder containing pysaml2]

    4. Follow the instuctions on the screen.

In order to configurate the idp without yais:

    1. Go to [your path]/pysaml2/example/idp2/
    2. Rename the file idp_conf.py.example to idp_conf.py
    3. Open the file idp_conf.py
    4. Edit the necessary information, the most inportant infomation is the:
        * Base which is the idp url and port number
        * Metadata which is the path to saml2test tools metadata file
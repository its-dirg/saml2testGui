Overview
========

What is SAML2testGui?
---------------------

It's a web based interface used which in combination with the SAML2test tool will allow an independent validation of a
specific instance of a SAML2 entity. It will test not only if the instance works according to the SAML2 standard but
also if it complies with a specific profile of SAML2.

Functionality test idp site:
---------------------------

* List all available tests supported by the SAML2test tool
* Tests will be pressented in a tree layout, where the leaf nodes doesn't depend on any other test.
* Tests could be executed at three levels:
    * Run a single test,
    * Run test and subtests
    * Run all available tests
* Overview of the test result are presented by color coding and in text
* Detailed result view and a trace log
* Export result to to a text or Excel file
* Send error reports to the developers, the result will be attached to the report
* If no interaction information is avaliable the application could sometimes collect the nessesary data.

Functionality configurate idp site:
-----------------------------------

* Create new configuration in the web browser
* Upload configuration file
* Download configuration file
* Upload metadata by file
* Upload metadata by url
* Add/remove interaction blocks, used to log on to an idp
* Edit other configuration details
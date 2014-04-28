Install
#######

This is a guide of how to install Saml2test

How to install SAML2testGui:
===========================

There are two ways to install the saml2testGui. First of you could install saml2testGui and all applications on which it depends manually. If you are running debian you could use an install script called Yais.

Manually:
---------

Linux/Mac:

    Open a terminal and enter::

        git clone https://github.com/its-dirg/saml2testGui [your local path]
        cd [your path]
        sudo python setup.py install

Dependencies:
^^^^^^^^^^^^^

The SAML2testGui depends on two applications: dirg-util, SAML2test

Install dirg-util
"""""""""""""""""

Linux/Mac:

    Open a terminal and enter::

        git clone https://github.com/its-dirg/dirg-util [your path]
        cd [your path]
        sudo python setup.py install

Install SAML2test:
"""""""""""""""""

Linux/Mac:

    Open a terminal and enter::

        git clone https://github.com/rohe/saml2test [your path]
        cd [your path]
        sudo python setup.py install

 If you want to setup a simple test idp it's recommended that you install pysaml2 a well.

Install pysaml2:
"""""""""""""""""

Linux/Mac:

    Open a terminal and enter::

        git clone https://github.com/rohe/pysaml2 [your path]
        cd [your path]
        sudo python setup.py install

Yais:
----

If you use linux (debian / raspberry pi) you can use Yais to install SAML2testGui. The big advantage with Yais is that
it installs all projects on which Saml2testGui depends.

Install yais:
^^^^^^^^^^^^^

Linux/Mac:

    Open a terminal and enter::

        git clone https://github.com/its-dirg/yais [your path]
        cd [your path]
        sudo python setup.py install
        cd [your path]/yais/script
        ./yaisLinux.sh

On the question "Do you want to install SAML2test (Y/n):", type Y. If you want a simple test idp you should install the pysaml2 too. Every thing else should be ignored, by typing n.
The script will install SAML2testGui and all the application on which it depends.

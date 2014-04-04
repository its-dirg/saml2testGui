#!/bin/sh
rm -f saml2testGui*
sphinx-apidoc -F -o ../doc/ ../src/saml2testGui
make clean
make html
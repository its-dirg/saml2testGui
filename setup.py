# -*- coding: utf-8 -*-
from setuptools import setup

setup(
    name="saml2testGui",
    version="0.1",
    description='Gui for ',
    author = "Hans, Hoerberg och Daniel Evertsson",
    author_email = "hans.horberg@umu.se, daniel.evertsson@umu.se",
    license="Apache 2.0",
    packages=['saml2testGui'],
    package_dir = {"": "src"},
    classifiers = ["Development Status :: 4 - Beta",
        "License :: OSI Approved :: Apache Software License",
        "Topic :: Software Development :: Libraries :: Python Modules"],
    install_requires = ['requests', 'saml2test',
                        "cherrypy==3.2.4", "mako", "pyjwkest", "beaker"],

    zip_safe=False,
)
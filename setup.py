from distutils.core import setup

setup(
    name="saml2testGui",
    version="0.1",
    description='Gui for ',
    author = "Hans, Hörberg och Daniel Evertsson",
    author_email = "hans.horberg@umu.se, daniel.evertsson@umu.se",
    license="Apache 2.0",
    packages=[],
    package_dir = {"": "src"},
    classifiers = ["Development Status :: 4 - Beta",
        "License :: OSI Approved :: Apache Software License",
        "Topic :: Software Development :: Libraries :: Python Modules"],
    install_requires = ['requests', 'saml2test',
                        "cherrypy", "mako", "pyjwkest", "beaker"],

    zip_safe=False,
)
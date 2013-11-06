# -*- coding: utf-8 -*-
__author__ = 'haho0032'
'''
The session class can be used as a session dictionary.

    session = Session(environ)
    print session["test"]
    session["test"] = 1

This makes it hard to know which parameter that can be used.

Use getters and setters to make it more easy to understand the content.
'''
class Session:
    BEAKER = 'beaker.session'

    def __init__(self, environ):
        self.environ = environ

    def clearSession(self):
        session = self.environ[Session.BEAKER]
        for key in session:
            session.pop(key, None)
        session.save()

    def __setitem__(self, item, val):
        if item not in self.environ[Session.BEAKER]:
            self.environ[Session.BEAKER].get(item, val)
        self.environ[Session.BEAKER][item] = val

    def __getitem__(self, item):
        return self.environ[Session.BEAKER].get(item, None)

    def __contains__(self, item):
        return item in self.environ[Session.BEAKER]


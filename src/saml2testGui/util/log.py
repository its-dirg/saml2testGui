# -*- coding: utf-8 -*-
__author__ = 'haho0032'
import logging
from logging.handlers import BufferingHandler


def create_logger(filename):
    """
    Creates a logger with a given filename.
    :param filename: File name for the log
    :return: A logger class.
    """
    logger = logging.getLogger("")
    LOGFILE_NAME = filename
    hdlr = logging.FileHandler(LOGFILE_NAME)
    base_formatter = logging.Formatter(
        "%(asctime)s %(name)s:%(levelname)s %(message)s")
    CPC = ('%(asctime)s %(name)s:%(levelname)s '
           '[%(client)s,%(path)s,%(cid)s] %(message)s')
    cpc_formatter = logging.Formatter(CPC)
    hdlr.setFormatter(base_formatter)
    logger.addHandler(hdlr)
    logger.setLevel(logging.DEBUG)
    _formatter = logging.Formatter(CPC)
    fil_handl = logging.FileHandler(LOGFILE_NAME)
    fil_handl.setFormatter(_formatter)

    buf_handl = BufferingHandler(10000)
    buf_handl.setFormatter(_formatter)
    return logger

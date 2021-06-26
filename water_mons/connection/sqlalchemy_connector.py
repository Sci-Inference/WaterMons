import numpy as np
from sqlalchemy import create_engine
from water_mons.connection.data_schema import *
from sqlalchemy.ext.declarative import declarative_base


class DBConnector(object):
    def __init__(self,conString:str) -> None:
        super().__init__()
        self.con = create_engine(conString)
        self.Base = Base


    def declare_schema(self):
        self.Base.metadata.create_all(self.con,checkfirst=True)


    
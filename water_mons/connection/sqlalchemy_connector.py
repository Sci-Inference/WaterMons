import datetime
import numpy as np
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from water_mons.connection.data_schema import *
from water_mons.connection.data_schema import *
from sqlalchemy.ext.declarative import declarative_base
from typing import Dict,List
from sqlalchemy import inspect


class DBConnector(object):
    def __init__(self,conString:str) -> None:
        super().__init__()
        self.con = create_engine(conString)
        self.Base = Base


    def declare_schema(self)->None:
        self.Base.metadata.create_all(self.con,checkfirst=True)   

    def create_portfolio(self,name:str,description:str,createdDate:datetime.datetime=datetime.datetime.now())->None:
        session = self.session()
        data = Portfolio(name=name,createdDate=createdDate,description=description)
        session.add(data)
        session.commit()

    def session(self)->Session:
        session = Session(self.con)
        return session

    def insert_portfolio_stocks(self,stocks)->None:
        session = self.session()
        data = []
        for i in stocks:
            data.append(Portfolio_Stock(**i))
        session.bulk_save_objects(data)
        session.commit()

    def sqlalchmey_to_dict(self,obj):
        return {c.key: getattr(obj, c.key)
            for c in inspect(obj).mapper.column_attrs}

    

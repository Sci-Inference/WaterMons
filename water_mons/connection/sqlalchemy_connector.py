import datetime
import numpy as np
from typing import Dict, List
from sqlalchemy import inspect
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from water_mons.connection.data_schema import *
from sqlalchemy.ext.declarative import declarative_base


class DBConnector(object):
    def __init__(self, conString: str) -> None:
        super().__init__()
        self.con = create_engine(conString)
        self.Base = Base

    def declare_schema(self) -> None:
        self.Base.metadata.create_all(self.con, checkfirst=True)

    def create_portfolio(self, name: str, description: str, createdDate: datetime.datetime = datetime.datetime.now()) -> None:
        session = self.session()
        data = Portfolio(name=name, createdDate=createdDate,
                         description=description)
        session.add(data)
        session.commit()

    def session(self) -> Session:
        session = Session(self.con)
        return session

    def insert_portfolio_stocks(self, stocks) -> None:
        session = self.session()
        data = []
        for i in stocks:
            data.append(Portfolio_Stock(**i))
        session.bulk_save_objects(data)
        session.commit()

    def create_strategy(self, name: str, description: str, createdDate: datetime.datetime = datetime.datetime.now()) -> None:
        session = self.session()
        data = Strategy(name=name, createdDate=createdDate,
                         description=description)
        session.add(data)
        session.commit()   

    def insert_strategy_stocks(self, stocks) -> None:
        session = self.session()
        data = []
        for i in stocks:
            data.append(Strategy_Stock(**i))
        session.bulk_save_objects(data)
        session.commit()


    def create_risk_assessment(self,assessment_name:str,description:str,portfolioId:str,createdDate: datetime.datetime = datetime.datetime.now()):
        session = self.session()
        data = Risk_Assessment(
            name=assessment_name, 
            createdDate=createdDate,
            description=description,
            basePortfolio=portfolioId)
        session.add(data)
        session.commit()  


    def create_back_test(self,backtets_name:str,description:str,strategyId:str,createdDate: datetime.datetime = datetime.datetime.now()):
        session = self.session()
        data = BackTest(
            name=backtets_name, 
            createdDate=createdDate,
            description=description,
            baseStrategy=strategyId)
        session.add(data)
        session.commit()  




    def sqlalchmey_to_dict(self, obj) -> dict:
        return {c.key: getattr(obj, c.key)
                for c in inspect(obj).mapper.column_attrs}

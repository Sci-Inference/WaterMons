import os
import pytest
import numpy as np
import pandas as pd
import datetime
from water_mons.connection.data_schema import *
from water_mons.performance.utils import *
from water_mons.connection.sqlalchemy_connector import DBConnector

@pytest.fixture(scope = 'class')
def database_setup():
    dbc = DBConnector("sqlite:///./water-mons.sqllite")
    dbc.declare_schema()
    return dbc


class Test_DBConnector:
    @pytest.mark.dependency()
    def test_portfolio_table(self,database_setup):
        dbc = database_setup
        data = {'name':'p1','description':'p1 desc','createdDate':datetime.datetime.strptime('2021-01-01','%Y-%m-%d')}
        dbc.create_portfolio(**data)
        session = dbc.session()
        db_data = session.query(Portfolio).all()
        for i in db_data:
            dbc.sqlalchmey_to_dict(i) == data
        session.close()

    @pytest.mark.dependency(depends=["test_portfolio_table"])
    def test_portfolio_stocks(self,database_setup):
        dbc = database_setup
        data = {'name':'p1','description':'p1 desc','createdDate':datetime.datetime.strptime('2021-01-01','%Y-%m-%d')}
        dbc.create_portfolio(**data)
        createdDate = datetime.datetime.strptime('2021-01-01','%Y-%m-%d')
        stocks = [
            {'ticker':'C.TO','createdDate':createdDate,'purchasePrice':1.0,'purchaseNumber':2,'stock_option':'buy','portfolio_name':'p1'},
            {'ticker':'B.TO','createdDate':createdDate,'purchasePrice':1.2,'purchaseNumber':2,'stock_option':'buy','portfolio_name':'p1'},
            {'ticker':'GESC.TO','createdDate':createdDate,'purchasePrice':1.3,'purchaseNumber':2,'stock_option':'buy','portfolio_name':'p1'},
            {'ticker':'A.TO','createdDate':createdDate,'purchasePrice':1.4,'purchaseNumber':2,'stock_option':'buy','portfolio_name':'p1'},
            {'ticker':'AA.To','createdDate':createdDate,'purchasePrice':1.4,'purchaseNumber':2,'stock_option':'buy','portfolio_name':'p1'},
        ]
        dbc.insert_portfolio_stocks(stocks)


    # def teardown_method(self):
    #     os.remove('./water-mons.sqllite')
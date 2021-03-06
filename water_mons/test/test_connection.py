import os
import pytest
import numpy as np
import pandas as pd
import datetime
from water_mons.performance.utils import *
from water_mons.connection.data_schema import *
from water_mons.connection.sqlalchemy_connector import DBConnector
from water_mons.connection.online_stock_connector import StockConnector

@pytest.fixture(scope = 'class')
def database_setup():
    dbc = DBConnector("sqlite:///./water-mons.sqllite")
    dbc.declare_schema()
    return dbc


class Test_DBConnector:
    @pytest.mark.order1
    def test_portfolio_table(self,database_setup):
        dbc = database_setup
        data = {'name':'p1','description':'p1 desc','createdDate':datetime.datetime.strptime('2021-01-01','%Y-%m-%d')}
        dbc.create_portfolio(**data)
        session = dbc.session()
        db_data = session.query(Portfolio).all()
        for i in db_data:
            dbc.sqlalchmey_to_dict(i) == data
        session.close()

    @pytest.mark.order2
    def test_portfolio_stocks(self,database_setup):
        dbc = database_setup
        createdDate = datetime.datetime.strptime('2021-07-21','%Y-%m-%d')
        createdDate2 = datetime.datetime.strptime('2021-07-23','%Y-%m-%d')
        stocks = [
            {'ticker':'AT.TO','createdDate':createdDate,'purchasePrice':21.4,'purchaseNumber':2,'stock_option':'buy','portfolio_name':'p1'},
            {'ticker':'BB.TO','createdDate':createdDate2,'purchasePrice':25.4,'purchaseNumber':2,'stock_option':'buy','portfolio_name':'p1'},
        ]
        dbc.insert_portfolio_stocks(stocks)

    @pytest.mark.order3
    def test_strategy_table(self,database_setup):
        dbc = database_setup
        data = {
            'name':'s1',
            'description':'s1 desc',
            'createdDate':datetime.datetime.strptime('2021-01-01','%Y-%m-%d')
            }
        dbc.create_strategy(**data)
        session = dbc.session()
        db_data = session.query(Strategy).all()
        for i in db_data:
            dbc.sqlalchmey_to_dict(i) == data
        session.close()

    @pytest.mark.order4
    def test_strategy_stocks(self,database_setup):
        dbc = database_setup
        createdDate = datetime.datetime.strptime('2021-07-21','%Y-%m-%d')
        createdDate2 = datetime.datetime.strptime('2021-07-23','%Y-%m-%d')
        stocks = [
            {'ticker':'AT.TO','createdDate':createdDate,"stock_signal":'buy','strategy_name':'s1'},
            {'ticker':'AT.TO','createdDate':createdDate2,"stock_signal":'sell','strategy_name':'s1'},
        ]
        dbc.insert_strategy_stocks(stocks)

    @pytest.mark.order5
    def test_risk_assessment_table(self,database_setup):
        dbc = database_setup
        createdDate = datetime.datetime.strptime('2021-07-21','%Y-%m-%d')
        dbc.create_risk_assessment(
            assessment_name='a1',
            createdDate=createdDate,
            description='first',
            portfolioId='p1'
            )

    @pytest.mark.order6
    def test_back_test_table(self,database_setup):
        dbc = database_setup
        createdDate = datetime.datetime.strptime('2021-07-21','%Y-%m-%d')
        dbc.create_back_test(
            backtets_name='b1',
            createdDate=createdDate,
            description='first',
            strategyId='s1'
            )



    # def teardown_method(self):
    #     os.remove('./water-mons.sqllite')


class Test_Stock_Connection:
    
    def test_get_data(self):
        sc = StockConnector('X.TO','yahoo')
        df = sc.get_data('2021-07-26','2021-07-27','1d')
        assert df.Date.min().strftime('%Y-%m-%d') == '2021-07-26'
        assert df.Date.max().strftime('%Y-%m-%d') == '2021-07-27'

        df = sc.get_data('2021-07-23','2021-07-24','1d')
        assert df.Date.min().strftime('%Y-%m-%d') == '2021-07-23'
        assert df.Date.max().strftime('%Y-%m-%d') == '2021-07-23'

        df = sc.get_data('2021-07-21','2021-07-21','1d')
        assert df.Date.min().strftime('%Y-%m-%d') == '2021-07-21'
        assert df.Date.max().strftime('%Y-%m-%d') == '2021-07-21'



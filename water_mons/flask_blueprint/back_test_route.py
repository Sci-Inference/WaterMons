import json
import datetime
import numpy as np
import pandas as pd
from flask import request
from flask import Response
from flask import Blueprint
from sqlalchemy import and_
from water_mons.flask_blueprint.util import *
from water_mons.connection.data_schema import *
from water_mons.performance.performance import PerformanceBase
from water_mons.connection.sqlalchemy_connector import DBConnector
from water_mons.connection.online_stock_connector import StockConnector
from water_mons.performance.efficient_frontier import Efficient_Frontier

app =  Blueprint('back_test',__name__)


def get_backtest_by_backtest_name(startDate,endDate,conStr,sName):
    dbc = DBConnector(conStr)
    session = dbc.session()
    portValue = list(
        map(
            lambda x: dbc.sqlalchmey_to_dict(x),session.query(BackTest).filter(and_(
                BackTest.backtest_name == sName,
                BackTest.createdDate.between(startDate,endDate)
            )).all()
            )
        )
    session.close()
    df = pd.DataFrame(portValue)
    return df


def get_strategy_stocks_by_backtest_name(startDate,endDate,conStr,sName):
    df = get_backtest_by_backtest_name(startDate,endDate,conStr,sName)
    dbc = DBConnector(conStr)
    strategyName = df['baseStrategy'].unique()[0]
    session = dbc.session()
    db_data = list(map(lambda x: dbc.sqlalchmey_to_dict(x),
    session.query(Strategy_Stock).filter(
        and_(
                Strategy_Stock.strategy_name == strategyName,
                Strategy_Stock.createdDate.between(startDate,endDate)
            )).all()))
    session.close()
    df = pd.DataFrame(db_data)
    df['id'] = df.index
    return df.sort_values('createdDate')[['id','ticker','createdDate','stock_signal']]


@app.route('/db/getBacktest',methods=['POST','GET'])
def get_backtest_landing():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    session = dbc.session()
    db_data = list(map(lambda x: dbc.sqlalchmey_to_dict(x),
    session.query(BackTest).all()))
    session.close()
    print(db_data)
    return Response(json.dumps(db_data,default=str),mimetype='application/json')


@app.route('/db/createBacktest',methods=['POST','GET'])
def create_backtest():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    data = request.json
    dbc.create_back_test(
        backtets_name=data['name'],
        description=data['description'],
        strategyId=data['baseStrategy'],
        createdDate=datetime.datetime.strptime(data['createdDate'],'%Y-%m-%d')
        )
    return "200"


@app.route('/db/getBaseStrategyStocks',methods=['POST','GET'])
def get_base_strategy_stocks():
    pass



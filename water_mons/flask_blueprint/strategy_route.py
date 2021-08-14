import os
import yaml
import json
import datetime
import numpy as np
import pandas as pd
from flask import request
from flask import Response
from flask import Blueprint
from sqlalchemy import and_, or_, not_
from flask_cors import CORS, cross_origin
from flask import Flask, send_from_directory
from water_mons.flask_blueprint.util import *
from water_mons.connection.data_schema import *
from water_mons.connection.sqlalchemy_connector import DBConnector
from water_mons.connection.online_stock_connector import StockConnector
from water_mons.performance.performance import Strategy_Performance,Portfolio_Performance,PerformanceBase



app =  Blueprint('strategy',__name__)


@app.route('/db/getStrategy')
def get_strategy():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    session = dbc.session()
    db_data = list(map(lambda x: dbc.sqlalchmey_to_dict(x),
    session.query(Strategy).all()))
    session.close()
    return Response(json.dumps(db_data,default=str),mimetype='application/json')


@app.route('/db/createStrategy',methods=['POST','GET'])
def create_strategy():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    data = request.json
    print(data['createdDate'])
    dbc.create_strategy(
        name=data['name'],
        description=data['description'],
        createdDate=datetime.datetime.strptime(data['createdDate'],'%Y-%m-%d')
        )
    return "200"

@app.route('/db/createStrategyStocks',methods=['POST'])
def create_strategy_stocks():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    data = request.json
    print(data)
    for i in data:
        i['createdDate'] = datetime.datetime.strptime(i['createdDate'],'%Y-%m-%d')
    dbc.insert_strategy_stocks(data)
    return "200"

@app.route('/db/getStrategyStocks',methods=['POST','GET'])
def get_strategy_stocks():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    data = request.json
    sName = data['strategy_name']
    startDate = datetime.datetime.strptime(data['startDate'],'%Y-%m-%d')
    endDate = datetime.datetime.strptime(data['endDate'],'%Y-%m-%d')
    session = dbc.session()
    db_data = list(map(lambda x: dbc.sqlalchmey_to_dict(x),
    session.query(Strategy_Stock).filter(
        and_(
                Strategy_Stock.strategy_name == sName,
                Strategy_Stock.createdDate.between(startDate,endDate)
            )).all()))
    session.close()
    df = pd.DataFrame(db_data)
    df['id'] = df.index
    df = df.sort_values('createdDate')[['id','ticker','createdDate','stock_signal']]
    return Response(json.dumps(df.to_dict('records'),default=str),mimetype='application/json')

@app.route('/db/getStrategyLineChart',methods=['POST','GET'])
def get_strategy_line_chart():
    data = request.json
    pName = data['strategy_name']
    if 'benchmarks' in data:
        bList = data['benchmarks']
    else:
        bList = []
    startDate = datetime.datetime.strptime(data['startDate'],'%Y-%m-%d')
    endDate = datetime.datetime.strptime(data['endDate'],'%Y-%m-%d')
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    stockConStr = read_config()['data_connection']['STOCK_CONNECTION']
    p = get_strategy(conStr,pName,startDate=startDate,endDate=endDate)
    pValue = padding_period_eval(p,startDate=startDate,endDate=endDate)
    df = pd.DataFrame(pd.DataFrame.from_dict(pValue,'index').to_records())
    df['Close'] = df['strategy_value'] + df['holding'] + df['purchase']
    df = df[['index','Close']]
    df['ticker'] = 'Base'
    df.columns = ['Date','Close','ticker']
    for ix,v in enumerate(bList):
        tmp = StockConnector(v,stockConStr).get_data(startDate=data['startDate'],endDate=data['endDate'])[['Date','ticker','Close']]
        tmp['Date'] = tmp['Date'].dt.strftime('%Y-%m-%d')
        if v == 0:
            df = tmp
            continue
        df = df.append(tmp,ignore_index=True)
    res = pd.DataFrame(df.pivot('Date','ticker','Close').to_records()).dropna().to_dict('records')
    return Response(json.dumps(res,default=str),mimetype='application/json')
    
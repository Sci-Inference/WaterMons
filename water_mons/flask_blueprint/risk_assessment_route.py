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

app =  Blueprint('risk_assessment',__name__)


@app.route('/risk/efficientFrontier',methods=['POST','GET'])
def get_efficient_frontier():
    data = request.json
    print(data)
    tickerList = data['tickers']
    method = data['method']
    startDate = data['startDate']
    endDate = data['endDate']
    stockConStr = read_config()['data_connection']['STOCK_CONNECTION']
    df = None
    for ticker in tickerList:
        sc = StockConnector(ticker,stockConStr).get_data(startDate=startDate,endDate=endDate)
        if df is None:
            df = sc
            continue
        df = df.append(sc,ignore_index = True)
    print(df.head())
    df = pd.DataFrame(df.pivot('Date','ticker','Close').to_records())
    df = df.set_index('Date')
    ef = Efficient_Frontier()
    ef.CLA(df,method)
    ar,av,sr = ef.get_performance()
    reLine,stdLine,weiLine = ef.get_efficient_frontier()
    wei = ef.get_weights()
    output = {
        'par':ar,
        'pav':av,
        'psr':sr,
        'weights':wei.tolist(),
        'lineRe':reLine,
        'lineStd':stdLine,
        'frontierLine': list(zip(stdLine,reLine)),
        'weiLine':list(map(lambda x: x.tolist(),weiLine)),
        'tickers':ef.tickers
    }
    return Response(json.dumps(output,default=str),mimetype='application/json')


@app.route('/db/getRiskAssessment')
def get_risk_assessment_landing():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    session = dbc.session()
    db_data = list(map(lambda x: dbc.sqlalchmey_to_dict(x),
    session.query(Risk_Assessment).all()))
    session.close()
    return Response(json.dumps(db_data,default=str),mimetype='application/json')

@app.route('/db/createRiskAssessment')
def create_risk_assessment():
    pass
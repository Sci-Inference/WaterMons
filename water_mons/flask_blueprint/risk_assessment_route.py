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

@app.route('/db/createRiskAssessment',methods=['POST','GET'])
def create_risk_assessment():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    data = request.json
    dbc.create_risk_assessment(
        assessment_name=data['name'],
        description=data['description'],
        portfolioId=data['basePort'],
        createdDate=datetime.datetime.strptime(data['createdDate'],'%Y-%m-%d')
        )
    return "200"


@app.route("/db/getBasePortfolioStocks",methods=['POST','GET'])
def get_base_portfolio_stocks():
    data = request.json
    aName = data['assessment_name']
    startDate = datetime.datetime.strptime(data['startDate'],'%Y-%m-%d')
    endDate = datetime.datetime.strptime(data['endDate'],'%Y-%m-%d')
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    assValue = get_assessment(conStr=conStr,aName=aName)
    pName = assValue[0]['basePortfolio']
    dbc = DBConnector(conStr)
    session = dbc.session()
    portValue = list(
        map(
            lambda x: dbc.sqlalchmey_to_dict(x),session.query(Portfolio_Stock).filter(and_(
                Portfolio_Stock.portfolio_name == pName,
                Portfolio_Stock.createdDate.between(startDate,endDate)
            )).all()
            )
        )
    session.close()
    df = pd.DataFrame(portValue)
    df['stock_option'] =  df.stock_option.apply(lambda x: 1 if x=='buy' else -1)
    df['purchaseNumber'] = df['stock_option'] * df['purchaseNumber']
    res = pd.DataFrame.from_dict(port_holding(df),'index')
    res = pd.DataFrame(res.to_records()).rename(columns={'index':'Date'}).fillna(0)
    res['Date'] = res['Date'].dt.strftime("%Y-%m-%d")
    return Response(json.dumps(res.to_dict('records'),default=str),mimetype='application/json')



@app.route("/db/getBasePortfolioPerformance",methods=['POST','GET'])
def get_base_portfolio_performance():
    data = request.json
    aName = data['assessment_name']
    startDate = datetime.datetime.strptime(data['startDate'],'%Y-%m-%d')
    endDate = datetime.datetime.strptime(data['endDate'],'%Y-%m-%d')
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    assValue = get_assessment(conStr=conStr,aName=aName)
    pName = assValue[0]['basePortfolio']
    stockConStr = read_config()['data_connection']['STOCK_CONNECTION']
    dataDict = {}
    p = get_portfolio(conStr, pName, startDate,endDate)
    perform = p.performance()
    dataDict['Base'] = perform
    res = performance_to_detail_rows(dataDict)
    print(res)
    return Response(json.dumps(res,default=str),mimetype='application/json')
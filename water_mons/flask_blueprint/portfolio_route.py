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
from water_mons.connection.sqlalchemy_connector import DBConnector
from water_mons.connection.online_stock_connector import StockConnector
from water_mons.performance.performance import PerformanceBase

app =  Blueprint('portfolio',__name__)


@app.route('/db/getPortfolio')
def get_portfolio_landing():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    session = dbc.session()
    db_data = list(map(lambda x: dbc.sqlalchmey_to_dict(x),
    session.query(Portfolio).all()))
    session.close()
    return Response(json.dumps(db_data,default=str),mimetype='application/json')




@app.route('/db/createPortfolio',methods=['POST','GET'])
def create_portfolio():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    data = request.json
    print(data['createdDate'])
    dbc.create_portfolio(
        name=data['name'],
        description=data['description'],
        createdDate=datetime.datetime.strptime(data['createdDate'],'%Y-%m-%d')
        )
    return "200"


@app.route('/db/createPortfolioStocks',methods=['POST'])
def create_portfolio_stocks():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    data = request.json
    print(data)
    for i in data:
        i['createdDate'] = datetime.datetime.strptime(i['createdDate'],'%Y-%m-%d')
    dbc.insert_portfolio_stocks(data)
    return "200"

@app.route('/db/getPortfolioStockData',methods=['POST','GET'])
def get_portfolio_stock_data():
    data = request.json
    pName = data['portfolio_name']
    startDate = datetime.datetime.strptime(data['startDate'],'%Y-%m-%d')
    endDate = datetime.datetime.strptime(data['endDate'],'%Y-%m-%d')
    padding = data['padding']
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    portValue = get_portfolio(conStr, pName, startDate, endDate,padding)
    return Response(json.dumps(portValue,default=str),mimetype='application/json')


@app.route('/db/getPerformanceLineChart',methods=['POST','GET'])
def get_peroformance_line_chart():
    data = request.json
    pName = data['portfolio_name']
    if 'benchmarks' in data:
        bList = data['benchmarks']
    else:
        bList = []
    startDate = datetime.datetime.strptime(data['startDate'],'%Y-%m-%d')
    endDate = datetime.datetime.strptime(data['endDate'],'%Y-%m-%d')
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    stockConStr = read_config()['data_connection']['STOCK_CONNECTION']
    p = get_portfolio(conStr,pName,startDate=startDate,endDate=endDate)
    pValue = padding_period_eval(p,startDate=startDate,endDate=endDate)
    df = pd.DataFrame(pd.DataFrame.from_dict(pValue,'index').to_records())
    df['Close'] = df['portfolio_value'] + df['holding'] + df['purchase']
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
    
    
@app.route('/db/getPerformanceBarChart',methods=['GET','POST'])
def get_performance_bar_chart():
    data = request.json
    pName = data['portfolio_name']
    if 'benchmarks' in data:
        bList = data['benchmarks']
    else:
        bList = []
    startDate = datetime.datetime.strptime(data['startDate'],'%Y-%m-%d')
    endDate = datetime.datetime.strptime(data['endDate'],'%Y-%m-%d')
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    stockConStr = read_config()['data_connection']['STOCK_CONNECTION']
    p = get_portfolio(conStr,pName,startDate=startDate,endDate=endDate)
    pValue = padding_period_eval(p,startDate=startDate,endDate=endDate)
    df = pd.DataFrame(pd.DataFrame.from_dict(pValue,'index').to_records())
    df['Close'] = df['portfolio_value'] + df['holding']
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
    res = pd.DataFrame(df.pivot('Date','ticker','Close').to_records()).dropna()
    tmp = res.sort_values('Date')[filter(lambda x: x!='Date',res.columns)].apply(lambda x: np.abs(x) - np.abs(x.shift(1)),axis =0)
    tmp['Date'] = res['Date']
    res = tmp.dropna().to_dict('records')
    return Response(json.dumps(res,default=str),mimetype='application/json')




@app.route('/db/getPerformance',methods=['POST','GET'])
def get_portfolio_performance():
    data = request.json
    pName = data['portfolio_name']
    if 'benchmarks' in data:
        bList = data['benchmarks']
    else:
        bList = []
    startDate = datetime.datetime.strptime(data['startDate'],'%Y-%m-%d')
    endDate = datetime.datetime.strptime(data['endDate'],'%Y-%m-%d')
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    stockConStr = read_config()['data_connection']['STOCK_CONNECTION']
    dataDict = {}
    p = get_portfolio(conStr, pName, startDate, endDate)
    perform = p.performance()
    dataDict['Base'] = perform
    for i in bList:
        dbc = StockConnector(i,stockConStr)
        df = dbc.get_data(data['startDate'],data['endDate'])
        benchPerform = PerformanceBase(df.Close.values,0).performance()
        dataDict[i] = benchPerform
    res = performance_to_detail_rows(dataDict)
    print(res)
    return Response(json.dumps(res,default=str),mimetype='application/json')


@app.route('/db/getPortfolioComposition',methods=['POST','GET'])
def getPortfolioComposition():
    data = request.json
    pName = data['portfolio_name']
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    print(data['selectedDate'])
    selectedDate = datetime.datetime.strptime(data['selectedDate'],'%Y-%m-%d')
    dbc = DBConnector(conStr)
    session = dbc.session()
    db_data = list(
        map(
            lambda x: dbc.sqlalchmey_to_dict(x),session.query(Portfolio_Stock).filter(and_(
                Portfolio_Stock.portfolio_name == pName,
                Portfolio_Stock.createdDate <= selectedDate
            )).all()
            )
        )
    session.close()
    df = pd.DataFrame(db_data)
    df['stock_option'] =  df.stock_option.apply(lambda x: 1 if x=='buy' else -1)
    df['purchaseNumber'] = df['stock_option'] * df['purchaseNumber']
    df = df.groupby(['ticker']).agg({'purchaseNumber':'sum'})
    res = pd.DataFrame(df.to_records())
    res.columns = ['ticker','holdingNumber']
    res['id'] = res.index
    res = res.to_dict("records")
    return Response(json.dumps(res,default=str),mimetype='application/json')

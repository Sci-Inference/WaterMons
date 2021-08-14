import yaml
import numpy as np
import pandas as pd
from sqlalchemy import and_, or_, not_
from water_mons.connection.data_schema import *
from water_mons.connection.sqlalchemy_connector import DBConnector
from water_mons.connection.online_stock_connector import StockConnector
from water_mons.performance.performance import Strategy_Performance,Portfolio_Performance,PerformanceBase



def read_config():
    with open("config.yaml", 'r') as stream:
        try:
            return yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            print(exc)


def get_portfolio(conStr, pName, startDate, endDate):
    dbc = DBConnector(conStr)
    session = dbc.session()
    db_data = list(
        map(
            lambda x: dbc.sqlalchmey_to_dict(x),session.query(Portfolio_Stock).filter(and_(
                Portfolio_Stock.portfolio_name == pName,
                Portfolio_Stock.createdDate.between(startDate,endDate)
            )).all()
            )
        )
    session.close()
    conStr = read_config()['data_connection']['STOCK_CONNECTION']
    p = Portfolio_Performance(conStr=conStr)
    for i in db_data:
        p.append_ticker(
            ticker = i['ticker'],
            createDate=i['createdDate'].strftime('%Y-%m-%d'),
            option=i['stock_option'],
            price=i['purchasePrice'],
            number=i['purchaseNumber']
            )
    return p


def get_strategy(conStr,sName,startDate,endDate):
    dbc = DBConnector(conStr)
    session = dbc.session()
    db_data = list(
        map(
            lambda x: dbc.sqlalchmey_to_dict(x),session.query(Strategy_Stock).filter(and_(
                Strategy_Stock.strategy_name == sName,
                Strategy_Stock.createdDate.between(startDate,endDate)
            )).all()
            )
        )
    session.close()
    conStr = read_config()['data_connection']['STOCK_CONNECTION']
    s = Strategy_Performance(conStr=conStr)
    for i in db_data:
        s.append_ticker(
            ticker = i['ticker'],
            createDate=i['createdDate'].strftime('%Y-%m-%d'),
            option=i['stock_option'],
            number=1
            )
    return s


def padding_period_eval(perforamnceObject,startDate,endDate):
    portValue = perforamnceObject.period_eval()
    dtRange = list(map(lambda x: x.strftime("%Y-%m-%d"),pd.date_range(startDate,endDate).tolist()))
    cacheValue = {'portfolio_value':0,'holding':0}
    for i in dtRange:
        if i in portValue:
            cacheValue = portValue[i]
            continue
        portValue[i] = cacheValue
    return portValue


def performance_to_detail_rows(dataDict):
    metricNameDict = {
        'number_return':'Period Return',
        'percent_return':"Period Return (%)",
        'voltility':"Period Voltility (std.)",
        'max_drawndown':"Max Drawdown",
        'sharpe_ratio':"Sharpe Ratio",
        "sortino_ratio":"Sortino Ratio"
    }
    res = []
    cateList = list(dataDict.keys())
    metricsList = list(dataDict[cateList[0]].keys())
    for ix,v in enumerate(metricsList):
        tmp = {}
        tmp['id'] = ix +1
        tmp['metric'] = metricNameDict[v]
        for c in cateList:
            tmp[c] = str(np.round(dataDict[c][v],2))
        res.append(tmp)
    return res



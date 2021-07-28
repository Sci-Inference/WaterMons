import pandas as pd
from collections import defaultdict

from pandas.core.indexing import convert_from_missing_indexer_tuple
from water_mons.connection.online_stock_connector import StockConnector
import numpy as np
import copy

class Portfolio(object):

    def __init__(self,conStr) -> None:
        super().__init__()
        self.tickerList=[]
        self.conStr = conStr
        
    def append_ticker(self,ticker,createDate,option,price,number):
        self.tickerList.append({
            'ticker':ticker,
            'date':createDate,
            'option':option,
            'price':price,
            'Close':StockConnector(self.conStr).get_data(createDate,createDate).Close.tolist()[-1],
            'number':number
        })


    def stock_value(self,data):
        res = []
        purchaseValue = 0
        purchaseNum = 0
        for i in data:
            if i['option'] == 'buy':
                purchaseNum += i['number']
                pvalue = i['Close'] * purchaseNum
                purchaseValue += i['price'] * i['number']
                res.append({'date':i['date'],'value':pvalue,'earn':np.nan})
            if i['option'] == 'sell':
                earn = (i['price'] * i['number']) - (purchaseValue/purchaseNum)
                purchaseNum -= i['number']
                if purchaseNum < 0:
                    raise
                pvalue = i['Close'] * purchaseNum
                res.append({'date':i['date'],'value':pvalue,'earn':earn})
        return res

    def _merge_portfolio_values(self,a,b):
        for i in a:
            if i in b:
                for j in a[i]:
                    a[i][j] +=b[i][j]
                continue
        for i in b:
            if i not in a:
                a[i] = b[i]
        return a

    def create_portfolio(self):
        portValue = None
        df = pd.DataFrame(self.tickerList)
        for i in df.ticker.unique():
            data = df[df['ticker'] == i].to_dict('records')
            stock = self.stock_value(data)
            if portValue is None:
                portValue = copy.deepcopy(stock)
                continue
            portValue = self._merge_portfolio_values(portValue,stock)
        return portValue

    
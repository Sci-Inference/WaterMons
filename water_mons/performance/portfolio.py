import pandas as pd
from collections import defaultdict
from water_mons.connection.online_stock_connector import StockConnector
import numpy as np

class Portfolio(object):

    def __init__(self,conStr) -> None:
        super().__init__()
        self.tickerList=[]
        self.conStr = conStr
        
    def append_ticker(self,ticker,startDate,option,price,number):
        self.tickerList.append({
            'ticker':ticker,
            'date':startDate,
            'option':option,
            'price':price,
            'number':number
        })


    def _portfolio_value(self,data):
        res = []
        purchaseValue = 0
        purchaseNum = 0
        for i in data:
            if i['option'] == 'buy':
                pvalue = i['Close'] * i['number']
                purchaseValue += i['price'] * i['number']
                purchaseNum += i['number']
                res.append({'value':pvalue,'earn':np.nan})
            if i['option'] == 'sell':
                earn = (i['price'] * i['number']) - (purchaseValue/purchaseNum)
                purchaseNum -= i['number']
                if purchaseNum < 0:
                    raise ValueError('sell number is bigger than holding number')
                pvalue = i['Close'] * i['number']
                res.append({'value':pvalue,'earn':earn})
        return res

    def create_portfolio(self):
        return res


    def create_portfolio_gain(self):
        return
    
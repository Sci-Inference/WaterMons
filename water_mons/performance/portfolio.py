import pandas as pd
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
            'Close':StockConnector(ticker,self.conStr).get_data(createDate,createDate).Close.tolist()[-1],
            'number':number
        })
        
    def pad_tickers(self)->None:
        df = pd.DataFrame(self.tickerList)
        dateList = df['date'].unique().tolist()
        tickerList = df['ticker'].unique().tolist()
        for i in tickerList:
            tmp = df[df.ticker == i]
            tmpDateList = tmp['date'].unique().tolist()
            for j in dateList:
                if j not in tmpDateList:
                    self.append_ticker(i,j,None,None,0)


    def stock_value(self,data)->list([dict]):
        res = []
        purchaseValue = 0
        purchaseNum = 0
        for i in data:
            if len(res)<1 and i['option'] is None:
                continue
            if i['option'] == 'buy':
                purchaseNum += i['number']
                pvalue = i['Close'] * purchaseNum
                purchaseValue += i['price'] * i['number']
                earn = -1*i['price'] * i['number']
                res.append({'date':i['date'],'value':pvalue,'earn':earn})
            if i['option'] == 'sell':
                earn = (i['price'] * i['number'])
                purchaseNum -= i['number']
                if purchaseNum < 0:
                    raise
                pvalue = i['Close'] * purchaseNum
                res.append({'date':i['date'],'value':pvalue,'earn':earn})
            if i['option'] == None:
                pvalue = i['Close'] * purchaseNum
                res.append({'date':i['date'],'value':pvalue,'earn':0})
        return res

    def _merge_portfolio_values(self,a,b,holding):
        sameDate = False
        cacheDate = None
        for i in b:
            if i['date'] == cacheDate:
                sameDate = True
            if i['date'] in a:
                prevp = a[i['date']]['portfolio_value']
            else:
                prevp = 0
            if (np.abs(holding) <= np.abs(i['earn'])) and  (i['earn'] < 0):
                print('buy')
                print(f"{holding} {i['earn']} {holding}")
                a[i['date']] = {'portfolio_value':prevp+i['value'],'holding':holding}
            elif (np.abs(holding)>= np.abs(i['earn'])) and (i['earn'] < 0) and sameDate:
                print('same')
                holding = holding + i['earn']
                a[i['date']] = {'portfolio_value':prevp+i['value'],'holding':holding}
            else:
                print('sell')
                print(f"{holding} {i['earn']} {holding + i['earn']}")
                holding = holding +  + i['earn']
                a[i['date']] ={'portfolio_value':prevp+i['value'],'holding':holding}
            cacheDate = i['date']
        return a,holding

    def create_portfolio(self)->dict:
        portValue = None
        df = pd.DataFrame(self.tickerList)
        holding = 0
        portValue = {}
        for i in df.ticker.unique():
            data = df[df['ticker'] == i].sort_values('date').to_dict('records')
            stock = self.stock_value(data)
            if portValue is None:
                portValue = copy.deepcopy(stock)
                continue
            portValue,h = self._merge_portfolio_values(portValue,stock,holding)
            holding = h
        return portValue


    
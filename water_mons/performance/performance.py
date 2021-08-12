import numpy as np
import pandas as pd
from typing import Optional
from water_mons.performance.utils import (
    std,
    max_drawn,
    percent_return,
    number_return,
    sharpe_ratio,
    sortino_ratio
    )
import copy
import numpy as np
import pandas as pd
from water_mons.connection.online_stock_connector import StockConnector


class PerformanceBase(object):
    """PerformanceBase
    This class is the base class for performance calculation.
    It contains the basic return computation and class representation.

    """
    def __init__(self,timeSeries:np.array,riskFree:Optional[int] = 0):
        self.timeSeries = timeSeries
        self.riskFree = riskFree

    def performance(self)->dict:
        return {
            'number_return':number_return(timeSeries=self.timeSeries),
            'percent_return': percent_return(timeSeries=self.timeSeries),
            'voltility':std(timeSeries=self.timeSeries),
            'max_drawndown':max_drawn(timeSeries=self.timeSeries),
            'sharpe_ratio':sharpe_ratio(timeSeries=self.timeSeries,riskFree=self.riskFree),
            'sortino_ratio':sortino_ratio(timeSeries=self.timeSeries,riskFree=self.riskFree)
            }
        
    def __repr__(self):
        pf = self.performance()
        pfStr = ""
        for i in pf:
            pfStr += f'{i}:{pf[i]}\n'
        return repr(pfStr)



class Portfolio_Performance(object):

    def __init__(self,conStr) -> None:
        super().__init__()
        self.tickerList=[]
        self.conStr = conStr
        self.holdingDict = {}
        
    def append_ticker(self,ticker:str,createDate:str,option:str,price:float,number:int):
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

    def _compute_period_earning(self,df,createdDate):
        data = df.to_dict('records')
        res = {'portfolio_value':0,'holding':0,'purchase':0}
        for i in data:
            if i['option'] == 'buy':
                res['portfolio_value'] += i['Close'] * self.holdingDict[i['ticker']][createdDate]
                res['purchase'] -= i['price']*i['number']
            elif i['option'] == 'sell':
                res['portfolio_value'] += i['Close'] * self.holdingDict[i['ticker']][createdDate]
                res['holding'] += i['price']*i['number']
            else:
                res['portfolio_value'] += i['Close'] * self.holdingDict[i['ticker']][createdDate]
        res['Date'] = createdDate
        return res

    def period_eval(self)->dict:
        df = pd.DataFrame(self.tickerList)
        df = df.sort_values('date')
        df['tmpNum'] = df.apply(lambda x: -1*x.number if x.option == 'sell' else x.number,axis =1)
        returnList = []
        for i in df['ticker'].unique():
            self.holdingDict[i] = df[df.ticker==i].groupby('date').tmpNum.sum().cumsum().to_dict()

        for i in df['date'].unique():
            returnList.append(self._compute_period_earning(df[df['date']==i],i))

        pdf = pd.DataFrame(returnList)
        pdf['holding'] = pdf.holding.cumsum()
        return pdf.set_index('Date').to_dict('index')

    def performance(self,riskFree=0):
        portValue = self.period_eval()
        portValueList = np.array([portValue[i]['portfolio_value'] + portValue[i]['holding'] for i in portValue])
        return PerformanceBase(portValueList,riskFree=riskFree).performance()

   
      
class Strategy_Performance(Portfolio_Performance):
    def __init__(self, conStr) -> None:
        super().__init__(conStr)


    def append_ticker(self,ticker,createDate,option,number):
        if option is None:
            price = None
        else:
            price = StockConnector(ticker,self.conStr).get_data(createDate,createDate).Close.tolist()[-1]
        self.tickerList.append({
            'ticker':ticker,
            'date':createDate,
            'option':option,
            'price': price,
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
                    self.append_ticker(i,j,None,0)
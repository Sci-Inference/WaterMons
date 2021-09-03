import datetime
import pandas as pd
import yfinance as yf


class StockConnector(object):
    def __init__(self,ticker,connectorStr) -> None:
        super().__init__()
        self.con = connectorStr
        self._ticker =ticker

    def get_data(self,startDate:str,endDate:str,interval:list(['1d','1w'])='1d')-> pd.DataFrame:
        endDate = (datetime.datetime.strptime(endDate,'%Y-%m-%d') + datetime.timedelta(days=1)).strftime('%Y-%m-%d')
        df = self.ticker.history(
            start=startDate,
            end=endDate,
            interval=interval)
        df['ticker'] = self._ticker
        df = pd.DataFrame(df.to_records())
        df = df[df['Date'].dt.strftime('%Y-%m-%d') >= startDate]
        df = df[df['Date'].dt.strftime('%Y-%m-%d') <= endDate]
        return df


    @property
    def ticker(self):
        conDict = {
            'yahoo':yf.Ticker
        }
        return conDict[self.con](self._ticker)
    
    


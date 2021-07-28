import yfinance as yf
import pandas as pd




class StockConnector(object):
    def __init__(self,ticker,connectorStr) -> None:
        super().__init__()
        self.con = connectorStr
        self._ticker =ticker

    def get_data(self,startDate,endDate,interval='1d')-> pd.DataFrame:
        df = self.ticker.history(
            start=startDate,
            end=endDate,
            interval=interval)
        return pd.DataFrame(df.to_records())


    @property
    def ticker(self):
        conDict = {
            'yahoo':yf.Ticker
        }
        return conDict[self.con](self._ticker)
    
    


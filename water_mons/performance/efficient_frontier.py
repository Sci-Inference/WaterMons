import pandas as pd
from pypfopt import CLA
from pypfopt import risk_models
from pypfopt import expected_returns




class Efficient_Frontier(object):
    def __init__(self) -> None:
        super().__init__()
        self.cla = None


    def CLA(self,df:pd.DataFrame,method:str):
        """Compute the Critical Line Algorithm for portfolio optmization.
        The index of the input dataframe should be the time column. The rest of
        columns are the portfolio components.

        Args:
            df (pd.DataFrame): input dataframe
            method (str): optmize by sharpe or var, or both.
        """
        mu = expected_returns.mean_historical_return(df)
        S = risk_models.sample_cov(df)
        cla = CLA(mu, S)
        if method == 'sharpe':
            cla.max_sharpe()
        elif method == 'var':
            cla.min_volatility()
        else:
            cla.max_sharpe()
            cla.min_volatility()
        
        self.cla = cla

    def get_efficient_frontier(self):
        if self.cla is None:
            raise ValueError("please execute CLA method first")
        return self.cla.efficient_frontier()

    def get_weights(self):
        if self.cla is None:
            raise ValueError("please execute CLA method first")
        return self.cla.weights        
    
    def get_performance(self):
        if self.cla is None:
            raise ValueError("please execute CLA method first")
        return self.cla.portfolio_performance(verbose=True)
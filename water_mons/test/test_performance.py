import pytest
import numpy as np
import pandas as pd
from water_mons.performance.utils import *
from water_mons.performance.performance import PerformanceBase
from water_mons.performance.portfolio import Portfolio


@pytest.fixture
def data_input():
    return np.array([20,21,13,100,10,10])

@pytest.fixture
def data_wrong_input():
    return {
        'neg':np.array([-1,2,1]),
        'len':np.array([0])
        }

class Test_Performance_Utils:
    
    def test_max_drawn(self,data_input,data_wrong_input):
        neg = data_wrong_input['neg']
        lenData = data_wrong_input['len']
        with pytest.raises(ValueError):
            max_drawn(neg)
            max_drawn(lenData)
        data = data_input
        res = max_drawn(data)
        assert res ==0.9

    def test_percent_return(self,data_input,data_wrong_input):
        neg = data_wrong_input['neg']
        lenData = data_wrong_input['len']
        with pytest.raises(ValueError):
            percent_return(neg)
            percent_return(lenData)
        data = data_input
        assert percent_return(data) == -0.5

    def test_number_return(self,data_input,data_wrong_input):
        neg = data_wrong_input['neg']
        lenData = data_wrong_input['len']
        with pytest.raises(ValueError):
            number_return(neg)
            number_return(lenData)
        data = data_input
        assert number_return(data) == -10

    def test_std(self,data_input,data_wrong_input):
        neg = data_wrong_input['neg']
        lenData = data_wrong_input['len']
        with pytest.raises(ValueError):
            std(neg)
            std(lenData)
        data = data_input
        assert std(data) == np.std(data)

    def test_sharpe_ratio(self,data_input,data_wrong_input):
        neg = data_wrong_input['neg']
        lenData = data_wrong_input['len']
        with pytest.raises(ValueError):
            sharpe_ratio(neg)
            sharpe_ratio(lenData)
        data = data_input
        assert round(sharpe_ratio(data),3) == round((-10/np.std(data)),3)
        
    def test_sortino_ratio(self,data_input,data_wrong_input):
        neg = data_wrong_input['neg']
        lenData = data_wrong_input['len']
        with pytest.raises(ValueError):
            sortino_ratio(neg)
            sortino_ratio(lenData)
        data = data_input
        assert sortino_ratio(data) == -10/np.std([13,10,10])


class Test_Performance_PerformanceBase:

    def test_performance(self,data_input):
        data = data_input
        pb = PerformanceBase(data)
        pb.performance()
        pb




class Test_Portfolio:
    
    def test_create_portfolio(self):
        p = Portfolio('yahoo')
        p.append_ticker('CG.TO','2021-07-21','buy',9.37,1)
        p.append_ticker('CG.TO','2021-07-22','sell',9.5,1)
        p.append_ticker('CG.TO','2021-07-23','buy',9.32,1)
        p.append_ticker('X.TO','2021-07-23','buy',134.5,2)
        p.append_ticker('X.TO','2021-07-26','sell',134.2,1)
        p.append_ticker('X.TO','2021-07-27','sell',134.6,1)
        p.append_ticker('X.TO','2021-07-27','buy',134.5,1)
        p.pad_tickers()
        res = p.create_portfolio()
        print(res)
        result = [
            {'Date':'2021-07-21','portfolio_value':9.55,'holding':0},
            {'Date':'2021-07-22','portfolio_value':0,'holding':9.5},
            {'Date':'2021-07-23','portfolio_value':278.75,'holding':0.18},
            {'Date':'2021-07-26','portfolio_value':143.89,'holding':134.38},
            {'Date':'2021-07-27','portfolio_value':144.29,'holding':134.48},
        ]

        for i in result:
            assert pytest.approx(res[i['Date']]['portfolio_value']) == i['portfolio_value']
            assert pytest.approx(res[i['Date']]['holding']) == i['holding']


    
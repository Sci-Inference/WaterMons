import pytest
import numpy as np
import pandas as pd
from water_mons.performance.utils import *
from water_mons.performance.performance import PerformanceBase,Portfolio_Performance,Strategy_Performance


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
        p = Portfolio_Performance('yahoo')
        p.append_ticker('CM.TO','2020-07-21','buy',90,2)
        p.append_ticker('CM.TO','2020-07-22','sell',90,1)
        p.append_ticker('CM.TO','2020-07-23','sell',90,1)
        p.append_ticker('TD.TO','2020-07-23','buy',60,1)
        p.append_ticker('TD.TO','2020-07-24','sell',60,1)
        p.append_ticker('TD.TO','2020-07-27','buy',60,1)
        p.pad_tickers()
        print(p.tickerList)
        res = p.period_eval()
        print(res)
        result = [
            {'Date':'2020-07-21','portfolio_value':179.26,'holding':0,'purchase':-180},
            {'Date':'2020-07-22','portfolio_value':89.26,'holding':90,'purchase':0},
            {'Date':'2020-07-23','portfolio_value':58.72,'holding':180,'purchase':-60},
            {'Date':'2020-07-24','portfolio_value':0,'holding':240,'purchase':0},
            {'Date':'2020-07-27','portfolio_value':57.62,'holding':240,'purchase':-60},
        ]

        for i in result:
            assert pytest.approx(res[i['Date']]['portfolio_value'],0.01) == i['portfolio_value']
            assert pytest.approx(res[i['Date']]['holding'],0.01) == i['holding']
            assert pytest.approx(res[i['Date']]['purchase'],0.01) == i['purchase']
        p.performance()


class Test_Strategy:
    def test_create_strategy(self):
        s = Strategy_Performance('yahoo')
        s.append_ticker('CM.TO','2021-07-21','buy',1)
        s.append_ticker('CM.TO','2021-07-22','sell',1)
        s.append_ticker('TD.TO','2021-07-21','buy',1)
        s.append_ticker('TD.TO','2021-07-23','sell',1)
        s.pad_tickers()
        res = s.period_eval()
        result = [
            {'Date':'2021-07-21','portfolio_value':225.41,'holding':0,'purchase':-225.41},
            {'Date':'2021-07-22','portfolio_value':82.41,'holding':142.52,'purchase':0},
            {'Date':'2021-07-23','portfolio_value':0,'holding':225.2,'purchase':0},
        ]
        for i in result:
            print(i["Date"])
            assert pytest.approx(res[i['Date']]['portfolio_value']) == i['portfolio_value']
            assert pytest.approx(res[i['Date']]['holding']) == i['holding']
            assert pytest.approx(res[i['Date']]['purchase'],0.01) == i['purchase']
        s.performance()
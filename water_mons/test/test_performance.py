import pandas as pd
import numpy as np
from water_mons.performance.utils import *
import pytest

@pytest.fixture
def data_input():
    return np.array([11,21,13,100,10,10])

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

    def test_number_return(self,data_input,data_wrong_input):
        neg = data_wrong_input['neg']
        lenData = data_wrong_input['len']
        with pytest.raises(ValueError):
            number_return(neg)
            number_return(lenData)

    def test_std(self,data_input,data_wrong_input):
        neg = data_wrong_input['neg']
        lenData = data_wrong_input['len']
        with pytest.raises(ValueError):
            std(neg)
            std(lenData)

    def test_sharpe_ratio(self,data_input,data_wrong_input):
        neg = data_wrong_input['neg']
        lenData = data_wrong_input['len']
        with pytest.raises(ValueError):
            sharpe_ratio(neg)
            sharpe_ratio(lenData)

    def test_sortino_ratio(self,data_input,data_wrong_input):
        neg = data_wrong_input['neg']
        lenData = data_wrong_input['len']
        with pytest.raises(ValueError):
            sortino_ratio(neg)
            sortino_ratio(lenData)
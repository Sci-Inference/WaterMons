import numpy as np
from typing import Optional


def max_drawn(timeSeries:np.array)-> np.array:
    minData = timeSeries.min()
    return (minData - timeSeries[0])/timeSeries[0]


def percent_return(timeSeries:np.array)-> np.array:
    return (timeSeries[-1] - timeSeries[0])/timeSeries[0]


def number_return(timeSeries:np.array)-> np.array:
    return timeSeries[-1] - timeSeries[0]


def std(timeSeries:np.array)-> np.array:
    return timeSeries.std()


def sharpe_ratio(timeSeries:np.array, riskFree: Optional[int] = 0) -> np.array:
    return (number_return(timeSeries = timeSeries) - riskFree)/std(timeSeries=timeSeries)

def sortino_ratio(timeSeries:np.array, riskFree: Optional[int] = 0)->np.array:
    downSideStd = (timeSeries - timeSeries[0])
    downSideStd = downSideStd[downSideStd < 0].std()
    return (number_return(timeSeries = timeSeries) - riskFree)/downSideStd



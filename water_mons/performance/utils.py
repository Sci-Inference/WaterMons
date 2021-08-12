import numpy as np
from typing import Optional


def _timeSeries_check(timeSeries:np.array):
    if len(timeSeries) <= 1:
        raise ValueError("timeSeries Data should have at least two items")


def max_drawn(timeSeries:np.array)-> np.array:
    _timeSeries_check(timeSeries)
    minData = timeSeries[-1]
    maxData = timeSeries[:-1].max()
    return (maxData - minData)/maxData


def percent_return(timeSeries:np.array)-> np.array:
    _timeSeries_check(timeSeries)
    return (timeSeries[-1] - timeSeries[0])/timeSeries[0]


def number_return(timeSeries:np.array)-> np.array:
    _timeSeries_check(timeSeries)
    return timeSeries[-1] - timeSeries[0]


def std(timeSeries:np.array)-> np.array:
    _timeSeries_check(timeSeries)
    return timeSeries.std()


def sharpe_ratio(timeSeries:np.array, riskFree: Optional[int] = 0) -> np.array:
    _timeSeries_check(timeSeries)
    return (number_return(timeSeries = timeSeries) - riskFree)/np.std(timeSeries)

def sortino_ratio(timeSeries:np.array, riskFree: Optional[int] = 0)->np.array:
    _timeSeries_check(timeSeries)
    downSideStd = (timeSeries - timeSeries[0])
    downSideStd = downSideStd[downSideStd < 0].std()
    return (number_return(timeSeries = timeSeries) - riskFree)/downSideStd



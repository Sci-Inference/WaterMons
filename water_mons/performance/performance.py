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



def PerformanceBase(object):
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



    
      


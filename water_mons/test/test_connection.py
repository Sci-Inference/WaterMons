import pytest
import numpy as np
import pandas as pd
import os
from water_mons.performance.utils import *
from water_mons.connection.sqlalchemy_connector import DBConnector



class Test_DBConnector:

    def test_declare_schema(self):
        dbc = DBConnector("sqlite:///./water-mons.sqllite")
        dbc.declare_schema()
        os.remove('./water-mons.sqllite')
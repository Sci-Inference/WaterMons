import os
import yaml
import json
import datetime
import numpy as np
import pandas as pd
from flask import request
from flask import Response
from numpy.core import records
from sqlalchemy import and_, or_, not_
from flask_cors import CORS, cross_origin
from flask import Flask, send_from_directory
from water_mons.connection.data_schema import *
from water_mons.connection.sqlalchemy_connector import DBConnector
from water_mons.connection.online_stock_connector import StockConnector
from water_mons.flask_blueprint import portfolio_route,strategy_route,risk_assessment_route
from water_mons.performance.performance import Strategy_Performance,Portfolio_Performance,PerformanceBase

app = Flask(__name__, static_folder='../ui/build')
app.register_blueprint(portfolio_route.app)
app.register_blueprint(strategy_route.app)
app.register_blueprint(risk_assessment_route.app)
cors = CORS(app)

def read_config():
    with open("config.yaml", 'r') as stream:
        try:
            return yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            print(exc)


# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')



@app.route("/db/getStockData",methods=['POST','GET'])
def get_stock_data():
    data = request.json
    tickerList = data['ticker']
    startDate = data['startDate']
    endDate = data['endDate']
    conStr = read_config()['data_connection']['STOCK_CONNECTION']
    res = []
    for i in tickerList:
        dbc = StockConnector(i,conStr)
        df = dbc.get_data(startDate,endDate)
        df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
        res.extend(df.to_dict('records'))
    return Response(json.dumps(res,default=str),mimetype='application/json')

def run():
    app.run(use_reloader=True, port=5000, threaded=True)


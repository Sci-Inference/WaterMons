import os
import yaml
import json
import datetime
from flask import request
from flask import Response
from flask_cors import CORS, cross_origin
from flask import Flask, send_from_directory
from water_mons.connection.data_schema import *
from water_mons.connection.sqlalchemy_connector import DBConnector
from water_mons.connection.online_stock_connector import StockConnector

app = Flask(__name__, static_folder='../ui/build')
cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'

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


@app.route('/db/getPortfolio')
def get_portfolio():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    session = dbc.session()
    db_data = list(map(lambda x: dbc.sqlalchmey_to_dict(x),session.query(Portfolio).all()))
    session.close()
    return Response(json.dumps(db_data,default=str),mimetype='application/json')


@app.route('/db/createPortfolio',methods=['POST','GET'])
def create_portfolio():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    data = request.json
    print(data['createdDate'])
    dbc.create_portfolio(
        name=data['name'],
        description=data['description'],
        createdDate=datetime.datetime.strptime(data['createdDate'],'%Y-%m-%d')
        )
    return "200"

@app.route('/db/createPortfolioStocks',methods=['POST'])
def create_portfolio_stocks():
    conStr = read_config()['data_connection']['DATABASE_CONNECTION']
    dbc = DBConnector(conStr)
    data = request.json
    print(data)
    for i in data:
        i['createdDate'] = datetime.datetime.strptime(i['createdDate'],'%Y-%m-%d')
    dbc.insert_portfolio_stocks(data)
    return "200"


@app.route("/db/getStockData",methods=['POST','GET'])
def get_stock_data():
    data = request.json
    tickerList = data['ticker']
    print(data['ticker'])
    startDate = data['startDate']
    endDate = data['endDate']
    conStr = read_config()['data_connection']['STOCK_CONNECTION']
    res = []
    for i in tickerList:
        dbc = StockConnector(i,conStr)
        df = dbc.get_data(startDate,endDate)
        df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
        res.extend(df.to_dict('records'))
    print(res)
    return Response(json.dumps(res,default=str),mimetype='application/json')


@app.route('/db/getPortfolioData')
def get_portfolio_data():
    return 







def run():
    app.run(use_reloader=True, port=5000, threaded=True)


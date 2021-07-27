import os
import yaml
import datetime
from sqlalchemy import select
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from flask import Flask, send_from_directory
from water_mons.connection.data_schema import *
from water_mons.connection.sqlalchemy_connector import DBConnector


app = Flask(__name__, static_folder='../ui/build')



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
    query = select(Portfolio)
    return "200"


@app.route('/db/createPortfolio')
def create_portfolio():
    return "200"




def run():
    app.run(use_reloader=True, port=5000, threaded=True)


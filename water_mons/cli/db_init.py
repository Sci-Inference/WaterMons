import yaml
from water_mons.connection.sqlalchemy_connector import DBConnector


def read_config():
    with open("config.yaml", 'r') as stream:
        try:
            return yaml.safe_load(stream)
        except yaml.YAMLError as exc:
            print(exc)


def run ():
    config = read_config()
    dbc = DBConnector(config['data_connection']['DATABASE_CONNECTION'])
    dbc.declare_schema()
    print('successfully create database')
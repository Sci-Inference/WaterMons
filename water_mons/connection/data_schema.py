import sqlalchemy
from sqlalchemy.orm import relationship
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql.sqltypes import DateTime, INTEGER,TEXT
from sqlalchemy import Column, Integer, String,DATETIME,FLOAT,null,ForeignKey


Base = declarative_base()


class Portfolio_Stock(Base):
    __tablename__='portfolio_stock'
    uuidColumn = Column('stock_id',INTEGER,primary_key=True, autoincrement=True)
    ticker = Column('ticker',String)
    createdDate = Column('created',DateTime)
    stock_option = Column('option',String)
    purchasePrice = Column('purchased_price',FLOAT,default=null,nullable=True)
    purchaseNumber = Column('purchased_number',INTEGER,default=0,nullable=True)
    portfolio_name = Column(Integer, ForeignKey('portfolio.portfolio_name'))


class Portfolio(Base):
    __tablename__ = 'portfolio'
    name = Column('portfolio_name',String,primary_key=True)
    description = Column('description',TEXT)
    createdDate = Column('created',DATETIME)
    stock = relationship("Portfolio_Stock")
    
class Strategy(Base):
    __tablename__ = 'strategy'
    name = Column('strategy_name',String,primary_key=True)
    desc = Column('description',TEXT)
    createdDate = Column('created',DATETIME)
    stock = relationship("Strategy_Stock")

class Strategy_Stock(Base):
    __tablename__='strategy_stock'
    uuidColumn = Column('stock_id',INTEGER,primary_key=True, autoincrement=True)
    ticker = Column('ticker',String)
    createdDate = Column('created',DateTime)
    stock_signal = Column('signal',String)
    strategy_name = Column(Integer, ForeignKey('strategy.strategy_name'))
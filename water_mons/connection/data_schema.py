from sqlalchemy.orm import relationship
from sqlalchemy.orm import declarative_base
from sqlalchemy.sql.sqltypes import DateTime, INTEGER
from sqlalchemy import Column, Integer, String,DATETIME,FLOAT,null,ForeignKey



Base = declarative_base()


class Stock(Base):
    __tablename__='stock'
    ticker = Column('ticker',String,primary_key= True)
    createdDate = Column('created',DateTime)
    purchasePrice = Column('purchased_price',FLOAT,default=null)
    purchaseNumber = Column('purchased_number',INTEGER,default=0)
    strategy = relationship("Strategy")
    strategy = relationship("Portfolio")

class Strategy(Base):
    __tablename__ = 'strategy'
    name = Column('strategy_name',String)
    createdDate = Column('created',DATETIME)
    strategyId = Column('strategy_id',Integer,primary_key=True)
    stockId = Column(Integer, ForeignKey('stock.ticker'))


class Portfolio(Base):
    __tablename__ = 'portfolio'
    name = Column('portfolio_name',String)
    createdDate = Column('created',DATETIME)
    portfolioId = Column('portfolio_id',Integer,primary_key=True)
    stockId = Column(Integer, ForeignKey('stock.ticker'))


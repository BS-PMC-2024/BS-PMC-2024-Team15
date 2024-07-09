from db import db
# this now becomes a mapping between a row in a table to a python class
# in addition, any class that we create that maps to a table with columns
# SQLAlchemy will automatically be able to handle turning those table rows into Python objects.

class ItemModel(db.Model):
    __tablename__ = "items"
    # the id column excepts Integer as key
    id = db.Column(db.Integer, primary_key=True)
    # the name most be unique , it cannot be empty(nullable=False), 
    # and its max length is 80
    name = db.Column(db.String(80), unique=True, nullable=False)
    description = db.Column(db.String)
    price = db.Column(db.Float(precision=2), unique=False, nullable=False)
    # one to many - will type db.ForeignKey() and inside the brackets 
    # give him the table name and the Column name.
    store_id = db.Column(db.Integer, db.ForeignKey("stores.id"), unique=False, nullable=False)
    # get a store object or store Model
    # the stores table is used by StoreModel class
    # so when we have a store ID that is uisng the stores table, we can then define a
    # relationship with the StoreModel class and it will automatically populate the
    # store variable with a StoreModel object whose ID matches that of the foreign key
    store = db.relationship("StoreModel", back_populates="items")

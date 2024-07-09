from db import db

class StoreModel(db.Model):
    __tablename__ = "stores"
    # the id column excepts Integer as key
    id = db.Column(db.Integer, primary_key=True)
    # the name most be unique , it cannot be empty(nullable=False), 
    # and its max length is 80
    name = db.Column(db.String(80), unique=True, nullable=False)
    items = db.relationship("ItemModel", back_populates="store", lazy="dynamic", cascade="all, delete")
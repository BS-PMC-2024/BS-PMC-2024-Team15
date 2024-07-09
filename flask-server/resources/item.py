from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask_jwt_extended import jwt_required
from sqlalchemy.exc import SQLAlchemyError

from db import db
from models import ItemModel
from schemas import ItemSchema,ItemUpdateSchema

blp = Blueprint("Items", __name__, description="Operations on items")


@blp.route("/item/<int:item_id>")
class Item(MethodView):
    @blp.response(200,ItemSchema)
    def get(self, item_id):
        # get_or_404 - it retrieves the item from the database using the items primary key
        # if it didnt find it in the data base it abort with 404 status code.
        item = ItemModel.query.get_or_404(item_id)
        return item

    def delete(self, item_id):
        item = ItemModel.query.get_or_404(item_id)
        db.session.delete(item)
        db.session.commit()
        return {"message":"Item Deleted."}

    @blp.arguments(ItemUpdateSchema)
    @blp.response(200,ItemSchema)
    def put(self, item_data,item_id):
        item = ItemModel.query.get(item_id)
        if item:
            item.price = item_data["price"]
            item.name = item_data["name"]
        else:
            item = ItemModel(id=item_id,**item_data)

            db.session.add(item)
            db.session.commit()

        return item

@blp.route("/item")
class ItemList(MethodView):
    @blp.response(200,ItemSchema(many=True))
    def get(self):
        return ItemModel.query.all()

# how ti use JWT ?
# add  @jwt_required() above every endpoint that you want the user to have to log in
# and have access token and include the access token in the headers in the insomnia.
# make sure to add Bearer and space before paste the token.

    @jwt_required()
    @blp.arguments(ItemSchema)
    @blp.response(201,ItemSchema)
    def post(self,item_data):
        # this method creats new item
        # the double ** gonna make the item_data which is in JSON format
        # because its comes from the API - into a keywords arguments.
        # the item_data will contain all the fields we needed for the table.
        item = ItemModel(**item_data)
        try:
            # the item_data dont contain item id.
            # only after we add it to the database, the database will
            # generate for him the id
            db.session.add(item)
            db.session.commit()
        except SQLAlchemyError:
            abort(
                500,
                message="An error occurred while inserting the item.")
        return item

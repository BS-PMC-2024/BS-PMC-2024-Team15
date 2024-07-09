from marshmallow import Schema,fields 

# here we are going to define the fields and how
# they behave in terms of input and uotput.
# marshmallow is used for data validation using schemas.

class PlainItemSchema(Schema):
    # should this fiels be used when loading data coming from a 
    # request or when returning data from our API.
    # because id is a field we generate ourselves
    # its never gonna come in a request we only want to 
    # use it for returning data.so well set dump_only = True.
    id = fields.Str(dump_only = True)
    name = fields.Str(required=True)
    price = fields.Float(required=True)


class PlainStoreSchema(Schema):
    # id is only when we want to send data back to client
    # so thats why dump_only = True
    id = fields.Str(dump_only = True)
    name = fields.Str(required=True)


class ItemUpdateSchema(Schema):
    # both name and price are optional for update method.
    name = fields.Str()
    price = fields.Float()
    store_id = fields.Int()

class ItemSchema(PlainItemSchema):
    # id = fields.Str(dump_only = True)
    # name = fields.Str(required=True)
    # price = fields.Float(required=True)
    # have all this fields because it inherit from PlainItemSchema

    # whenever we use ItemSchema were gonna be able to pss in the store_id 
    # when were receiving data from the client.
    store_id = fields.Int(required=True, load_only=True)
    # this store below will only be used when returning data to the client.
    store = fields.Nested(PlainStoreSchema(), dump_only=True)


class StoreSchema(PlainStoreSchema):
    items = fields.List(fields.Nested(PlainItemSchema()), dump_only=True)

    
class UserSchema(Schema):
    id = fields.Int(dump_only=True)
    username = fields.Str(required=True)
    password = fields.Str(required=True, load_only=True)
    # load_only=True,is to make sure that the password is never being sent to the client
    
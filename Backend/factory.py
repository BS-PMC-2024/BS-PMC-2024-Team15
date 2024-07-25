from flask import Flask, request, jsonify
from flask_smorest import Api
from flask_cors import CORS
import pyrebase
import firebase_admin
from firebase_admin import credentials, firestore, auth
import requests
import os
from dotenv import load_dotenv
import json


def create_app():
    app = Flask(__name__)
    CORS(app)
    

    load_dotenv()

    if not firebase_admin._apps:
        cred = credentials.Certificate(os.getenv('guy_path'))
        firebase_admin.initialize_app(cred)
        print(cred)

    # get the fireBase config from the .env file 
    firebaseConfig_str = os.getenv('firebase_config')
    firebaseConfig = json.loads(firebaseConfig_str)

    # Initialize Firebase using Pyrebase (authentication part)
    firebase = pyrebase.initialize_app(firebaseConfig)
    app.config["PYREBASE_AUTH"] = firebase.auth()
   
    # Initialize Firestore client
    firestore_db = firestore.client()
    app.config["FIRESTORE_DB"] = firestore_db

    app.config["API_TITLE"] = "Study Buddy API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.2"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

    api = Api(app)

    from resources.users import blp as UserBlueprint
    app.firestore_db = firestore_db
    api.register_blueprint(UserBlueprint)
    
    return app
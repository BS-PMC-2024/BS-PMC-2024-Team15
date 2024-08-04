
from factory import create_app
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import pyrebase
import firebase_admin
from firebase_admin import credentials, firestore, auth ,storage
import requests
import datetime 


logging.basicConfig(level=logging.INFO)

app = create_app()


if __name__ == "__main__":



from flask import Flask, request, jsonify
from flask_cors import CORS
import pyrebase
import firebase_admin
from firebase_admin import credentials, firestore


app = Flask(__name__)
CORS(app)  # Add this line

# Initialize Firebase Admin SDK (replace with your service account key JSON file)
cred = credentials.Certificate('.\Backend\group15-c52b4-firebase-adminsdk-9fzt0-4e6545fa15.json')
firebase_admin.initialize_app(cred)

# Initialize Firebase using Pyrebase (authentication part)
firebaseConfig = {
    "apiKey": "AIzaSyDi-_EhOOe1eRXJ3k85TSxn9S_IlH9DsME",
    "authDomain": "group15-c52b4.firebaseapp.com",
    "databaseURL": "https://group15-c52b4.firebaseio.com",  # This is for Realtime Database, not needed for Firestore
    "projectId": "group15-c52b4",
    "storageBucket": "group15-c52b4.appspot.com",
    "messagingSenderId": "236992549934",
    "appId": "1:236992549934:web:6bffbe0112d39dacb73bbf",
    "measurementId": "G-T4CMSJXL1F"
}

firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()
db = firebase.database()

# Initialize Firestore client
firestore_db = firestore.client()

# Register call
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    dateOfBirth = data.get('dateOfBirth')
    userType = data.get('type')
    receiveNews = data.get('receiveNews')

    try:
        # Create user in Firebase Authentication
        user = auth.create_user_with_email_and_password(email, password)

        # Store additional user data in Firestore
        user_data = {
            'email': email,
            'dateOfBirth': dateOfBirth,
            'type': userType,
            'receiveNews': receiveNews
        }
        firestore_db.collection('users').add(user_data)

        return jsonify({"message": "User registered successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

#Login Call  
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('username')
    password = data.get('password')

    try:
        user = auth.sign_in_with_email_and_password(email, password)
        return jsonify({"message": "Login Successful", "access_token": user['idToken']}), 200
    except Exception as e:
        return jsonify({"message": "Invalid credentials."}), 400

#Logout
@app.route('/logout', methods=['POST'])
def logout():
    # Invalidate token logic if necessary
    return jsonify({"message": "Logged out successfully"}), 200

#add event
@app.route('/add_event', methods=['POST'])
def add_event():
    data = request.get_json()
    title = data.get('title')
    startTime = data.get('startTime')
    duration = data.get('duration')
    importance = data.get('importance')
    description = data.get('description')

    try:
        # Add event to Firestore collection 'events'
        
        event_ref = {
            'title': title,
            'startTime': startTime,
            'duration': duration,
            'importance': importance,
            'description': description,
            'createdAt': firestore.SERVER_TIMESTAMP  # Optional: Timestamp of creation
        }
        firestore_db.collection('events').add(event_ref)

        return jsonify({"message": "Event added successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
import pyrebase
import firebase_admin
from firebase_admin import credentials, firestore,auth
import requests


app = Flask(__name__)
CORS(app)  # Add this line

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    # Initialize Firebase Admin SDK (replace with your service account key JSON file)
    # if need to run in the docker conteiner change to this: /Backend/group15-c52b4-firebase-adminsdk-9fzt0-4e6545fa15.json
    cred = credentials.Certificate('./Backend/group15-c52b4-firebase-adminsdk-9fzt0-4e6545fa15.json')
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


def verify_firebase_token(id_token):
    verify_url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={firebaseConfig['apiKey']}"

    response = requests.post(verify_url, json={'idToken': id_token})
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Token verification failed")



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
        id = user['localId']
        # Store additional user data in Firestore
        user_data = {
            'user_id':id,
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
        id_token = user['idToken']
        return jsonify({"message": "Login Successful", "access_token": id_token}), 200
    except Exception as e:
        return jsonify({"message": "Invalid credentials."}), 400


#Logout
@app.route('/logout', methods=['POST'])
def logout():
    # Invalidate token logic if necessary
    return jsonify({"message": "Logged out successfully"}), 200


@app.route('/add_event', methods=['POST'])
def add_event():
    try:
        # Verify the ID token and get the user ID
        auth_header = request.headers.get('Authorization')
        print("Authorization Header:", auth_header)  # Debugging line
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Missing or invalid token"}), 401

        id_token = auth_header.split(' ')[1]  # Extract the token from the 'Authorization' header
        print("ID Token:", id_token)  # Debugging line

        # Verify token with Firebase REST API
        decoded_token = verify_firebase_token(id_token)
        user_id = decoded_token['users'][0]['localId']
        print("User ID:", user_id)  # Debugging line

        # Extract event data from request
        data = request.get_json()
        print("Request Data:", data)  # Debugging line
        title = data.get('title')
        startTime = data.get('startTime')
        duration = data.get('duration')
        importance = data.get('importance')
        description = data.get('description')

        if not title or not startTime or not duration or not importance or not description:
            return jsonify({"message": "Missing event data"}), 400

        # Add event to Firestore collection 'events'
        event_ref = {
            'title': title,
            'startTime': startTime,
            'duration': duration,
            'importance': importance,
            'description': description,
            'user_id': user_id,  # Associate the event with the user ID
            'createdAt': firestore.SERVER_TIMESTAMP  # Optional: Timestamp of creation
        }
        firestore_db.collection('events').add(event_ref)

        return jsonify({"message": "Event added successfully"}), 200
    except Exception as e:
        print("Error:", str(e))  # Debugging line
        return jsonify({"message": str(e)}), 400



    

#get events
@app.route('/get_events', methods=['GET'])
def get_events():
    try:
        # Verify the ID token and get the user ID
        auth_header = request.headers.get('Authorization')
        # print("Authorization Header:", auth_header)  # Debugging line
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Missing or invalid token"}), 401

        id_token = auth_header.split(' ')[1]  # Extract the token from the 'Authorization' header
        # print("ID Token:", id_token)  # Debugging line

        # Verify token with Firebase REST API
        decoded_token = verify_firebase_token(id_token)
        user_id = decoded_token['users'][0]['localId']
        # print("User ID:", user_id)  # Debugging line

        # Query events associated with the user ID
        events_ref = firestore_db.collection('events').where('user_id', '==', user_id)
        events = events_ref.stream()

        events_list = []
        for event in events:
            event_data = event.to_dict()
            event_data['id'] = event.id
            events_list.append(event_data)

        return jsonify(events_list), 200
    except Exception as e:
        print("Error:", str(e))  # Debugging line
        return jsonify({"message": str(e)}), 400


    
#remove event
@app.route('/remove_event/<eventId>', methods=['DELETE'])
def remove_event(eventId):
    try:
        # Delete event from Firestore
        firestore_db.collection('events').document(eventId).delete()
        return jsonify({"message": "Event removed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

#update event
@app.route('/update_event/<eventId>', methods=['PUT'])
def update_event(eventId):
    try:
        event_data = request.json
        # Update event in Firestore
        firestore_db.collection('events').document(eventId).update(event_data)
        return jsonify({"message": "Event updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    app.run(debug=True)

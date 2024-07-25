from flask import Flask, request, jsonify
from flask_cors import CORS
import pyrebase
import firebase_admin
from firebase_admin import credentials, firestore, auth
import requests
import os
from dotenv import load_dotenv
import json

load_dotenv()

app = Flask(__name__)
CORS(app)


# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    # Initialize Firebase Admin SDK (replace with your service account key JSON file)
    # if need to run in the docker conteiner change to this: docker_path

    cred = credentials.Certificate(os.getenv('guy_path'))
    firebase_admin.initialize_app(cred)

# get the fireBase config from the .env file 
firebaseConfig_str = os.getenv('firebase_config')
firebaseConfig = json.loads(firebaseConfig_str)

# Initialize Firebase using Pyrebase (authentication part)
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

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Register data received:", data)

    email = data.get('email')
    password = data.get('password')
    dateOfBirth = data.get('dateOfBirth')
    userType = data.get('type')
    receiveNews = data.get('receiveNews')

    try:
        user = auth.create_user_with_email_and_password(email, password)
        id = user['localId']
        user_data = {
            'user_id': id,
            'email': email,
            'dateOfBirth': dateOfBirth,
            'type': userType,
            'receiveNews': receiveNews
        }
        firestore_db.collection('users').add(user_data)
        return jsonify({"message": "User registered successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Something went wrong pleasr try again."}), 400

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

@app.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200

#new event
@app.route('/add_event', methods=['POST'])
def add_event():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Missing or invalid token"}), 401

        id_token = auth_header.split(' ')[1]
        id_token = auth_header.split(' ')[1]
        decoded_token = verify_firebase_token(id_token)
        user_id = decoded_token['users'][0]['localId']

        data = request.get_json()
        title = data.get('title')
        startTime = data.get('startTime')
        duration = data.get('duration')
        importance = data.get('importance')
        description = data.get('description')
        eventType = data.get('eventType')

        if not title or not startTime or not duration or not importance or not description or not eventType:
            return jsonify({"message": "Missing event data"}), 400

        event_ref = {
            'title': title,
            'startTime': startTime,
            'duration': duration,
            'importance': importance,
            'description': description,
            'eventType': eventType,
            'user_id': user_id,
            'createdAt': firestore.SERVER_TIMESTAMP
        }
        doc_ref = firestore_db.collection('events').add(event_ref)
        event_id = doc_ref[1].id  # Get the generated document ID
        return jsonify({"message": "Event added successfully","id":event_id}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"message": str(e)}), 400

@app.route('/get_events', methods=['GET'])
def get_events():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Missing or invalid token"}), 401

        id_token = auth_header.split(' ')[1]
        decoded_token = verify_firebase_token(id_token)
        user_id = decoded_token['users'][0]['localId']

        events_ref = firestore_db.collection('events').where('user_id', '==', user_id)
        events = events_ref.stream()

        events_list = []
        for event in events:
            event_data = event.to_dict()
            event_data['id'] = event.id
            events_list.append(event_data)

        return jsonify(events_list), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@app.route('/remove_event/<eventId>', methods=['DELETE'])
def remove_event(eventId):
    try:
        firestore_db.collection('events').document(eventId).delete()
        return jsonify({"message": "Event removed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/update_event/<eventId>', methods=['PUT'])
def update_event(eventId):
    try:
        event_data = request.json
        firestore_db.collection('events').document(eventId).update(event_data)
        return jsonify({"message": "Event updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

#get user doc-information 
@app.route('/get_user', methods=['GET'])
def get_user():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Missing or invalid token"}), 401

        id_token = auth_header.split(' ')[1]
        decoded_token = verify_firebase_token(id_token)
        user_id = decoded_token['users'][0]['localId']

        users_ref = firestore_db.collection('users')
        query = users_ref.where('user_id', '==', user_id).limit(1).stream()
        user_data = next(query, None)

        if user_data:
            user_info = user_data.to_dict()
            return jsonify(user_info), 200
        else:
            return jsonify({"message": "User not found"}), 404

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"message": str(e)}), 400


#update user information
@app.route('/update_user', methods=['PUT'])
def update_user():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Missing or invalid token"}), 401

        id_token = auth_header.split(' ')[1]
        decoded_token = verify_firebase_token(id_token)
        user_id = decoded_token['users'][0]['localId']

        data = request.get_json()
        user_ref = firestore_db.collection('users').where('user_id', '==', user_id).limit(1).stream()

        for doc in user_ref:
            firestore_db.collection('users').document(doc.id).update(data)

        return jsonify({"message": "User profile updated successfully"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@app.route('/delete_user', methods=['POST'])
def delete_user():
    
    data = request.get_json()
    print("Delete account data received:", data)

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    try:
        # Sign in the user to get the user ID
        user = auth.sign_in_with_email_and_password(email, password)
        id = user['localId']

        # Delete user from Firebase Authentication
        firebase_admin.auth.delete_user(id)
        
        # Find the document with the user ID in Firestore
        users_ref = firestore_db.collection('users')
        user_docs = users_ref.where('user_id', '==', id).stream()

        for doc in user_docs:
            doc.reference.delete()

        return jsonify({"message": "User account deleted successfully"}), 200
    except Exception as e:
        return jsonify({"message": f"Unexpected error: {str(e)}"}), 400



if __name__ == '__main__':
    app.run(debug=True ,host="0.0.0.0", port=5000)


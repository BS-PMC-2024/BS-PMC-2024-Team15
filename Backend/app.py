from flask import Flask, request, jsonify
from flask_cors import CORS
import pyrebase
import firebase_admin
from firebase_admin import credentials, firestore, auth ,storage
import requests

app = Flask(__name__)
CORS(app)

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
    cred = credentials.Certificate('/Backend/group15-c52b4-firebase-adminsdk-9fzt0-4e6545fa15.json')

    # Specify the storageBucket option
    firebase_admin.initialize_app(cred, {
        'storageBucket': 'group15-c52b4.appspot.com'  # Replace with your actual bucket name
    })

# Initialize Firebase using Pyrebase (authentication part)
firebaseConfig = {
    "apiKey": "AIzaSyDi-_EhOOe1eRXJ3k85TSxn9S_IlH9DsME",
    "authDomain": "group15-c52b4.firebaseapp.com",
    "databaseURL": "https://group15-c52b4-default-rtdb.firebaseio.com",
    "projectId": "group15-c52b4",
    "storageBucket": "group15-c52b4.appspot.com",
    "messagingSenderId": "236992549934",
    "appId": "1:236992549934:web:6bffbe0112d39dacb73bbf",
    "measurementId": "G-T4CMSJXL1F"
}

firebase = pyrebase.initialize_app(firebaseConfig)
auth = firebase.auth()
db = firebase.database()
bucket = storage.bucket()

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
        return jsonify({"message": str(e)}), 400

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


#upload image
@app.route('/upload_image', methods=['POST'])
def upload_image():
    try:
        auth_header = request.headers.get('Authorization')
        print(f"Authorization Header: {auth_header}")  # Log the Authorization header
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Missing or invalid token"}), 401

        id_token = auth_header.split(' ')[1]
        decoded_token = verify_firebase_token(id_token)
        print(f"Decoded Token: {decoded_token}")  # Log the decoded token
        user_id = decoded_token['users'][0]['localId']

        if 'file' not in request.files:
            return jsonify({'message': 'No file part'}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({'message': 'No selected file'}), 400

        # Create a blob object with the file name
        blob = bucket.blob(user_id + '/' + file.filename)
        blob.upload_from_file(file)

        # Make the blob publicly accessible
        blob.make_public()

        return jsonify({'file_url': blob.public_url}), 200
    except Exception as e:
        print("Error:", str(e))
        return jsonify({'message': str(e)}), 400



#new event
@app.route('/add_event', methods=['POST'])
def add_event():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Missing or invalid token"}), 401

        id_token = auth_header.split(' ')[1]
        decoded_token = verify_firebase_token(id_token)
        user_id = decoded_token['users'][0]['localId']

        data = request.get_json()
        print(f"Received data: {data}")  # Debugging statement

        title = data.get('title')
        startTime = data.get('startTime')
        duration = data.get('duration')
        importance = data.get('importance')
        description = data.get('description')
        eventType = data.get('eventType')
        imageUrl = data.get('imageUrl')  # Optional

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
            'imageUrl': imageUrl,  # Save image URL if provided
            'createdAt': firestore.SERVER_TIMESTAMP
        }
        doc_ref = firestore_db.collection('events').add(event_ref)
        event_id = doc_ref.id  # Get the generated document ID
        return jsonify({"message": "Event added successfully", "id": event_id}), 200

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
        # Fetch the event data to get the photo URL
        event_doc = firestore_db.collection('events').document(eventId).get()
        if not event_doc.exists:
            return jsonify({"message": "Event not found"}), 404

        event_data = event_doc.to_dict()
        image_url = event_data.get('imageUrl')
        
        # Delete the event document from Firestore
        firestore_db.collection('events').document(eventId).delete()
        
        # Remove the photo from Firebase Storage if it exists
        if image_url:
            # Extract the file path from the URL
            # Example: "https://storage.googleapis.com/group15-c52b4.appspot.com/VQNrh6W2YyOEIpFjpKaezV5Lqto1/sce.png"
            file_path = image_url.split("group15-c52b4.appspot.com/")[1]
            blob = bucket.blob(file_path)
            #blob.delete()

        return jsonify({"message": "Event removed successfully"}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 400

@app.route('/update_event/<eventId>', methods=['PUT'])
def update_event(eventId):
    try:
        event_data = request.json
        
        # Fetch the current event data to get the old photo URL
        event_doc = firestore_db.collection('events').document(eventId).get()
        if not event_doc.exists:
            return jsonify({"message": "Event not found"}), 404

        current_event_data = event_doc.to_dict()
        old_image_url = current_event_data.get('imageUrl')
        new_image_url = event_data.get('imageUrl')

        # Delete the old photo blob if a new photo URL is provided and it is different from the old one
        if new_image_url and old_image_url and new_image_url != old_image_url:
            old_file_path = old_image_url.split("group15-c52b4.appspot.com/")[1]
            old_blob = bucket.blob(old_file_path)
            old_blob.delete()

        # Update the event document with the new data
        firestore_db.collection('events').document(eventId).update(event_data)
        
        return jsonify({"message": "Event updated successfully"}), 200

    except Exception as e:
        print("Error:", str(e))
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


#get user type
@app.route('/get_user_type', methods=['POST'])
def get_user_type():
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
            user_type = user_info['type']
            print (user_info)
            return jsonify({'user_type': user_type}), 200
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



#get event posts
@app.route('/get_event_Posts', methods=['GET'])
def get_event_posts():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Missing or invalid token"}), 401

        id_token = auth_header.split(' ')[1]
        decoded_token = verify_firebase_token(id_token)
        user_id = decoded_token['users'][0]['localId']

        events_ref = firestore_db.collection('posts').where('user_id', '==', 'Admin')
        events = events_ref.stream()

        events_list = []
        for event in events:
            event_data = event.to_dict()
            event_data['id'] = event.id
            events_list.append(event_data)

        return jsonify(events_list), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    

#add Post.
@app.route('/add_post', methods=['POST'])
def add_post():
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"message": "Missing or invalid token"}), 401

        id_token = auth_header.split(' ')[1]
        decoded_token = verify_firebase_token(id_token)

        data = request.get_json()
        title = data.get('title')
        startTime = data.get('startTime')
        duration = data.get('duration')
        importance = data.get('importance')
        description = data.get('description')
        eventType = data.get('eventType')
        imageUrl = data.get('imageUrl')  # Optional
        
        if not title or not startTime or not duration or not importance or not description or not eventType:
            return jsonify({"message": "Missing event data"}), 400

        event_ref = {
            'title': title,
            'startTime': startTime,
            'duration': duration,
            'importance': importance,
            'description': description,
            'eventType': eventType,
            'user_id': 'Admin',
            'imageUrl': imageUrl,
            'createdAt': firestore.SERVER_TIMESTAMP
            
        }
        doc_ref = firestore_db.collection('posts').add(event_ref)
        event_id = doc_ref[1].id  # Get the generated document ID
        return jsonify({"message": "Post added successfully","id":event_id}), 200

    except Exception as e:
        print("Error:", str(e))
        return jsonify({"message": str(e)}), 400
    
#remove post
@app.route('/remove_post/<postId>', methods=['DELETE'])
def remove_post(postId):
    try:
        firestore_db.collection('posts').document(postId).delete()
        return jsonify({"message": "Post removed successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# update post
@app.route('/update_post/<postId>', methods=['PUT'])
def update_post(postId):
    try:
        post_data = request.json
        firestore_db.collection('posts').document(postId).update(post_data)
        return jsonify({"message": "Post updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400



if __name__ == '__main__':
    app.run(debug=True ,host="0.0.0.0", port=5000)


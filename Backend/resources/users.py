from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import request, jsonify, current_app
import firebase_admin
from firebase_admin import credentials, firestore, auth
import requests

blp = Blueprint('users', __name__, description='Operations on users')


def verify_firebase_token(id_token):
    firebase_config = current_app.config['FIREBASE_CONFIG']
    verify_url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={firebase_config['apiKey']}"
    response = requests.post(verify_url, json={'idToken': id_token})
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Token verification failed")

@blp.route('/register', methods=['POST'])
class userRegister(MethodView):
    def post(self):
        data = request.get_json()
        print("Register data received:", data)

        email = data.get('email')
        password = data.get('password')
        dateOfBirth = data.get('dateOfBirth')
        userType = data.get('type')
        receiveNews = data.get('receiveNews')

        try:
            user = auth.create_user(
                email=email,
                password=password
            )
            user_data = {
                'user_id': user.uid,
                'email': email,
                'dateOfBirth': dateOfBirth,
                'type': userType,
                'receiveNews': receiveNews
            }
            
            firestore_db = current_app.config['FIRESTORE_DB']
            firestore_db.collection('users').add(user_data)

            return jsonify({"message": "User registered successfully"}), 200
        
        except firebase_admin.auth.AuthError as e:
            print(f"Firebase AuthError: {e}")
            return jsonify({"message": "Authentication failed", "error": str(e)}), 400
        
        except Exception as e:
            print(f"Error: {e}")  
            return jsonify({"message": "Something went wrong, please try again.", "error": str(e)}), 400
        
@blp.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Test route is working"}), 200

@blp.route('/login', methods=['POST'])
class userLogin(MethodView):
    def post(self):
        data = request.get_json()
        email = data.get('username')
        password = data.get('password')

        try:
            # Get Pyrebase auth from app context
            auth_client = current_app.config['PYREBASE_AUTH']
            
            # Sign in with email and password
            user = auth_client.sign_in_with_email_and_password(email, password)
            id_token = user['idToken']
            return jsonify({"message": "Login Successful", "access_token": id_token}), 200
        except Exception as e:
            print(f"Error: {e}")
            return jsonify({"message": "Invalid credentials.", "error": str(e)}), 400
        
@blp.route('/logout', methods=['POST'])
class userLogout(MethodView):
    def post(self):
        return jsonify({"message": "Logged out successfully"}), 200
    

@blp.route('/get_user_type',methods=['POST'])
class getUserType(MethodView):
    def post(self):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"message": "Missing or invalid token"}), 401

            id_token = auth_header.split(' ')[1]
            decoded_token = verify_firebase_token(id_token)
            user_id = decoded_token['users'][0]['localId']

            firestore_db = current_app.config['FIRESTORE_DB']
            users_ref = firestore_db.collection('users')
            query = users_ref.where('user_id', '==', user_id).limit(1).stream()
            user_data = next(query, None)

            if user_data:
                user_info = user_data.to_dict()
                user_type = user_info['type']
                print (user_type)
                return jsonify({'user_type': user_type}), 200
            else:
                return jsonify({"message": "User not found"}), 404

        except Exception as e:
            print("Error:", str(e))
            return jsonify({"message": str(e)}), 400
 
@blp.route('/get_user', methods=['GET'])
class getUser(MethodView):
    def get(self):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"message": "Missing or invalid token"}), 401

            id_token = auth_header.split(' ')[1]
            decoded_token = verify_firebase_token(id_token)
            user_id = decoded_token['users'][0]['localId']
            
            firestore_db = current_app.config['FIRESTORE_DB']
            users_ref = firestore_db.collection('users')
            query = users_ref.where('user_id', '==', user_id).limit(1).stream()
            user_data = next(query, None)

            if user_data:
                user_info = user_data.to_dict()
                print(user_info)
                return jsonify(user_info), 200
            else:
                return jsonify({"message": "User not found"}), 404

        except Exception as e:
            print("Error:", str(e))
            return jsonify({"message": str(e)}), 400
        
@blp.route('/update_user', methods=['PUT'])
class updateUser(MethodView):
    def put(self):
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"message": "Missing or invalid token"}), 401

            id_token = auth_header.split(' ')[1]
            decoded_token = verify_firebase_token(id_token)
            user_id = decoded_token['users'][0]['localId']

            data = request.get_json()

            firestore_db = current_app.config['FIRESTORE_DB']
            
            user_ref = firestore_db.collection('users').where('user_id', '==', user_id).limit(1).stream()

            for doc in user_ref:
                firestore_db.collection('users').document(doc.id).update(data)

            return jsonify({"message": "User profile updated successfully"}), 200
        except Exception as e:
            return jsonify({"message": str(e)}), 400
        
@blp.route('/delete_user', methods=['POST'])
class deleteUser(MethodView):
    def post(self):
        data = request.get_json()
        print("Delete account data received:", data)

        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        try:
            # Get Pyrebase auth from app context
            auth_client = current_app.config['PYREBASE_AUTH']
            
            # Sign in with email and password
            user = auth_client.sign_in_with_email_and_password(email, password)
            id_token = user['idToken']

            user_info = auth_client.get_account_info(id_token)
            user_id = user_info['users'][0]['localId']

            # Delete user from Firebase Auth
            firebase_admin.auth.delete_user(user_id)
            
            # Delete user data from Firestore
            firestore_db = current_app.config['FIRESTORE_DB']
            users_ref = firestore_db.collection('users')
            user_docs = users_ref.where('user_id', '==', user_id).stream()

            for doc in user_docs:
                doc.reference.delete()

            return jsonify({"message": "User account deleted successfully"}), 200
        except Exception as e:
            return jsonify({"message": f"Unexpected error: {str(e)}"}), 400

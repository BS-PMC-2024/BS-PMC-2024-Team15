from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import request, jsonify, current_app
import firebase_admin
from firebase_admin import credentials, firestore, auth

blp = Blueprint('users', __name__, description='Operations on users')

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
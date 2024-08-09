from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import request, jsonify, current_app
import firebase_admin
from firebase_admin import credentials, firestore, auth

import requests
import datetime
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
        firestore_db = current_app.config['FIRESTORE_DB']
        data = request.get_json()
        print("Register data received:", data)

        email = data.get('email')
        password = data.get('password')
        dateOfBirth = data.get('dateOfBirth')
        gender=data.get('gender')
        userType = data.get('type')
        receiveNews = data.get('receiveNews')
        fullName = data.get('fullName')
        icon = data.get('icon')
        planDay = data.get('planDay')
        stickSchedule = data.get('stickSchedule')
        satesfiedTasks = data.get('satesfiedTasks')
        deadlinedTasks = data.get('deadlinedTasks')
        prioritizeTasks = data.get('prioritizeTasks')
        courses = []

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
                'gender':gender,
                'receiveNews': receiveNews,
                'fullName': fullName,
                'icon': icon,
                'courses' : courses,
                'planDay': planDay,
                'stickSchedule': stickSchedule,
                'satesfiedTasks': satesfiedTasks,
                'deadlinedTasks': deadlinedTasks,
                'prioritizeTasks': prioritizeTasks,
                'createdAt': firestore.SERVER_TIMESTAMP
                }
            
            firestore_db.collection('users').add(user_data)
            return jsonify({"message": "User registered successfully"}), 200
        except Exception as e:
            return jsonify({"message": "Something went wrong pleasr try again."}), 400
            
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
        
#add course to studnet
@blp.route('/add_course_to_user', methods=['POST'])
class add_course_to_user(MethodView):
    def post(self):
        try:
            firestore_db = current_app.config['FIRESTORE_DB']
            # Extract and verify the ID token from the request headers
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"message": "Missing or invalid token"}), 401

            id_token = auth_header.split(' ')[1]
            decoded_token = verify_firebase_token(id_token)
            user_id = decoded_token['users'][0]['localId']

            # Get course ID from request data
            data = request.get_json()
            course_id = data.get('course_id')
            if not course_id:
                return jsonify({"message": "Course ID is required"}), 400

            # Fetch course details from the database
            course_ref = firestore_db.collection('courses').document(course_id)
            course = course_ref.get()
            if not course.exists:
                return jsonify({"message": "Course not found"}), 404
            course_data = course.to_dict()

            # Fetch user details or create a new user document if it doesn't exist
            user_ref = firestore_db.collection('users').where('user_id', '==', user_id).limit(1).stream()
            user_doc = next(user_ref, None)

            if user_doc:
                user_data = user_doc.to_dict()
                courses = user_data.get('courses', [])
                if course_id not in courses:
                    courses.append(course_id)
                    firestore_db.collection('users').document(user_doc.id).update({'courses': courses})
                            # Create events based on the course schedule
                    start_date = datetime.datetime.strptime(course_data['startDate'], '%Y-%m-%d')
                    duration_weeks = int(course_data['duration'].split()[0])  # Assuming duration is in weeks
                    end_date = start_date + datetime.timedelta(weeks=duration_weeks)
                    class_days = course_data['days']  # Assuming this is a list of weekdays, e.g., ['Sunday', 'Wednesday']

                    current_date = start_date
                    while current_date <= end_date:
                        if current_date.strftime('%A') in class_days:
                            event_ref = {
                                'title': f"{course_data['name']} Class", ############## FIX TIME AND 
                                'startTime': current_date.isoformat(),  # Assuming the class starts at the same time each day
                                'duration': "2:00",  ############## FIX TIME AND ACORDING TO COURSE DAYS INFO
                                'importance': 'High',
                                'description': f"Class for {course_data['name']}",
                                'eventType': 'Study',
                                'user_id': user_id,
                                'course_id': course_id,
                                'createdAt': firestore.SERVER_TIMESTAMP
                            }
                            firestore_db.collection('events').add(event_ref)
                        current_date += datetime.timedelta(days=1)

                    return jsonify({"message": "Course and events added successfully"}), 200


                else:
                    return jsonify({"message": "Course already added to user"}), 400
        except Exception as e:
            print("Error:", str(e))
            return jsonify({"message": str(e)}), 400

##remove course from studnet
@blp.route('/remove_course_from_user', methods=['POST'])
class remove_course_from_user(MethodView):
     def post(self):
        try:
            firestore_db = current_app.config['FIRESTORE_DB']
            # Extract and verify the ID token from the request headers
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"message": "Missing or invalid token"}), 401

            id_token = auth_header.split(' ')[1]
            decoded_token = verify_firebase_token(id_token)
            user_id = decoded_token['users'][0]['localId']

            # Get course ID from request data
            data = request.get_json()
            course_id = data.get('course_id')
            if not course_id:
                return jsonify({"message": "Course ID is required"}), 400

            # Fetch user details
            user_ref = firestore_db.collection('users').where('user_id', '==', user_id).limit(1).stream()
            user_doc = next(user_ref, None)

            if user_doc:
                user_data = user_doc.to_dict()
                courses = user_data.get('courses', [])
                if course_id in courses:
                    courses.remove(course_id)
                    firestore_db.collection('users').document(user_doc.id).update({'courses': courses})

                    # Remove all events associated with the user and course
                    events_ref = firestore_db.collection('events').where('user_id', '==', user_id).where('course_id', '==', course_id).stream()
                    for event in events_ref:
                        firestore_db.collection('events').document(event.id).delete()

                    return jsonify({"message": "Course and associated events removed successfully"}), 200
                else:
                    return jsonify({"message": "Course not found in user courses"}), 400
            else:
                return jsonify({"message": "User not found"}), 404

        except Exception as e:
            print("Error:", str(e))
            return jsonify({"message": str(e)}), 400

#get student courses
@blp.route('/get_student_courses', methods=['GET'])
class get_student_courses(MethodView):
    def get(self):
        try:
            firestore_db = current_app.config['FIRESTORE_DB']
            auth_header = request.headers.get('Authorization')
            if not auth_header or not auth_header.startswith('Bearer '):
                return jsonify({"message": "Missing or invalid token"}), 401

            id_token = auth_header.split(' ')[1]
            decoded_token = verify_firebase_token(id_token)
            user_id = decoded_token['users'][0]['localId']

            user_ref = firestore_db.collection('users').where('user_id', '==', user_id).limit(1).stream()
            user_doc = next(user_ref, None)

            if user_doc:
                user_data = user_doc.to_dict()
                user_courses = user_data.get('courses', [])
                return jsonify({"courses": user_courses}), 200
            else:
                return jsonify({"message": "User not found"}), 404
        except Exception as e:
            print("Error:", str(e))
            return jsonify({"message": str(e)}), 400



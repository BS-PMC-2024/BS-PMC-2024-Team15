from flask.views import MethodView
from flask_smorest import Blueprint, abort
from flask import request, jsonify, current_app
import firebase_admin
from firebase_admin import credentials, firestore, auth
import requests
import openai
import json
import datetime

blp = Blueprint('chatBot', __name__, description='AI assistant')

def get_current_date():
    return datetime.datetime.now().strftime("%Y-%m-%d")

def get_date_with_offset(offset):
    return (datetime.datetime.now() + datetime.timedelta(days=offset)).strftime("%Y-%m-%d")

from datetime import datetime, timedelta

def get_date_with_offset(offset):
    return (datetime.now() + timedelta(days=offset)).strftime("%Y-%m-%d")

def convert_time_to_iso(original_time, offset):
    # Get the date with the specified offset
    desired_date = get_date_with_offset(offset)
    
    # Split the time range to get the start time
    start_time_str = original_time.split("-")[0]
    
    # Combine date and time into a single string
    datetime_str = f"{desired_date} {start_time_str}"
    
    # Parse it into a datetime object
    dt = datetime.strptime(datetime_str, "%Y-%m-%d %H:%M")
    
    # Convert it to the desired ISO 8601 format
    formatted_time = dt.strftime("%Y-%m-%dT%H:%M:%SZ")
    
    return formatted_time


def get_completion(prompt, model="gpt-4o-mini"):
    openai.api_key = current_app.config.get('OPENAI_API_KEY')
    messages = [{"role": "user", "content": prompt}]
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=0
    )
    return response.choices[0].message["content"]

def get_completion_from_messages(messages, model="gpt-4o-mini", temperature=0):
    openai.api_key = current_app.config.get('OPENAI_API_KEY')
    response = openai.ChatCompletion.create(
        model=model,
        messages=messages,
        temperature=temperature,
    )
    return response.choices[0].message["content"]

def verify_firebase_token(id_token):
    firebase_config = current_app.config['FIREBASE_CONFIG']
    verify_url = f"https://identitytoolkit.googleapis.com/v1/accounts:lookup?key={firebase_config['apiKey']}"
    response = requests.post(verify_url, json={'idToken': id_token})
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception("Token verification failed")

# Initial context to inform the bot about his job.
context = [
    {'role': 'system', 'content': """
You are a smart assistant designed to help students plan effective study schedules to improve their 
performance in school or college and achieve their academic and personal goals.

1. **Gathering Information**:
   - Ask the user how many days they have until the test.
   - Ask the user how many hours they can dedicate to studying each day.
   - Ask the user what specific goals they want to achieve or if there are any specific topics they would like to practice.
   - Ask the user if they have any other commitments or activities that need to be considered while planning the study schedule.

2. **Proposing the Study Plan**:
   - Based on the user's input, propose a study plan.
   - Ask the user if they are satisfied with the proposed study plan.

3. **Feedback and Adjustment**:
   - If the user responds positively, return the details in JSON format.
   - If the user responds negatively, ask what they would like to change and update the study plan accordingly.

4. **Confirming Satisfaction**:
   - Make sure to ask the user if they liked the study plan before returning the JSON format.

5. **JSON Format**:
   - Here is an example of the JSON summary to return at the end of the conversation with the user. 
   The JSON should contain the following keys:
     - `num_of_days`: Holds the number of days the student plans to study.
     - `days`: An array where each element represents a day along with its date with the following structure:
       - `date`: The specific date. Use the get_current_date function to get the current date.
       - `tasks`: An array of tasks/events for that day. Each task/event should be a dictionary with the following keys:
         - `time`: The time allocated for the task/event.
         - `duration`: how much time is allocated for the task
         - `mission`: The description of the task/event.
         - `event_name`: A short name that describes the task/event.
         - `importance_level`: The importance level of the task/event, which can be 'low', 'medium', or 'high'.
          Rank them considering the `mission` value.
         - `event_type`: The type of the task/event, which can be 'study', 'social', or 'hobby'.

For example:

```json
{
  "num_of_days": 2,
  "days": [
    {
      "date": "{get_current_date()}",
      "tasks": [
        {
          "time": "8:00-10:00",
          "duration": 2:00,
          "mission": "learn math for 2 hours",
          "event_name": "Math Study",
          "importance_level": "high",
          "event_type": "study"
        },
        {
          "time": "10:00-10:15",
          "duration": 0:15,
          "mission": "take a break",
          "event_name": "Break",
          "importance_level": "low",
          "event_type": "hobby"
        },
        {
          "time": "10:15-12:15",
          "duration": 2:00,
          "mission": "learn complex algebra",
          "event_name": "Complex Algebra",
          "importance_level": "high",
          "event_type": "study"
        }
      ]
    },
    {
      "date": "{get_current_date()}",
      "tasks": [
        {
          "time": "8:00-10:00",
          "duration": 2:00,
          "mission": "learn physics for 2 hours",
          "event_name": "Physics Study",
          "importance_level": "high",
          "event_type": "study"
        },
        {
          "time": "10:00-10:15",
          "duration": 0:15,
          "mission": "take a break",
          "event_name": "Break",
          "importance_level": "low",
          "event_type": "hobby"
        },
        {
          "time": "10:15-12:15",
          "duration": 2:00,
          "mission": "learn quantum mechanics",
          "event_name": "Quantum Mechanics",
          "importance_level": "high",
          "event_type": "study"
        }
      ]
    }
  ]
}
```

remember to use the get_current_date function for the date value in the JSON format

6. **Detailed Task Planning**:
   - Ensure that the time is correctly split and clearly indicate the start and end times for each task.
    
    """}
]

# route the response from the openAI API to the client side 
@blp.route("/aibot", methods=["POST"])
class AIassistant(MethodView):
    def post(self): 
        data = request.get_json()
        prompt = data.get("user_input")
        action = data.get("action")
        flag = data.get("flag")

        id_token = None

        if(flag):   
          auth_header = request.headers.get('Authorization')
          if not auth_header or not auth_header.startswith('Bearer '):
              return jsonify({"message": "Missing or invalid token"}), 401

          id_token = auth_header.split(' ')[1]
          decoded_token = verify_firebase_token(id_token)
          user_id = decoded_token['users'][0]['localId']

          # Fetch the user's events
          if(decoded_token):
              firestore_db = current_app.config['FIRESTORE_DB']
              events_ref = firestore_db.collection('events').where('user_id', '==', user_id)
              events = events_ref.stream()

              events_list = []
              for event in events:
                  event_data = event.to_dict()
                  event_data['id'] = event.id
                  events_list.append(event_data)

              # Add the user's events to the context
              context.append({'role': 'system', 'content': f"User's upcoming events: {events_list}"})
              print(events_list)

          else:
              return jsonify({"message": str("error")}), 400
        
        if action == "Chat":
            context.append({'role': 'user', 'content': f"{prompt}"})
            response = get_completion_from_messages(context)
            context.append({'role': 'assistant', 'content': response.replace('**', '<br>')})
            return jsonify({'content': response.replace('\n', '<br>')
                            .replace('**','')
                            .replace('###','')
                            .replace('####','')})
        
        elif action == "Create Events":
            context.append(
                {'role': 'system', 'content':
                 "return the study plan in the JSON format like the example you have. "
                 "Make sure to avoid scheduling tasks at times when the user"
                 "already has other events on their calendar."},
            )
            response = get_completion_from_messages(context)
            # seprate the JSON part from the response.
            start = response.find('{')
            end = response.rfind('}') + 1
            json_string = response[start:end]

            # parse the JSON string
            summaryData = json.loads(json_string)
            if id_token:  # Check if id_token is available
                try:
                    ai_study_plan_url = "http://localhost:5000/AI_study_plan"  # Replace with your actual endpoint URL
                    headers = {
                        'Authorization': f'Bearer {id_token}',
                        'Content-Type': 'application/json'
                    }
                    response = requests.post(ai_study_plan_url, headers=headers, json=summaryData)
                    
                    if response.status_code == 200:
                        return jsonify("Study plan events created successfully"), 200
                    else:
                        return jsonify({"message": f"Failed to create events: {response.text}"}), response.status_code

                except Exception as e:
                    print("Error sending data to AI_study_plan:", str(e))
                    return jsonify({"message": str(e)}), 500
            else:
                return jsonify({"message": "ID token is missing or invalid"}), 400
        
        return jsonify({'content': 'Invalid action'}), 400
            
    

@blp.route("/AI_study_plan", methods=["POST"])
class AIassistant(MethodView):
    def post(self):
      data = request.get_json()
      action = data.get("action")

      auth_header = request.headers.get('Authorization')
      if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"message": "Missing or invalid token"}), 401

      id_token = auth_header.split(' ')[1]
      decoded_token = verify_firebase_token(id_token)
      user_id = decoded_token['users'][0]['localId']

      if action == "Create Events":
            context.append(
                {'role': 'system', 'content':
                 "return the study plan in the JSON format like the example you have. "},
            )
            response = get_completion_from_messages(context)
            start = response.find('{')
            end = response.rfind('}') + 1
            json_string = response[start:end]

            # parse the JSON string
            summaryData = json.loads(json_string)
# Process each day and task in the study plan
            for offset, day in enumerate(summaryData['days']):
                day["date"] = get_date_with_offset(offset)  # Update the date with the current date + offset
                for task in day["tasks"]:
                    print(f"  Event Name: {task['event_name']}")
                    print(f"  Date: {day['date']}")
                    print(f"  Time: {task['time']}")
                    print(f"  Duration: {task['duration']}")
                    print(f"  Mission: {task['mission']}")  
                    print(f"  Importance Level: {task['importance_level']}")
                    print(f"  Event Type: {task['event_type']}")
                    print("")

                    original_time = task['time']
                    print(original_time)
                    formatted_time = convert_time_to_iso(original_time, offset)
                    print(formatted_time)
                    event_ref = {
                          'title': task['event_name'],
                          'startTime': formatted_time,
                          'duration': task['duration'],
                          'importance': task['importance_level'],
                          'description': task['mission'],
                          'eventType': task['event_type'],
                          'user_id': user_id,
                          'createdAt': firestore.SERVER_TIMESTAMP
                       }
                    
                    firestore_db = current_app.config['FIRESTORE_DB']
                    doc_ref = firestore_db.collection('events').add(event_ref)
                    event_id = doc_ref[1].id  # Get the generated document ID
                
                    print(f"Event added successfully, Event ID: {event_id} \n")


            return jsonify("Events created successfully"), 200



#     if not summaryData or 'days' not in summaryData:
        #         return jsonify({"message": "Invalid or missing study plan data"}), 400

        #     # Process each day and task in the study plan
        #     for offset, day in enumerate(summaryData['days']):
        #         day["date"] = get_date_with_offset(offset)  # Update the date with the current date + offset
        #         for task in day["tasks"]:
        #             print(f"  Event Name: {task['event_name']}")
        #             print(f"  Date: {day['date']}")
        #             print(f"  Time: {task['time']}")
        #             print(f"  Mission: {task['mission']}")  
        #             print(f"  Importance Level: {task['importance_level']}")
        #             print(f"  Event Type: {task['event_type']}")
        #             print("")

        #             # Here you would add the logic to create the events in your database

        #     return jsonify("Events created successfully"), 200

        # except Exception as e:
        #     print("Error processing study plan:", str(e))
        #     return jsonify({"message": str(e)}), 500

















        # try:
        #     summaryData = request.get_json()

        #     if not summaryData or 'days' not in summaryData:
        #         return jsonify({"message": "Invalid or missing study plan data"}), 400

        #     # Process each day and task in the study plan
        #     for offset, day in enumerate(summaryData['days']):
        #         day["date"] = get_date_with_offset(offset)  # Update the date with the current date + offset
        #         for task in day["tasks"]:
        #             print(f"  Event Name: {task['event_name']}")
        #             print(f"  Date: {day['date']}")
        #             print(f"  Time: {task['time']}")
        #             print(f"  Mission: {task['mission']}")  
        #             print(f"  Importance Level: {task['importance_level']}")
        #             print(f"  Event Type: {task['event_type']}")
        #             print("")

        #             # Here you would add the logic to create the events in your database

        #     return jsonify("Events created successfully"), 200

        # except Exception as e:
        #     print("Error processing study plan:", str(e))
        #     return jsonify({"message": str(e)}), 500
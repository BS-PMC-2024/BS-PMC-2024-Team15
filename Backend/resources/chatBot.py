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

# Initial context to inform the bot about its job.
context = [
    {'role': 'system', 'content': """
You are a smart assistant designed to help students plan effective study schedules to improve their 
performance in school or college and achieve their academic goals.

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
      "date": "2024-07-21",
      "tasks": [
        {
          "time": "8:00-10:00",
          "mission": "learn math for 2 hours",
          "event_name": "Math Study",
          "importance_level": "high",
          "event_type": "study"
        },
        {
          "time": "10:00-10:15",
          "mission": "take a break",
          "event_name": "Break",
          "importance_level": "low",
          "event_type": "hobby"
        },
        {
          "time": "10:15-12:15",
          "mission": "learn complex algebra",
          "event_name": "Complex Algebra",
          "importance_level": "high",
          "event_type": "study"
        }
      ]
    },
    {
      "date": "2024-07-22",
      "tasks": [
        {
          "time": "8:00-10:00",
          "mission": "learn physics for 2 hours",
          "event_name": "Physics Study",
          "importance_level": "high",
          "event_type": "study"
        },
        {
          "time": "10:00-10:15",
          "mission": "take a break",
          "event_name": "Break",
          "importance_level": "low",
          "event_type": "hobby"
        },
        {
          "time": "10:15-12:15",
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

6. **Detailed Task Planning**:
   - Ensure that the time is correctly split and clearly indicate the start and end times for each task.


     
    
    
    """}
]

    
@blp.route("/aibot", methods=["POST"])
class AIassistant(MethodView):
    def post(self):
        global context
        data = request.get_json()
        prompt = data.get("user_input")
        action = data.get("action")
        
        if action == "Chat":
            context.append({'role': 'user', 'content': f"{prompt}"})
            response = get_completion_from_messages(context)
            context.append({'role': 'assistant', 'content': response.replace('**', '<br>')})
            return jsonify({'content': response.replace('**', '<br>')})
        
        elif action == "Finish Order":
            context.append(
                {'role': 'system', 'content':
                 "return the study plan in the JSON format like the example you have. "},
            )
            response = get_completion_from_messages(context)
            # Extract the JSON part from the message
            start = response.find('{')
            end = response.rfind('}') + 1
            json_string = response[start:end]

            # Parse the JSON string
            summaryData = json.loads(json_string)
        # Parse the JSON string
            summaryData = json.loads(json_string)
            summary_num_of_days = summaryData["num_of_days"]
            summary_days = summaryData['days']
            # Iterate through the days and their tasks
            for day in summary_days:
                date = day["date"]
                tasks = day["tasks"]
                print(f"Date: {date}")
                for task in tasks:
                    time = task["time"]
                    mission = task["mission"]
                    event_name = task["event_name"]
                    importance_level = task["importance_level"]
                    event_type = task["event_type"]
                    print(f"  Time: {time}")
                    print(f"  Mission: {mission}")
                    print(f"  Event Name: {event_name}")
                    print(f"  Importance Level: {importance_level}")
                    print(f"  Event Type: {event_type}")
                    print("")    
            return jsonify(summaryData)
        
        return jsonify({'content': 'Invalid action'}), 400
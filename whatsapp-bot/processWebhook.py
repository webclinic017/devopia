import os
import flask
from flask import send_from_directory, request
import firebase_admin
from firebase_admin import credentials, firestore

app = flask.Flask(__name__)

cred = credentials.Certificate("C:\\Users\\Admin\\Downloads\\devopia-18b84-firebase-adminsdk-lh195-8efa537536.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/favicon.png')

@app.route('/')
@app.route('/home')
def home():
    return "Hello World"

from helperfunction.waSendMessage import sendMessage

@app.route('/whatsapp', methods=['GET', 'POST'])
def whatsapp():
    print(request.get_data())
    message = request.form['Body']
    senderId = request.form['From'].split('+')[1]
    senderId = senderId[2:] if senderId.startswith('91') else senderId
    print(f'Message --> {message}')
    print(f'Sender id --> {senderId}')
    res = sendMessage(senderId=senderId, message=message)
    print(f'This is the response --> {res}')
    
    save_message_to_firestore(senderId, message)
    
    return '200'

def save_message_to_firestore(senderId, message):
    # Split the message into parts
    parts = message.split()
    
    # Initialize variables to hold the item name and cost
    itemName = ""
    cost = None
    
    # Iterate over the parts to identify the item name and cost
    for part in parts:
        # Try to convert each part to an integer to identify the cost
        try:
            cost = int(part)
        except ValueError:
            # If conversion fails, it's part of the item name
            itemName += f"{part} "
    
    # Remove the trailing space from the item name
    itemName = itemName.strip()
    
    # Check if a cost was found
    if cost is None:
        print("Error: No valid cost found in the message.")
        return # Exit the function if no cost is found
    
    # Create a new document in the 'messages' collection
    doc_ref = db.collection('messages').document()
    doc_ref.set({
        'senderId': senderId,
        'itemName': itemName,
        'cost': cost,
        'timestamp': firestore.SERVER_TIMESTAMP
    })
    
    return '200'

if __name__ == "__main__":
    app.run(port=3000, debug=True)

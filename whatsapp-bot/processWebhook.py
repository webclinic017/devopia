import os
import flask
from flask import send_from_directory, request
import firebase_admin
from firebase_admin import credentials, firestore
from urllib.parse import quote

app = flask.Flask(__name__)

cred = credentials.Certificate("/Users/malharbonde/Desktop/test/whatsapp-bot/devopia-18b84-firebase-adminsdk-lh195-8efa537536.json")
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
    save_message_to_firestore(senderId, message)
    
    return ' ', 200

def save_message_to_firestore(senderId, message):
    parts = message.split()
    
    itemName = ""
    cost = None
    
    for part in parts:
        try:
            cost = int(part)
        except ValueError:
            itemName += f"{part} "
   
    itemName = itemName.strip()
    
    if cost is None:
        print("Error: No valid cost found in the message.")
        return 
    doc_ref = db.collection('expense').document()
    doc_ref.set({
    'amount': cost,
    'phone': senderId,
    'category': itemName,
    'to': "cash",
    'upi': "cash",
    'timestamp': firestore.SERVER_TIMESTAMP
})

    return_msg = f"Successfully added expense of {cost} for {itemName} \u2705"
    res = sendMessage(senderId=senderId, message=return_msg)
    print(f'This is the response --> {res}')
    item_names = ["coffee", "food", "takeout", "movie", "video games", " netflix subscription", "alcohol", "snacks", "eating out", "entertainment", "impulse buy", "dining", "luxury items", "accessories"]
    
    if itemName.lower() in item_names and cost > 2000:
        alert_message = f"⚠️ Alert: Maybe you are spending more on unnecessary things. It's time to revisit your saving goals on 'Money Trees' and also take a look at budgeting tips."
        sendMessage(senderId=senderId, message=alert_message)
    
    return '200'

if __name__ == "__main__":
    app.run(port=3000, debug=True)

from flask import Flask, request
import json
from flask import Flask, render_template
from image_processing import highContrast

#Set up Flask
app = Flask(__name__)

@app.route('/test', methods=['POST']) # posts the function below
def test(): 
    output = request.get_json() # "Parses the incoming JSON request data and returns it"
    print(output) # This is the output that was stored in the JSON within the browser
    result = json.loads(output) # This converts the json output to a python dictionary
    print(result) # Printing the new dictionary
    # highContrast(result, "test") # For when the high contrast code works
    return result

# runs the code on localhost port 5000
if __name__ == '__main__':
    app.run(host='0.0.0.0',port=5000,debug=True)


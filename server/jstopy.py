from flask import Flask, request
import json
from flask import Flask, render_template
from image_processing import highContrast
#Set up Flask</strong>:
app = Flask(__name__)


# @app.route('/')
# def index():
#     return render_template('index.html')

@app.route('/test', methods=['POST']) # posts the function below
def test(): 
    output = request.get_json() # "Parses the incoming JSON request data and returns it"
    print(output) # This is the output that was stored in the JSON within the browser
    print(type(output))
    result = json.loads(output) # This converts the json output to a python dictionary
    print(result) # Printing the new dictionary
    highContrast(result, "test")
    print(type(result)) # This shows the json converted as a python dictionary
    return result

if __name__ == '__main__':
    app.run(port=5000,debug=True)


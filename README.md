# Image Editing Chrome Extension By Silver Sonics
## Description
The Image Editing Chrome Extension is a google chrome extension that makes the images on whatever tab is active high-contrast. Rather than a normal image editing software, our extension does not require the image to be downloaded locally or uploaded onto a page.  
## Frameworks & Languages Used
### Frameworks
```diff
- Flask?
```
### Languages 
Python - Machine learning, server
Javascript - High contrast script
HTML, CSS - User Interface
## Navigating the Code
When the extension is run currently, only the code within the extension folder is run. The code outside the extension folder is a work in progress and will be discussed more in the releases for the future section. 
```diff
- To navigate the code, there are pseudo code comments? IDK what else to say here? maybe something about how the code is run from calling functions in html to idkkkk anyway this will be done later ig 
Maybe a diagram could be thrown in here... audi's extension diagram maybe? idk
```
## Usage
To use the extension...
1. Download the repository onto your computer as a ZIP and unzip the file.
2. Open your web browser and go to settings. At the bottom of the left toolbar, there is a button that says Extensions. It will take you to the page where extensions can be uploaded. 
<img src="/images/extension_location.png" height=500 margin-left=auto margin-right=auto>
3. Click the Load Unpacked button
4. Navigate to the extension folder in the Silver-Sonics folder you unzipped in step 1
5. Upload the extension folder. Make sure it is the extension folder uploaded. Otherwise, there will be an error due to a missing manifest file
## Support
```diff
- we don't need this section but maybe we could just put in our emails or something 
```
## Releases for the Future
Navigating through the code, you'll notice many extra files and folders. This is because there are parts of the project we were unable to completely integrate into our extension in time for the 4/21/23 deadline but hope to include in the future. ![Flow Diagram of our Goal](/images/goal_flow.png)
Originally, rather than having the high contrast script written in javascript and located as part of the extension, we planned to write the high contrast script and the machine learning algorithm in python. Then the server (written in python) would communicate with the image editing scripts and the extension which would only hold the user interface. This would also have allowed us to scale our product up and have more functions as we could store images in a database for later review or editing as well as edit the images in different ways to suit our co-designer's preferences more. As of now (4/20/23), we have the high contrast code written in python as well as our machine learning algorithm. We also have a local server and javascript code to connect the server to the extension.
## Authors and Acknowledgment
```diff
- again this part is prob not needed but i think we should prob thank everyone who helped us (chris, the mentors, the other groups who we peer reviewed with, idk who else off the top of my head but ye)
```

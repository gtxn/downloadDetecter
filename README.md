# downloadDetecter
This is an auto download detecter for mac, but only for files, not for directories. By running this locally in the terminal, when program detects a new file in the downloads folder, a notification is given that prompts if you would like to move the downloaded files away from the downloads folder into another directory. (note: the directory is relative to desktop and must include the file name with the extension. for example, if I'm saving a file called image into the desktop, I would enter my path as image.jpg)  

To use this just install the code and navigate to the project directory before running :

npm install forever

forever start app.js

To stop auto detection of downloads navigate to project directory and run :

forever stop app.js

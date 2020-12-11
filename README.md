# SYS Project (3rd Term)
## How to use
Our website is a SPA using React, Bootstrap, and Material UI. The project consists of compontents which can be accesed through the navigation bar, these components use React Router. The website also has a login/logout feature, where we use localstorage to handle the jwt-token. Our apiFacade.js is a generic handler for our fetch functions. This way we can fetch our backend URL's and set certain request headers, such as POST/GET using a universal makeOptions function. Finally our Settings.js file, which contains all the  URL's for fetching combined in one file. This way if we want to fetch from a different URL, we don't have to find it in some random file or change every instance of it through the different scripts in the code. 

If you wish to clone the project, you need to write "npm install" in order to install all the Node.js dependencies and run the project on your local machine.

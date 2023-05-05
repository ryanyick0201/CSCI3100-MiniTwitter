# Mini Twitter

## Introduction
This is the GitHub repository of Mini Twitter, a social media web application that allow users to view, post and comment tweets. It also allows users to interact with other users, such as follow others and retweet. User and tweet recommendation systems are built on top of them.

## Installation
1. Install Node from [Node.js](https://nodejs.org/en/download). Node version 19 is used during implementaion and testing phases.
2. Install MySQL server from [MySQL Community Server](https://dev.mysql.com/downloads/mysql/).
3. Install git.

## Hosting the web application
4. Clone this GitHub repository `git clone https://github.com/ryanyick0201/CSCI3100-MiniTwitter.git`.
5. Open the directory on a terminal (e.g. Command prompt or Powershell) and install the npm packages using the command `npm install`.
6. Host the web application on AWS EC2 Virtual Machine or on your local computer (localhost). The server uses port 3000 while client uses port 3001. Since configuration of every cloud provider and virtual machine is different, the following section only shows the steps to host the application on `localhost`

### Hosting the client
The following steps host the client on localhost:3001.
```
# Go to the client folder
cd mini-twitter

#Run the development mode
npm start

#Run the build mode
npm run build

#Eject the client
npm run eject

#Terminate the client
Ctrl + C
```

### Hosting the server
The following steps host the server on localhost:3000.
```
# Go to the client folder
cd server

#Run the development mode
npm start

#Run the build mode
npm run build

#Eject the server
npm run eject

#Terminate the server
Ctrl + C
```

## Project structure
This is a social media platform and the client allows both system administrators and end users to use their respective features. It uses full-stack technologies, mainly ReactJs, ExpressJs, MySQL and socket.io, HTML and CSS.

### Client
`mini-twitter` folder stores all files to host the client
- `src`: folder storing all front-end source codes
    - `component`: folder storing the ReactJs components
        - `userPageComponent`: folder storing all components to render the all user and admin features
            - `chatComponent`: folder storing all components to render the incremental chat feature 
        - Other files: components to render the access control pages (e.g. log in, forget password, sign up and email verification) 
- `public`: `index.html` file to render the single-page application (SPA)
- `package.json`: file to store the configuration details, such as the npm packages, of the client
### Server
`server` folder stores all files to host the server
- `src`: folder storing all back-end source codes
    - `accessControl`: folder storing the RESTful API routes and functions to handle user and admin access control
    - `tweet`: folder storing the RESTful API routes and functions to handle tweets
    - `user`: folder storing the RESTful API routes and functions to handle user account data
    - `chat`: folder storing the socket.io events to handle the chat functions
    - `multimedia`: folder storing the functions to handle (CRUD) images and AWS S3
- `server.js`: file to set up the server
- `db.js`: file to connect the MySQL database
- `db.sql`: file to defines and creates the database, tables and inserts sample data
- `package.json`: storing the configuration details, such as the npm packages, of the client

# CSCI3100 -- Group B8
## Project: Mini Twitter project

FE /client 
    modified from 'test/chat' 
    edited start script to run on PORT=3001
    take sender and recipient at index.js

BE /server
    edited database schema for Chat, added isImg
    more test user following entries to test chattable route
    
    socket events:
    
    'reqChatted'
        From client to server
        sent with username
        Response by server:
        1) fetch chatted of that username
        2) emit 'chattedUser' back to that socket with array of chatted user (same as below)

    
    'joinRoom' 
        From client to server:
        sent with usernamePair (['sender', 'receiver'])

        Response by server:
        0) update all global variables and inRoomFlag
        1) find the userId of the usernamePair
        2) see if a room currently exist between the users, open room if not
        3) join the client to the room
        4) server fetch chat record from database
        5) server fire a 'chatHistory' event to the client socket, with obj of chat history (see below)
        6) fetch chatted users of the sender and receiver of that event and emit 'chattedUser' to each of the user


        From server to client: not expected to happen
    
    'chatHistory'
        From server to client:
        sent with chat history object
        e.g.
        [
            {
                message: 'testing msg1',
                sendTime: 2023-03-18T18:00:00.000Z,
                sender: 'user1',
                receiver: 'user2',
                isImg: 0
            },
            {
                message: 'testing msg2',
                sendTime: 2023-03-18T18:00:01.000Z,
                sender: 'user2',
                receiver: 'user1',
                isImg: 0
            }
        ]
        From server to client: not expected to happen


    'newMessageEvent'
        From client to server:
        sent with data obj
        Response by server:
            1) console.log("receive msg from client:" + data['message']);
            2) emit the msg obj to the room
            3) write the chat to the database, using data['message'] and the userIdPair obtained when joinRoom
            4) fetch chatted users of the sender and receiver of that event and emit 'chattedUser' to each of the user


        From server to client:
        sent with data obj
        item 2 in client to server

    'chattedUser'
        From server to client:
        sent with chattedUser object
        users are sorted in reverse chronological order
        i.e. most recently chatted user first
        e.g. ['user2', 'user3']
    
    'leaveRoom'
        From client to server:
        sent without any param
        Response by server:
            1) update inRoomFlag
            2) remove socket from socketroom
            3) clean all global variable

    'disconnect'
        From client to server (when socket closed e.g. close browser)
        sent without any param
        Response by server:
            if still inRoomFlag,
            1) update inRoomFlag
            2) remove socket from socketroom
            3) clean all global variable

    get routes:

    Chattables - list of users that a user is following each other
        get request at 'localhost:3000/chat/chatTables/?q=username'
        server will return an array of the usernames
        e.g. ['user1', 'user2'] 
    
    Chatteduser - list of users that a user chatted with before
        get request at 'localhost:3000/chat/chattedUser/?q=username'
        server will return an array of the usernames
        e.g. ['user1', 'user2'] 

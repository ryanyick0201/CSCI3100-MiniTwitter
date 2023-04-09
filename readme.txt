# CSCI3100 -- Group B8
## Project: Mini Twitter project

Update Apr 9:
edited socket option: to accept image size >1MB
  maxHttpBufferSize: 1e9


1) https://stackoverflow.com/questions/59478402/how-do-i-send-image-to-server-via-socket-io
2) https://socket.io/how-to/upload-a-file#docusaurus_skipToContent_fallback


FE /client 

BE /server
    edited database schema for Chat, added isImg
    more test user following entries to test chattable route
    
    socket events:
    
    'joinRoom' 
        From client to server:
        sent with usernamePair (['sender', 'receiver'])

        Response by server:
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

        data obj format:
        {
            sender: msgSender,
            recipient: msgRecipient,
            isImg: isImg,
            message: messageBody, // if (isImg) message = {file, mimeType, fileName} else message is String
            sendTime: "2023-04-09 21:34:36",
        }

        Response by server:
            if isImg is false:
                1) console.log("receive msg from client:" + data['message']);
                2) emit the received msg obj to the room
                3) write the chat to the database, using data['message'] and the userIdPair obtained when joinRoom
                4) fetch chatted users of the sender and receiver of that event and emit 'chattedUser' to each of the user
            
            if isImg is true:
                1) console.log("receive img msg from client:");
                2) create random filename and save the file to s3
                3) write the filename, sender, etc to the database
                4) get signedurl of the image and emit the msg obj to the room (see below)

        From server to client:
        sent with data obj
            1) isImg is false, item 2 in client to server 
            OR 
            2) isImg is true, item 4 in client to server 
            {
            sender: msgSender,
            recipient: msgRecipient,
            isImg: true,
             //there will be no message
            sendTime: original date from sender data,
            imgUrl: signedURL of the image
            }

    'chattedUser'
        From server to client:
        sent with chattedUser object
        users are sorted in reverse chronological order
        i.e. most recently chatted user first
        e.g. ['user2', 'user3']




    get routes:

    Chattables - list of users that a user is following each other
        get request at 'localhost:3000/chat/chatTables/?q=username'
        server will return an array of the usernames
        e.g. ['user1', 'user2'] 
    
    Chatteduser - list of users that a user chatted with before
        get request at 'localhost:3000/chat/chattedUser/?q=username'
        server will return an array of the usernames
        e.g. ['user1', 'user2'] 
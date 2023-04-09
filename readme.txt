# CSCI3100 -- Group B8
## Project: Mini Twitter project

Based on backend-chat Apr10 0100 commit, included bug fix for multiple joinRoms and added leaveRoom functionality

Update Apr 10 0320:
edited socket option: to accept image size >1MB
  maxHttpBufferSize: 1e9
modified NEW_MESSAGE_EVENT to handle image (video also works)
changed all message interface to accept and emit time in string "YYYY-MM-DD HH:MM:SS" in UTC+8
changed db.sql to add fileName and mimeType to message schema

FE /client 
    unknown version

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
                message: 'testing msg4',
                sendTime: '2023-03-19 02:00:02',
                sender: 'user3',
                receiver: 'user1',
                isImg: 0,
                fileName: null,
                mimeType: null,
                imgUrl: ''
            },
            {
                message: '1d05dc405026b749e559bd494c59163873dc164ae2931421718f714b472e3ef6',
                sendTime: '2023-04-10 02:57:32',
                sender: 'user1',
                receiver: 'user3',
                isImg: 1,
                fileName: '1d05dc405026b749e559bd494c59163873dc164ae2931421718f714b472e3ef6',
                mimeType: 'image/jpeg',
                imgUrl: 'https://chat-image-bucket.s3.ap-southeast-1.amazonaws.com/1d05dc405026b749e559bd494c59163873dc164ae2931421718f714b472e3ef6?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA4CULIXCKBD7QBXPZ%2F20230409%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20230409T185736Z&X-Amz-Expires=900&X-Amz-Signature=23bc001e6387d4faaef2238ea607edf48a3644d13ad460f1626c6fe6cbf7d2ac&X-Amz-SignedHeaders=host&x-id=GetObject'
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
(**************)sendTime: "2023-04-09 21:34:36", // expect in UTC+8 time
        }

        Response by server:
            if isImg is false:
                1) console.log("receive msg from client:" + data['message']);
                2) emit the received msg obj directly to the room
                3) write the chat to the database, using data['message'] and the userIdPair obtained when joinRoom
                4) fetch chatted users of the sender and receiver of that event and emit 'chattedUser' to each of the user
            
            if isImg is true:
                1) console.log("receive img msg from client:");
                2) create random filename and save the file to s3
                3) write the filename, sender, etc to the database
                4) get signedurl of the image and emit the msg obj to the room (see below)
                5) fetch chatted users of the sender and receiver of that event and emit 'chattedUser' to each of the user


        From server to client:
        sent with data obj
            1) isImg is false, item 2 in client to server 
            {
                "sender":"user1",
                "recipient":"user2",
                "isImg":false,
                "message":"asdf",
(**************)"sendTime": "2023-04-10 02:24:54"
            }

            OR 
            2) isImg is true, item 4 in client to server 
            e.g.
            {
                "sender":"user1",
                "recipient":"user2",
                "isImg":true,
(**************)"sendTime":"2023-04-10 02:24:54",
                "imgUrl":"https://chat-image-bucket.s3.ap-southeast-1.amazonaws.com/612bf2c301a54d99ab5b1281c88073f4b82e576ff8f3ba1fbb5a9348f2db26ab?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIA4CULIXCKBD7QBXPZ%2F20230409%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20230409T182454Z&X-Amz-Expires=900&X-Amz-Signature=1f94f45192d753d79cae306224e71c3eecfc7886cfac89c8f379bdb2e33a96ee&X-Amz-SignedHeaders=host&x-id=GetObject"
            }

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
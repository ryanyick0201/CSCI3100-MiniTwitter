/*
Step 0: call all the libraries / modules (e.g. http, socket.io)
Step 1: create several functions as follow:
	1. Open room / load chats
		- Check if two users (we call them A and B) have any chats before
		- If yes, then use the room and send the past chats back to A and B
		- If no, then create a new room
		- Keep it simple
			- You need not show if a user is online or not
			- The messages data of the format [{"sender": 1, "receiver": 2, "message": "XYZ", "sendTime": "..."}, {"sender": "Y", "receiver": "X", "message": "XZY", "sendTime": "..."}]. It means that it is an array of messages, each has the sender userId, receiver userId and the message content, and the time
			- It's preferred to sort the data with the sendTime (in descending order)
			- You'll know how to do sql queries when you go through other files

	2. Listen for chat messages
		- When a user A sends a message,
		- B should be able to receive the message {"sender": 1, "receiver": 2, "message": "XYZ", "sendTime": "..."}
		- Make sure you don't broadcast the message to other people (except A and B)

	* You may want to alter the SQL database, just go ahead.
	* Check the UML document and chat branch on GitHub (FE is also working on chat function) for more design details.

Step 2: export the functions
Step 3: write codes on server.js to integrate the module into the server

*/

// This video gives you lots of hints: https://www.youtube.com/watch?v=jD7FnbI76Hg&ab_channel=TraversyMedia
// Check the description box for the GitHub code too. You'll know more about how it works (and copy half of the code).
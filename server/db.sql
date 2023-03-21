CREATE DATABASE Twitter;

USE Twitter;

CREATE TABLE User (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    hasVerified BOOLEAN NOT NULL,
    email VARCHAR(100),
    personalBio VARCHAR(200),
    privacySetting ENUM('public', 'follower', 'private') DEFAULT 'public',
    sessionId VARCHAR(50),
    otp VARCHAR(50)
  );


CREATE TABLE Admin (
    adminId INT AUTO_INCREMENT PRIMARY KEY,
    adminname VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    sessionId VARCHAR(50)
  );


CREATE TABLE TweetCategory (
    category VARCHAR(50) PRIMARY KEY
  );


CREATE TABLE Tweet (
    tweetId INT AUTO_INCREMENT PRIMARY KEY,
    creator INT NOT NULL,
    tweetContent VARCHAR(500) NOT NULL,
    postTime DATETIME NOT NULL,
    category VARCHAR(50),
    archived ENUM('archived'),
    FOREIGN KEY (creator) REFERENCES User(userId) ON DELETE CASCADE,
    FOREIGN KEY (category) REFERENCES TweetCategory(category)
  );


CREATE TABLE TweetLike(
    tweetId INT NOT NULL,
    userId INT NOT NULL,
    status ENUM('like', 'dislike') NOT NULL,
    PRIMARY KEY(tweetId, userId),
    FOREIGN KEY (tweetId) REFERENCES Tweet(tweetId),
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE
  );

CREATE TABLE TweetComment (
    userId INT,
    tweetId INT,
    commentId INT,
    commentTime DATETIME NOT NULL,
    commentContent VARCHAR(500) NOT NULL,
    PRIMARY KEY (userId, tweetId, commentId),
    FOREIGN KEY (userId) REFERENCES User(userId) ON DELETE CASCADE,
    FOREIGN KEY (tweetId) REFERENCES Tweet(tweetId)
  );


CREATE TABLE TweetRetweet (
    tweetId INT,
    senderId INT,
    retweetTime DATETIME,
    PRIMARY KEY (tweetId, senderId),
    FOREIGN KEY (tweetId) REFERENCES Tweet(tweetId),
    FOREIGN KEY (senderId) REFERENCES User(userId) ON DELETE CASCADE
  );


CREATE TABLE Follow (
    follower INT,
    followee INT,
    status VARCHAR(50) CHECK (status IN ('Pending', 'Accepted')),
    PRIMARY KEY (follower, followee),
    FOREIGN KEY (follower) REFERENCES User(userId) ON DELETE CASCADE,
    FOREIGN KEY (followee) REFERENCES User(userId) ON DELETE CASCADE
  );


CREATE TABLE Message (
    message VARCHAR(500) NOT NULL,
    sendTime DATETIME NOT NULL,
    sender INT NOT NULL,
    receiver INT NOT NULL,
    PRIMARY KEY (message, sendTime, sender, receiver),
    FOREIGN KEY (sender) REFERENCES User(userId) ON DELETE CASCADE,
    FOREIGN KEY (receiver) REFERENCES User(userId) ON DELETE CASCADE
  );


INSERT INTO User (username, password, email, hasVerified, personalBio, privacySetting, sessionId, otp)
VALUES 
('user1', 'password1', 'user1@example.com', TRUE, NULL, 'public', NULL, NULL),
('user2', 'password2', 'user2@example.com', TRUE, NULL, 'public', NULL, NULL),
('user3', 'password3', 'user3@example.com', TRUE, NULL, 'public', NULL, NULL),
('user4', 'password4', 'user4@example.com', TRUE, NULL, 'public', NULL, NULL),
('user5', 'password5', 'user5@example.com', TRUE, NULL, 'public', NULL, NULL),
('user6', 'password6', 'user6@example.com', FALSE, NULL, 'public', NULL, NULL),
('user7', 'password7', 'user7@example.com', FALSE, NULL, 'public', NULL, NULL),
('user8', 'password8', 'user8@example.com', FALSE, NULL, 'public', NULL, NULL),
('user9', 'password9', 'user9@example.com', FALSE, NULL, 'public', NULL, NULL),
('user10', 'password10', 'user10@example.com', FALSE, NULL, 'public', NULL, NULL);

INSERT INTO Admin (adminname, password, sessionId)
VALUES
('admin1', 'password1', null),
('admin2', 'password2', null),
('admin3', 'password3', null),
('admin4', 'password4', null),
('admin5', 'password5', null),
('admin6', 'password6', null),
('admin7', 'password7', null),
('admin8', 'password8', null),
('admin9', 'password9', null),
('admin10', 'password10', null);

INSERT INTO TweetCategory (category)
VALUES 
    ('sports'),
    ('travel'),
    ('pets'),
    ('science'),
    ('programming');

INSERT INTO Tweet (creator, tweetContent, postTime, category)
VALUES
(7, 'Just went on an amazing hike in the mountains!', '2022-05-12 14:30:00', 'travel'),
(2, 'I love my dog so much, he always brightens my day', '2022-07-03 10:45:00', 'pets'),
(5, 'Exciting news! My startup just got funded!', '2022-02-20 09:15:00', 'programming'),
(10, 'Just finished reading a fascinating book about the human brain', '2022-09-17 12:00:00', 'science'),
(6, 'Who else is excited for the World Cup?', '2022-11-22 08:00:00', 'sports'),
(4, 'I just got back from a week-long beach vacation and I''m already missing it', '2022-04-05 11:00:00', 'travel');

INSERT INTO TweetLike (tweetId, userId, status) VALUES
(1, 1, 'like'),
(1, 2, 'dislike'),
(2, 3, 'like'),
(2, 4, 'dislike'),
(3, 5, 'like'),
(3, 6, 'dislike'),
(4, 7, 'like'),
(4, 8, 'dislike'),
(5, 9, 'like'),
(5, 10, 'dislike');

INSERT INTO TweetComment (userId, tweetId, commentId, commentTime, commentContent)
VALUES
(2, 3, 1, '2023-03-19 02:00:00', 'Great news! Congrats on getting funded!'),
(4, 6, 1, '2023-03-19 02:00:00', 'I hope you had a great vacation!'),
(6, 1, 1, '2023-03-19 02:00:00', 'Sounds like a wonderful hike!'),
(8, 2, 1, '2023-03-19 02:00:00', 'Dogs really are the best!'),
(3, 4, 1, '2023-03-19 02:00:00', 'What book did you read?'),
(5, 5, 1, '2023-03-19 02:00:00', 'I cannot wait for the World Cup!'),
(1, 1, 2, '2023-03-19 02:00:00', 'I love hiking too!'),
(9, 3, 2, '2023-03-19 02:00:00', 'Good luck with your startup!'),
(7, 2, 2, '2023-03-19 02:00:00', 'What kind of dog do you have?'),
(10, 4, 2, '2023-03-19 02:00:00', 'I love learning about the brain!');


INSERT INTO TweetRetweet (tweetId, senderId, retweetTime)
VALUES 
    (1, 2, '2022-05-12 14:31:00'),
    (2, 5, '2022-07-03 10:46:00'),
    (3, 7, '2022-02-20 09:21:00'),
    (4, 10, '2022-09-17 12:10:00'),
    (5, 3, '2022-11-22 08:40:00'),
    (6, 9, '2022-04-05 11:15:00'),
    (1, 5, '2022-05-12 14:32:00'),
    (2, 1, '2022-07-03 10:50:00'),
    (3, 3, '2022-02-20 09:25:00'),
    (1, 7, '2022-09-17 12:15:00');

INSERT INTO Follow (follower, followee, status)
VALUES
(1, 2, 'Pending'),
(3, 1, 'Accepted'),
(5, 6, 'Pending'),
(8, 3, 'Accepted'),
(10, 2, 'Pending');

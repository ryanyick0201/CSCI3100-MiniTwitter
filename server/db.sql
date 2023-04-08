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
    isImg BOOLEAN NOT NULL,
    PRIMARY KEY (message, sendTime, sender, receiver),
    FOREIGN KEY (sender) REFERENCES User(userId) ON DELETE CASCADE,
    FOREIGN KEY (receiver) REFERENCES User(userId) ON DELETE CASCADE
  );

INSERT INTO User (username, password, email, hasVerified, personalBio, privacySetting, otp)
VALUES 
('user1', '$2b$10$oybdKhG2ObjFjK7Khn1l..ixNc6/sv63gjuFJJ8w8RIvCx6CebXLq', 'user1@example.com', TRUE, NULL, 'public', NULL),
('user2', '$2b$10$sDB80/9hrkgRE.lAyUkaSu.QUCCdhan2TRU8krrl.yVmxpBZpcYGG', 'user2@example.com', TRUE, NULL, 'public', NULL),
('user3', '$2b$10$amD9Y/o5wVsw.BqNdihyhOhs4APUrJwnXIBy0uXumDHHvxTbJduXG', 'user3@example.com', TRUE, NULL, 'public', NULL),
('user4', '$2b$10$n.UTF3C6J50u0wsS07BlQOpb9M40Gwdc0/MnWVx0PqupcoanZvPqq', 'user4@example.com', TRUE, NULL, 'public', NULL),
('user5', '$2b$10$ZtHTKlLGmE4bQIBg.vdnUO6e9yN8hdoMFeNco5XjCwwK26nqosiAG', 'user5@example.com', TRUE, NULL, 'public', NULL),
('user6', '$2b$10$SK9bEa6ANqKwphlBKuN7rOrgHa2ESgm6ykXKyfKEQwObrUfX29ncm', 'user6@example.com', FALSE, NULL, 'public', NULL),
('user7', '$2b$10$wtkTFlWz8O.b7IJ0ue6kD.gegskMYVJwTzF07nkqVGuizmu8Y8ibG', 'user7@example.com', FALSE, NULL, 'public', NULL),
('user8', '$2b$10$AvbbezeESY25/qahhXF/POpEKuKUvmxDQrIU5aWG1WoFxB6bovO0q', 'user8@example.com', FALSE, NULL, 'public', NULL),
('user9', '$2b$10$f2mISfMiIrfi/aBvjTPF.eCt96/Dl2zKF8vAtjuqrecJgApDVtupe', 'user9@example.com', FALSE, NULL, 'public', NULL),
('user10', '$2b$10$7UVDWCjukFCIDraUgDljZuwrp7tBRAN6KU33z0u9EFlb6zhP4TIY6', 'user10@example.com', FALSE, NULL, 'public', NULL);

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
(4, 'I just got back from a week-long beach vacation and I''m already missing it', '2022-04-05 11:00:00', 'travel'),
(1, 'Just tried the new sushi restaurant in town and it was amazing!', '2022-08-15 18:30:00', 'travel'),
(3, 'I can''t wait to go skydiving next weekend!', '2022-07-28 11:15:00', 'sports'),
(5, 'I just finished reading a book about the history of programming languages and it was fascinating', '2022-06-04 14:45:00', 'science'),
(2, 'My cat always seems to know when I''m feeling down and cuddles up with me', '2023-01-21 08:00:00', 'pets'),
(7, 'I just got back from a trip to Paris and it was absolutely beautiful', '2022-03-19 16:00:00', 'travel'),
(9, 'I''m training for a marathon and it''s tough but worth it', '2023-02-28 07:30:00', 'sports'),
(4, 'I just adopted a new puppy and he''s already stolen my heart', '2022-02-12 09:00:00', 'pets'),
(10, 'I''ve been studying machine learning and it''s blowing my mind', '2022-09-01 12:00:00', 'programming'),
(8, 'I love exploring new cities and trying new foods', '2023-03-03 15:30:00', 'travel'),
(6, 'I can''t wait for the next space mission to discover more about our universe', '2022-05-24 13:15:00', 'science'),
(2, 'My dog just learned a new trick and I couldn''t be more proud', '2022-12-10 10:30:00', 'pets'),
(9, 'I just completed my first triathlon and it was an amazing experience', '2023-02-17 09:45:00', 'sports'),
(3, 'I''m planning a trip to Japan and I''m so excited to try all the delicious food', '2022-04-30 14:00:00', 'travel'),
(5, 'I''m amazed at how much we''ve learned about the human brain in the past decade', '2022-11-05 11:00:00', 'science'),
(7, 'I just got back from a trip to Hawaii and the beaches were incredible', '2023-01-02 17:00:00', 'travel'),
(1, 'I love playing basketball and I''m always looking for new pickup games', '2022-07-14 08:00:00', 'sports'),
(8, 'I just started learning how to code and it''s challenging but exciting', '2023-03-08 10:30:00', 'programming'),
(4, 'I''m planning a road trip across the country with my best friend and I can''t wait', '2022-05-01 09:30:00', 'travel'),
(6, 'I''m fascinated by the latest discoveries in quantum mechanics', '2022-10-12 14:15:00', 'science');

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
(10, 2, 'Pending'),
-- below added on wed for testing chattable functionality
(1, 4, 'Accepted'),
(1, 5, 'Accepted'),
(6, 1, 'Pending')
;

INSERT INTO Message (message, sendTime, sender, receiver, isImg)
VALUES
('testing msg1', '2023-03-19 02:00:00', 1, 2, false),
('testing msg1a', '2023-03-19 02:00:00', 1, 3, false),
('testing msg1b', '2023-03-19 02:00:00', 2, 3, false),
('testing msg2', '2023-03-19 02:00:01', 2, 1, false),
('testing msg3', '2023-03-19 02:00:02', 2, 1, false),
('testing msg4', '2023-03-19 02:00:02', 3, 1, false),
('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.png', '2023-03-19 02:00:02', 3, 1, true),
('aaaaaaaaaaaaaaaaaaaafdaaaaaaaaaa.png', '2023-03-19 02:00:03', 2, 1, true);


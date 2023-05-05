/* PROGRAM RecommendationPage - the component recommending tweets to "me"
 * PROGRAMMER: YU Zhuofeng SID: 1155159772
 * CALLING SEQUENCE: RecommendationPage = ()
 * PURPOSE: recommending some tweets which "I" may be interested in.
 * ALGORITHM:
 *  fetching the tweets created by "me", and obtain the top three catagories (hashtags),
 *  using these three catagoried to fetch the relative tweets in the database which are recommended.
 *
 *  fetching the IDs of the followees, and fetching the list of all users,
 *  then filtering out the followees from all users according to the IDs,
 *
 *  filtering out the tweets from the recommended tweets which are not created by "my" followees,
 *  as the final tweets recommended.
 */
import React, { useState, useEffect } from "react";
import "./recommendationPage.css";
import Post from "./Post";

const RecommendationPage = () => {
  const myUsername = sessionStorage.getItem("username");

  const [myPosts, setMyPosts] = useState({});
  const [recommendCategories, setRecommendCategories] = useState([]);
  const [posts, setPosts] = useState({}); //the tweets obtained based on the top three catagories

  const [followeesId, setFolloweesId] = useState([]);
  const [users, setUsers] = useState({});
  const [followees, setFollowees] = useState([]);

  //fetching the tweets created by "me"
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/tweet/searchMyTweet?username${myUsername}`
      );
      const data = await response.json();
      setMyPosts(data);
    };
    fetchPosts();
  }, [myUsername]);

  //obtain the top three catagories (hashtags)
  useEffect(() => {
    if (!myPosts.result) {
      setRecommendCategories([]);
      return;
    }
    const count = myPosts.result?.reduce((count, post) => {
      if (count[post.category]) {
        count[post.category]++;
      } else {
        count[post.category] = 1;
      }
      return count;
    }, {});

    setRecommendCategories(
      Object.entries(count)
        .sort((first, second) => second[1] - first[1])
        .slice(0, 3)
        .map(([category]) => category)
    );
  }, [myPosts]);

  //using these three catagoried to fetch the relative tweets in the database which are recommended
  useEffect(() => {
    const fetchPosts = async () => {
      if (recommendCategories.length === 0) {
        const response = await fetch(
          `http://${window.location.hostname}:3000/tweet/searchMyTweet`
        );
        const data = await response.json();
        setPosts(data.result);
        console.log(1);
      } else {
        const posts = [];
        for (const category of recommendCategories) {
          const response = await fetch(
            `http://${window.location.hostname}:3000/tweet/searchOtherTweet?myUsername=${myUsername}&category=${category}`
          );
          const data = await response.json();
          posts.push(...data.result);
        }
        setPosts(posts);
        console.log(2);
      }
    };
    fetchPosts();
  }, [recommendCategories]);

  //fetching the IDs of the followees, and fetching the list of all users,
  useEffect(() => {
    const fetchFollowees = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/user/searchFollow?follower=${myUsername}&status=Accepted`
      );
      const data = await response.json();
      setFolloweesId(data.result.map((result) => result.followee));
    };
    const fetchUsers = async () => {
      const response = await fetch(
        `http://${window.location.hostname}:3000/user/searchUser?exactMatch=true`
      );
      const data = await response.json();
      setUsers(data);
    };
    fetchFollowees();
    fetchUsers();
  }, [myUsername]);

  //filtering out the followees from all users according to the IDs
  useEffect(() => {
    setFollowees(
      users.result?.filter((user) => followeesId.includes(user.userId))
    );
  }, [followeesId, users]);

  return (
    <div>
      <div style={{ margin: "20px auto 10px 400px" }}>
        <h2>You may be interested in...</h2>
      </div>

      <div className="card">
        {Array.isArray(posts) && //filtering out the tweets from the recommended tweets which are not created by "my" followees
          posts
            ?.filter(
              (post) =>
                post.username !== myUsername &&
                !followees?.find(
                  (followee) => followee.username === post.username
                )
            )
            .map((post) => <Post key={post.tweetId} post={post} />)}
      </div>
    </div>
  );
};

export default RecommendationPage;

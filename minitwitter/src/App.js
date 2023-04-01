import "./App.css"
import Sidebar from "./Sidebar"
import Home from './Home';
import PostDetailPage from './PostDetailPage'
import CreateNewPost from './CreateNewPost'
import FollowerPage from './FollowerPage'
import ProfilePage from './ProfilePage'
import EditProfile from './EditProfile'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';




function App(){
  const posts = [
    {
      id: 1,
      user: {
        username: 'user1',
        avatar: 'https://example.com/avatar1.jpg'
      },
      content: 'This is the body of the first post',
      image: 'https://example.com/image1.jpg',
      likes: 10,
      dislikes: 2,
      comments: 5,
      retweets: 3,
      hashtags: ['hashtag1', 'hashtag2'],
      timestamp: Date.now(),
      
    },
    {
      id: 2,
      user: {
        username: 'user2',
        avatar: 'https://example.com/avatar2.jpg'
      },
      content: 'This is the body of the second post',
      image: null,
      likes: 5,
      dislikes: 1,
      comments: 2,
      retweets: 1,
      hashtags: ['hashtag3', 'hashtag4'],
      timestamp: Date.now()
    }
  ];

  const comments = [
    {
      id: 1,
      username: '用戶1',
      avatar: 'https://example.com/avatar1.jpg',
      content: '這是一條評論。',
    },
    {
      id: 2,
      username: '用戶2',
      avatar: 'https://example.com/avatar2.jpg',
      content: '這是另一條評論。',
    },
  ];

  const followers = [
    {
      id: 1,
      name: 'John Doe',
      avatar: 'https://picsum.photos/200/300',
    },
    {
      id: 2,
      name: 'Jane Doe',
      avatar: 'https://picsum.photos/200/300',
    },
  ];
  
  const following = [
    {
      id: 3,
      name: 'Bob Smith',
      avatar: 'https://picsum.photos/200/300',
    },
  ];
  
  const followRequests = [
    {
      id: 4,
      name: 'Alice Johnson',
      avatar: 'https://picsum.photos/200/300',
    },
  ];

  return (
    <Router>
      <div>
        <Sidebar />
        <Routes>
          <Route
            path="/"
            element={<Home posts={posts} />}
          />
        </Routes>
        <Routes>
          <Route
            path="/post"
            element={<PostDetailPage posts={posts} comments={comments} />}
          />
        </Routes>
        <Routes>
          <Route
            path="/createNewPost"
            element={<CreateNewPost username="me" avatar={posts[0].user.avatar} />}
          />
        </Routes>
        <Routes>
          <Route
            path="/followers"
            element={<FollowerPage followers={followers} following={following} followRequests={followRequests} />}
          />
        </Routes>
        <Routes>
          <Route
            path="/profile"
            element={<ProfilePage posts={posts} />}
          />
        </Routes>
        <Routes>
          <Route
            path="/profileedit"
            element={<EditProfile />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

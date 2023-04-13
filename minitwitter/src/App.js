import "./App.css"
import Sidebar from "./Sidebar"
import Home from './Home';
import PostDetailPage from './PostDetailPage'
import CreateNewPost from './CreateNewPost'
import FollowerPage from './FollowerPage'
import ProfilePage from './ProfilePage'
import EditProfile from './EditProfile'
import SearchPage from './SearchPage'
import RecommendationPage from './RecommendationPage'
import OtherProfilePage from './OtherProfilePage'
import AdminPage from './AdminPage'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';




function App(){
  sessionStorage.setItem('username', 'user3');

  
  return (
    <Router>
      <div>
      {/* <Sidebar /> */}        
        <Routes>
          <Route path="/" element={<Home/>}/>
        </Routes>

        <Routes>
          <Route path="/post" element={<PostDetailPage/>}/>
        </Routes>

        <Routes>
          <Route path="/createNewPost" element={<CreateNewPost/>}/>
        </Routes>

        <Routes>
          <Route path="/followers" element={<FollowerPage/>}/>
        </Routes>

        <Routes>
          <Route path="/my profile" element={<ProfilePage />}/>
        </Routes>

        <Routes>
          <Route path="/profileedit" element={<EditProfile />}/>
        </Routes>

        <Routes>
          <Route path="/search" element={<SearchPage />}/>
        </Routes>

        <Routes>
          <Route path="/recommendation" element={<RecommendationPage/>}/>
        </Routes>

        <Routes>
          <Route path="/other profile" element={<OtherProfilePage />}/>
        </Routes>

        <Routes>
          <Route path="/admin" element={<AdminPage />}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App

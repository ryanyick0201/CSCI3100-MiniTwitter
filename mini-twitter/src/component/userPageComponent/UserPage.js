import Sidebar from "./afterLoginComponent/Sidebar";
import Home from "./afterLoginComponent/Home";
import PostDetailPage from "./afterLoginComponent/PostDetailPage";
import CreateNewPost from "./afterLoginComponent/CreateNewPost";
import FollowerPage from "./afterLoginComponent/FollowerPage";
import ProfilePage from "./afterLoginComponent/ProfilePage";
import EditProfile from "./afterLoginComponent/EditProfile";
import SearchPage from "./afterLoginComponent/SearchPage";
import RecommendationPage from "./afterLoginComponent/RecommendationPage";
import OtherProfilePage from "./afterLoginComponent/OtherProfilePage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function UserPage() {
  sessionStorage.setItem("username", "user3");

  return (
    <Router>
      <div>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post" element={<PostDetailPage />} />
          <Route path="/createNewPost" element={<CreateNewPost />} />
          <Route path="/followers" element={<FollowerPage />} />
          <Route path="/myProfile" element={<ProfilePage />} />
          <Route path="/profileEdit" element={<EditProfile />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/recommendation" element={<RecommendationPage />} />
          <Route path="/otherProfile" element={<OtherProfilePage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default UserPage;

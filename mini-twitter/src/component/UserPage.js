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

import ChatPage from "./ChatPage";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function UserPage() {
  sessionStorage.setItem("username", "user1");

  return (
    <div>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post" element={<PostDetailPage />} />
        <Route path="/createNewPost" element={<CreateNewPost />} />
        <Route path="/followers" element={<FollowerPage />} />
        <Route path="/my profile" element={<ProfilePage />} />
        <Route path="/profileedit" element={<EditProfile />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/recommendation" element={<RecommendationPage />} />
        <Route path="/other profile" element={<OtherProfilePage />} />
        <Route
          path="/chat"
          element={<ChatPage sender={sessionStorage.getItem("username")} />}
        />
      </Routes>
    </div>
  );
}

export default UserPage;

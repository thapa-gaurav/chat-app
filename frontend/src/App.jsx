import React from "react";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

export const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/setting" element={<SettingsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
};
export default App;

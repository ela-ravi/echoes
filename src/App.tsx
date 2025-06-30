import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import NewsListPage from "./pages/NewsListPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import ClientNewsDetailPage from "./pages/ClientNewsDetailPage/ClientNewsDetailPage";
import TestNavigationPage from "./pages/TestNavigationPage";
import Registration from "./pages/Registration/Registration";
import Login from "./pages/Login/Login";
import LoggedOut from "./pages/LoggedOut/LoggedOut";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./theme/global.css";
import ClientNewsListPage from "./pages/ClientNewsListPage";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<NewsListPage />} />
        <Route
          path="/news-detail"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <NewsDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-news-detail"
          element={
            <ProtectedRoute requiredRole="CLIENT">
              <ClientNewsDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-news"
          element={
            <ProtectedRoute requiredRole="CLIENT">
              <ClientNewsListPage />
            </ProtectedRoute>
          }
        />
        <Route path="/test-navigation" element={<TestNavigationPage />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logged-out" element={<LoggedOut />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default App;

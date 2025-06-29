import React from "react";
import { Routes, Route } from "react-router-dom";
import NewsListPage from "./pages/NewsListPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import TestNavigationPage from "./pages/TestNavigationPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/news" element={<NewsListPage />} />
        <Route path="/news-detail" element={<NewsDetailPage />} />
        <Route path="/test-navigation" element={<TestNavigationPage />} />
        <Route path="/" element={<NewsListPage />} />
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
  );
};

export default App;

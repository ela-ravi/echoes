import React from "react";
import { Routes, Route } from "react-router-dom";
import NewsListPage from "./pages/NewsListPage";
import NewsDetailPage from "./pages/NewsDetailPage";

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/news" element={<NewsListPage />} />
        <Route path="/news-detail" element={<NewsDetailPage />} />
        <Route path="/" element={<NewsListPage />} />
      </Routes>
    </>
  );
};

export default App;

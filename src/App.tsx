import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './layouts/Header';
import Footer from './layouts/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import RaceResultsPage from './pages/RaceResultsPage';
import ClubPage from './pages/ClubPage';
import NewsPage from './pages/NewsPage';
import NewsletterPage from './pages/NewsletterPage';
import StoryDetailPage from './pages/StoryDetailPage';
import JoinPage from './pages/JoinPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProtectedRoute from './components/ProtectedRoute';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
              <Route path="/results" element={<RaceResultsPage />} />
              <Route path="/club" element={<ClubPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/news/:id" element={<StoryDetailPage />} />
              <Route path="/newsletters/:id" element={<NewsletterPage />} />
              <Route path="/join" element={<JoinPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
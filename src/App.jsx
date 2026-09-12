import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { storage } from './services/storage';

// Public Pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import AssessmentList from './pages/AssessmentList';
import AssessmentRunner from './pages/AssessmentRunner';
import AssessmentResult from './pages/AssessmentResult';
import HomeGuide from './pages/HomeGuide';
import HomeGuideDetail from './pages/HomeGuideDetail';
import Contact from './pages/Contact';

// Layout
import PublicLayout from './components/layout/PublicLayout';

// Admin CMS
import Login from './admin/Login';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import HomeCMS from './admin/HomeCMS';
import ServicesCMS from './admin/ServicesCMS';
import AboutTeamCMS from './admin/AboutTeamCMS';
import AssessmentsCMS from './admin/AssessmentsCMS';
import AssessmentBuilder from './admin/AssessmentBuilder';
import HomeGuideCMS from './admin/HomeGuideCMS';
import ContactCMS from './admin/ContactCMS';
import SettingsCMS from './admin/SettingsCMS';

export default function App() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function loadSettings() {
      const data = await storage.getSettings();
      setSettings(data);
    }
    loadSettings();

    // Listen for live settings changes across tabs or admin updates
    const handleSettingsChange = (e) => {
      if (e.detail) setSettings(e.detail);
    };
    const handleStorage = (e) => {
      if (e.key === 'hugdee_site_settings_v2' && e.newValue) {
        try {
          setSettings(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Error parsing settings from storage event:', err);
        }
      }
    };

    window.addEventListener('hugdee_settings_changed', handleSettingsChange);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('hugdee_settings_changed', handleSettingsChange);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <Router>
      <Routes>
        
        {/* ===============================================================
            PUBLIC ROUTES (6 Core Pages + Assessment Engine)
           =============================================================== */}
        <Route 
          path="/" 
          element={
            <PublicLayout settings={settings}>
              <Home settings={settings} />
            </PublicLayout>
          } 
        />
        <Route 
          path="/services" 
          element={
            <PublicLayout settings={settings}>
              <Services settings={settings} />
            </PublicLayout>
          } 
        />
        <Route 
          path="/about" 
          element={
            <PublicLayout settings={settings}>
              <About settings={settings} />
            </PublicLayout>
          } 
        />
        
        {/* Assessment Routes */}
        <Route 
          path="/assessment" 
          element={
            <PublicLayout settings={settings}>
              <AssessmentList settings={settings} />
            </PublicLayout>
          } 
        />
        <Route 
          path="/assessment/:id" 
          element={
            <PublicLayout settings={settings}>
              <AssessmentRunner settings={settings} />
            </PublicLayout>
          } 
        />
        <Route 
          path="/assessment/:id/result" 
          element={
            <PublicLayout settings={settings}>
              <AssessmentResult settings={settings} />
            </PublicLayout>
          } 
        />

        {/* Home Guide (Content Hub) */}
        <Route 
          path="/home-guide" 
          element={
            <PublicLayout settings={settings}>
              <HomeGuide settings={settings} />
            </PublicLayout>
          } 
        />
        <Route 
          path="/home-guide/:slug" 
          element={
            <PublicLayout settings={settings}>
              <HomeGuideDetail settings={settings} />
            </PublicLayout>
          } 
        />

        {/* Contact Page */}
        <Route 
          path="/contact" 
          element={
            <PublicLayout settings={settings}>
              <Contact settings={settings} />
            </PublicLayout>
          } 
        />

        {/* Redirect old routes */}
        <Route path="/articles" element={<Navigate to="/home-guide" replace />} />
        <Route path="/articles/:slug" element={<Navigate to="/home-guide" replace />} />
        <Route path="/concerns" element={<Navigate to="/assessment" replace />} />
        <Route path="/promotions" element={<Navigate to="/services" replace />} />
        <Route path="/gallery" element={<Navigate to="/about" replace />} />

        {/* ===============================================================
            ADMIN ROUTES (Protected CMS Area)
           =============================================================== */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminLayout settings={settings}>
              <Dashboard settings={settings} />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/home" 
          element={
            <AdminLayout settings={settings}>
              <HomeCMS settings={settings} />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/services" 
          element={
            <AdminLayout settings={settings}>
              <ServicesCMS settings={settings} />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/about" 
          element={
            <AdminLayout settings={settings}>
              <AboutTeamCMS mode="about" settings={settings} />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/team" 
          element={
            <AdminLayout settings={settings}>
              <AboutTeamCMS mode="team" settings={settings} />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/assessment" 
          element={
            <AdminLayout settings={settings}>
              <AssessmentsCMS settings={settings} />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/assessment/builder/:id" 
          element={
            <AdminLayout settings={settings}>
              <AssessmentBuilder settings={settings} />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/home-guide" 
          element={
            <AdminLayout settings={settings}>
              <HomeGuideCMS settings={settings} />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/contact" 
          element={
            <AdminLayout settings={settings}>
              <ContactCMS settings={settings} />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <AdminLayout settings={settings}>
              <SettingsCMS activeTab="general" settings={settings} />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/settings/general" 
          element={
            <AdminLayout settings={settings}>
              <SettingsCMS activeTab="general" settings={settings} />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/settings/logo" 
          element={
            <AdminLayout settings={settings}>
              <SettingsCMS activeTab="logo" settings={settings} />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/settings/social" 
          element={
            <AdminLayout settings={settings}>
              <SettingsCMS activeTab="social" settings={settings} />
            </AdminLayout>
          } 
        />
        <Route 
          path="/admin/settings/hours" 
          element={
            <AdminLayout settings={settings}>
              <SettingsCMS activeTab="hours" settings={settings} />
            </AdminLayout>
          } 
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

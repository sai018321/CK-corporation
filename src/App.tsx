import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import ServicePage from './pages/ServicePage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import DynamicPage from './pages/DynamicPage';
import initialData from './data/siteData.json';

export default function App() {
  const [siteData, setSiteData] = useState<any>(initialData);
  const [loading, setLoading] = useState(true);

  const fetchSiteData = async () => {
    try {
      const response = await fetch('/api/site-data');
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json();
      if (data && !data.error) {
        setSiteData(data);
      }
    } catch (error: any) {
      console.warn('Server data not available, using bundled data:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSiteData();
  }, []);

  if (loading && !siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C8102E]"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Admin Route - No Header/Footer */}
        <Route path="/admin" element={<AdminPage data={siteData} onUpdate={setSiteData} />} />

        {/* Public Routes */}
        <Route
          path="*"
          element={
            <div className="flex flex-col min-h-screen font-sans">
              <Header data={siteData} />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home data={siteData} />} />
                  
                  {/* About Routes */}
                  <Route path="/about/overview" element={<DynamicPage data={siteData} pageKey="company-overview" />} />
                  <Route path="/about/advantages" element={<DynamicPage data={siteData} pageKey="our-advantages" />} />
                  <Route path="/about/vision" element={<DynamicPage data={siteData} pageKey="vision-mission" />} />
                  
                  {/* Service Routes */}
                  <Route path="/service/product-management" element={<DynamicPage data={siteData} pageKey="product-management" />} />
                  <Route path="/service/procurement" element={<DynamicPage data={siteData} pageKey="procurement" />} />
                  <Route path="/service/fabrication" element={<DynamicPage data={siteData} pageKey="fabrication" />} />
                  <Route path="/service/logistics" element={<DynamicPage data={siteData} pageKey="logistics" />} />
                  
                  {/* Contact Route */}
                  <Route path="/contact" element={<ContactPage data={siteData} />} />

                  {/* Dynamic Navigation Routes */}
                  {siteData.navigation
                    .filter((nav: any) => !['home', 'about', 'service', 'contact'].includes(nav.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')))
                    .map((nav: any) => (
                      <Route key={nav.path} path={nav.path} element={<DynamicPage data={siteData} pageKey={nav.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')} />} />
                    ))
                  }
                  {siteData.navigation.flatMap((nav: any) => 
                    nav.dropdown?.map((sub: any) => (
                      <Route 
                        key={sub.path} 
                        path={sub.path} 
                        element={<DynamicPage data={siteData} pageKey={sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')} />} 
                      />
                    )) || []
                  )}
                </Routes>
              </main>
              <Footer data={siteData} />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

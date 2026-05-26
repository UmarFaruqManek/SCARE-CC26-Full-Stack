import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ScrollToTop from './components/ScrollToTop';

// Import Halaman
import Home from './pages/Home/Home';
import Analysis from './pages/Analysis/Analysis';
import Treatment from './pages/Treatment/Treatment';
import NotFound from './pages/NotFound/NotFound';
import ServerError from './pages/ServerError/ServerError';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="analysis" element={<Analysis />} />
          <Route path="treatment" element={<Treatment />} />
          <Route path="*" element={<NotFound />} />
          <Route path="500" element={<ServerError />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
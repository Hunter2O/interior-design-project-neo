import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';

import Home from './pages/Home';
import Bedroom from './pages/Bedroom';
import LivingRoom from './pages/LivingRoom';
import Bathroom from './pages/Bathroom';
import Kitchen from './pages/Kitchen';
import Checkout from './pages/Checkout'; // ✅ Add this line

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bedroom" element={<Bedroom />} />
            <Route path="/livingroom" element={<LivingRoom />} />
            <Route path="/bathroom" element={<Bathroom />} />
            <Route path="/kitchen" element={<Kitchen />} />
            <Route path="/checkout" element={<Checkout />} /> {/* ✅ Add this line */}
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;

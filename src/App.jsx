import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Story from './pages/Story';
import Combat from './pages/Combat';
import Characters from './pages/Characters';
import Gacha from './pages/Gacha';
import LoadingScreen from './components/LoadingScreen';
import { GameProvider } from './context/GameContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <Navigation />

          <main className="pt-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/story" element={<Story />} />
              <Route path="/combat" element={<Combat />} />
              <Route path="/characters" element={<Characters />} />
              <Route path="/gacha" element={<Gacha />} />
            </Routes>
          </main>

          {/* Background Effects */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute top-20 left-10 w-32 h-32 bg-academy-blue opacity-10 rounded-full animate-float"></div>
            <div className="absolute top-40 right-20 w-24 h-24 bg-academy-pink opacity-10 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-1/3 w-20 h-20 bg-academy-purple opacity-10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
          </div>
        </motion.div>
      </div>
    </GameProvider>
  );
}

export default App;
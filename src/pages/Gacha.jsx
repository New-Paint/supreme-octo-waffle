import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useGame } from '../context/GameContext';

const { FiGift, FiStar, FiZap, FiGem, FiRefreshCw, FiHeart } = FiIcons;

const Gacha = () => {
  const { state, dispatch } = useGame();
  const [isPulling, setIsPulling] = useState(false);
  const [pullResult, setPullResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [sparkles, setSparkles] = useState([]);

  const gachaBanners = [
    {
      id: 'standard',
      name: 'Standard Recruitment',
      cost: 150,
      currency: 'gems',
      rates: {
        5: 1.5,
        4: 8.0,
        3: 90.5
      },
      featured: null
    },
    {
      id: 'maya_rateup',
      name: 'Maya Rate-Up',
      cost: 150,
      currency: 'gems',
      rates: {
        5: 1.5,
        4: 8.0,
        3: 90.5
      },
      featured: 'maya',
      description: 'Increased chance for Maya (5★)!'
    }
  ];

  const [selectedBanner, setSelectedBanner] = useState(gachaBanners[0]);

  useEffect(() => {
    if (showResult && pullResult) {
      // Create sparkle effect
      const newSparkles = [];
      for (let i = 0; i < 20; i++) {
        newSparkles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 1,
          duration: 1 + Math.random()
        });
      }
      setSparkles(newSparkles);

      const timer = setTimeout(() => {
        setSparkles([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showResult, pullResult]);

  const performGachaPull = () => {
    if (state.player.gems < selectedBanner.cost) {
      alert("Not enough gems!");
      return;
    }

    setIsPulling(true);

    // Simulate gacha logic
    setTimeout(() => {
      const roll = Math.random() * 100;
      let rarity = 3;
      let character = null;

      // Determine rarity
      if (roll < selectedBanner.rates[5]) {
        rarity = 5;
      } else if (roll < selectedBanner.rates[5] + selectedBanner.rates[4]) {
        rarity = 4;
      } else {
        rarity = 3;
      }

      // Apply pity system
      if (state.gacha.pityCounter >= 99) {
        rarity = Math.max(rarity, 4);
      }

      // Select character based on rarity
      const availableChars = state.characters.filter(c => c.rarity === rarity);

      if (selectedBanner.featured && rarity === 5 && Math.random() < 0.5) {
        character = state.characters.find(c => c.id === selectedBanner.featured);
      } else if (availableChars.length > 0) {
        character = availableChars[Math.floor(Math.random() * availableChars.length)];
      } else {
        // Fallback to Maya if no characters found
        character = state.characters.find(c => c.id === 'maya');
      }

      const result = {
        character,
        rarity,
        isNew: !character.owned
      };

      setPullResult(result);
      setIsPulling(false);
      setShowResult(true);

      // Update game state
      dispatch({ type: 'SPEND_GEMS', amount: selectedBanner.cost });
      dispatch({ type: 'GACHA_PULL', result });

      if (!character.owned) {
        dispatch({ type: 'ADD_CHARACTER', character });
      }
    }, 3000);
  };

  const closeResult = () => {
    setShowResult(false);
    setPullResult(null);
    setSparkles([]);
  };

  const getRarityColor = (rarity) => {
    const colors = {
      3: 'from-blue-500 to-blue-600',
      4: 'from-purple-500 to-purple-600',
      5: 'from-yellow-400 to-orange-500'
    };
    return colors[rarity] || colors[3];
  };

  const getRarityGlow = (rarity) => {
    const glows = {
      3: 'shadow-blue-500/50',
      4: 'shadow-purple-500/50',
      5: 'shadow-yellow-500/50'
    };
    return glows[rarity] || glows[3];
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center space-x-3">
            <SafeIcon icon={FiGift} className="w-10 h-10 text-pink-400" />
            <span>Character Recruitment</span>
          </h1>
          <p className="text-gray-300 text-lg">Recruit new characters to join Maya's team</p>
        </motion.div>

        {/* Pity Counter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect p-4 rounded-xl mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <span className="text-sm font-medium">Pity Counter</span>
              <p className="text-xs text-gray-400">Guaranteed 4★ at 100 pulls</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-yellow-400">{state.gacha.pityCounter}</span>
              <span className="text-gray-400">/100</span>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${state.gacha.pityCounter}%` }}
            />
          </div>
        </motion.div>

        {/* Banner Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          {gachaBanners.map((banner, index) => (
            <div
              key={banner.id}
              className={`glass-effect p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                selectedBanner.id === banner.id
                  ? 'ring-2 ring-pink-500 bg-pink-900/20'
                  : 'hover:bg-slate-800/30'
              }`}
              onClick={() => setSelectedBanner(banner)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{banner.name}</h3>
                <div className="flex items-center space-x-2">
                  <SafeIcon icon={FiGem} className="w-5 h-5 text-blue-400" />
                  <span className="font-medium">{banner.cost}</span>
                </div>
              </div>

              {banner.description && (
                <p className="text-sm text-pink-400 mb-4">{banner.description}</p>
              )}

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-300">Drop Rates:</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="flex justify-center space-x-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <SafeIcon key={i} icon={FiStar} className="w-3 h-3 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-yellow-400">{banner.rates[5]}%</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center space-x-1 mb-1">
                      {[...Array(4)].map((_, i) => (
                        <SafeIcon key={i} icon={FiStar} className="w-3 h-3 text-purple-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-purple-400">{banner.rates[4]}%</p>
                  </div>
                  <div className="text-center">
                    <div className="flex justify-center space-x-1 mb-1">
                      {[...Array(3)].map((_, i) => (
                        <SafeIcon key={i} icon={FiStar} className="w-3 h-3 text-blue-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-blue-400">{banner.rates[3]}%</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Pull Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center mb-8"
        >
          <div className="glass-effect p-8 rounded-xl max-w-md mx-auto">
            <h3 className="text-2xl font-bold mb-6">{selectedBanner.name}</h3>

            <div className="space-y-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={performGachaPull}
                disabled={isPulling || state.player.gems < selectedBanner.cost}
                className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center space-x-3"
              >
                {isPulling ? (
                  <>
                    <SafeIcon icon={FiRefreshCw} className="w-6 h-6 animate-spin" />
                    <span>Summoning...</span>
                  </>
                ) : (
                  <>
                    <SafeIcon icon={FiZap} className="w-6 h-6" />
                    <span>Single Pull ({selectedBanner.cost} Gems)</span>
                  </>
                )}
              </motion.button>

              <div className="text-sm text-gray-400">
                Your Gems: {state.player.gems}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Pulls */}
        {state.gacha.lastPull && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="glass-effect p-6 rounded-xl"
          >
            <h3 className="text-xl font-bold mb-4">Recent Pull</h3>
            <div className="flex items-center space-x-4">
              <img
                src={state.gacha.lastPull.character?.image}
                alt={state.gacha.lastPull.character?.name}
                className={`w-16 h-16 rounded-full rarity-${state.gacha.lastPull.rarity}`}
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iMzIiIGZpbGw9IiM0Nzc0OEIiLz4KPHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxNiIgeT0iMTYiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDE2IDE1SDhBNCA0IDAgMCAwIDQgMTlWMjEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                }}
              />
              <div>
                <h4 className="font-bold">{state.gacha.lastPull.character?.name}</h4>
                <div className="flex space-x-1">
                  {[...Array(state.gacha.lastPull.rarity)].map((_, i) => (
                    <SafeIcon key={i} icon={FiStar} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  {state.gacha.lastPull.isNew ? 'NEW!' : 'Duplicate'}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Pull Result Modal */}
      <AnimatePresence>
        {showResult && pullResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={closeResult}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Sparkle Effects */}
              {sparkles.map((sparkle) => (
                <motion.div
                  key={sparkle.id}
                  className="gacha-sparkle absolute"
                  style={{
                    left: `${sparkle.x}%`,
                    top: `${sparkle.y}%`,
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{
                    delay: sparkle.delay,
                    duration: sparkle.duration,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              ))}

              <div className={`glass-effect p-8 rounded-xl text-center bg-gradient-to-br ${getRarityColor(pullResult.rarity)} bg-opacity-20 shadow-2xl ${getRarityGlow(pullResult.rarity)}`}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="mb-6"
                >
                  <img
                    src={pullResult.character.image}
                    alt={pullResult.character.name}
                    className={`w-32 h-32 rounded-full mx-auto border-4 rarity-${pullResult.rarity} shadow-2xl`}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiM0Nzc0OEIiLz4KPHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIzMiIgeT0iMzIiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDE2IDE1SDhBNCA0IDAgMCAwIDQgMTlWMjEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <h2 className="text-3xl font-bold mb-2">{pullResult.character.name}</h2>
                  <p className="text-lg text-gray-300 mb-4">{pullResult.character.role}</p>

                  <div className="flex justify-center space-x-1 mb-4">
                    {[...Array(pullResult.rarity)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.8 + i * 0.1, type: "spring" }}
                      >
                        <SafeIcon icon={FiStar} className="w-6 h-6 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>

                  {pullResult.isNew && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ delay: 1.2, duration: 0.5 }}
                      className="inline-block bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-2 rounded-full font-bold text-white mb-4"
                    >
                      NEW CHARACTER!
                    </motion.div>
                  )}

                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={closeResult}
                    className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Continue
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gacha;
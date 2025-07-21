import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useGame } from '../context/GameContext';

const { FiHome, FiBook, FiZap, FiUsers, FiGift, FiGem, FiCoins, FiBatteryCharging, FiMenu, FiX } = FiIcons;

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { state } = useGame();

  const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/story', icon: FiBook, label: 'Story' },
    { path: '/combat', icon: FiZap, label: 'Combat' },
    { path: '/characters', icon: FiUsers, label: 'Team' },
    { path: '/gacha', icon: FiGift, label: 'Gacha' },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent"
              >
                Het Amsterdams Lyceum
              </motion.div>
            </Link>

            {/* Desktop Navigation Items */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <SafeIcon icon={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Resources */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-lg">
                <SafeIcon icon={FiGem} className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">{state.player.gems}</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-lg">
                <SafeIcon icon={FiCoins} className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-medium">{state.player.credits}</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1 rounded-lg">
                <SafeIcon icon={FiBatteryCharging} className="w-4 h-4 text-green-400" />
                <span className="text-sm font-medium">{state.player.stamina}/{state.player.maxStamina}</span>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-slate-800"
            >
              <SafeIcon icon={isOpen ? FiX : FiMenu} className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        className="fixed top-16 right-0 bottom-0 w-80 bg-slate-900/95 backdrop-blur-md border-l border-slate-700 z-30 md:hidden"
      >
        <div className="p-6 space-y-6">
          {/* Resources */}
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiGem} className="w-5 h-5 text-blue-400" />
                <span className="text-sm">Gems</span>
              </div>
              <span className="font-medium">{state.player.gems}</span>
            </div>
            <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiCoins} className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Credits</span>
              </div>
              <span className="font-medium">{state.player.credits}</span>
            </div>
            <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <SafeIcon icon={FiBatteryCharging} className="w-5 h-5 text-green-400" />
                <span className="text-sm">Stamina</span>
              </div>
              <span className="font-medium">{state.player.stamina}/{state.player.maxStamina}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <SafeIcon icon={item.icon} className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Navigation;
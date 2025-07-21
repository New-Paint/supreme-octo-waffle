import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useGame } from '../context/GameContext';

const { FiPlay, FiUsers, FiZap, FiGift, FiTrendingUp, FiClock } = FiIcons;

const Home = () => {
  const { state } = useGame();

  const quickActions = [
    {
      title: 'Continue Story',
      description: `Chapter ${state.story.currentChapter}: Maya's Journey`,
      icon: FiPlay,
      link: '/story',
      color: 'from-blue-500 to-purple-600'
    },
    {
      title: 'Combat Training',
      description: 'Practice tactical battles',
      icon: FiZap,
      link: '/combat',
      color: 'from-red-500 to-orange-600'
    },
    {
      title: 'Team Management',
      description: 'Manage your characters',
      icon: FiUsers,
      link: '/characters',
      color: 'from-green-500 to-teal-600'
    },
    {
      title: 'Gacha Summons',
      description: 'Recruit new characters',
      icon: FiGift,
      link: '/gacha',
      color: 'from-pink-500 to-rose-600'
    }
  ];

  const dailyTasks = [
    { task: 'Complete 3 story missions', progress: 1, max: 3, reward: '100 Credits' },
    { task: 'Win 2 combat battles', progress: 0, max: 2, reward: '50 Gems' },
    { task: 'Level up any character', progress: 0, max: 1, reward: '200 Credits' }
  ];

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Het Amsterdams Lyceum
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Guide Maya and her sisters through tactical battles and personal growth in this anime-inspired RPG adventure.
          </p>
        </motion.div>

        {/* Quick Actions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="group"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className={`glass-effect p-6 rounded-xl bg-gradient-to-br ${action.color} bg-opacity-20 hover:bg-opacity-30 transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <SafeIcon
                    icon={action.icon}
                    className="w-8 h-8 text-white group-hover:animate-glow"
                  />
                  <div className="w-2 h-2 bg-white rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                <p className="text-sm text-gray-300">{action.description}</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Player Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="glass-effect p-6 rounded-xl">
            <div className="flex items-center space-x-3 mb-4">
              <SafeIcon icon={FiTrendingUp} className="w-6 h-6 text-blue-400" />
              <h3 className="text-lg font-semibold">Player Level</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Level {state.player.level}</span>
                <span>{state.player.exp}/1000 EXP</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(state.player.exp / 1000) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-xl">
            <div className="flex items-center space-x-3 mb-4">
              <SafeIcon icon={FiUsers} className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold">Team Status</h3>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">Active Characters: {state.currentTeam.length}/4</p>
              <p className="text-sm text-gray-300">
                Owned: {state.characters.filter(c => c.owned).length}/{state.characters.length}
              </p>
            </div>
          </div>

          <div className="glass-effect p-6 rounded-xl">
            <div className="flex items-center space-x-3 mb-4">
              <SafeIcon icon={FiClock} className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg font-semibold">Energy</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Stamina</span>
                <span>{state.player.stamina}/{state.player.maxStamina}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(state.player.stamina / state.player.maxStamina) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="glass-effect p-6 rounded-xl"
        >
          <h3 className="text-xl font-semibold mb-6 flex items-center space-x-2">
            <SafeIcon icon={FiClock} className="w-6 h-6 text-orange-400" />
            <span>Daily Tasks</span>
          </h3>

          <div className="space-y-4">
            {dailyTasks.map((task, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.task}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(task.progress / task.max) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-400">{task.progress}/{task.max}</span>
                  </div>
                </div>
                <div className="text-sm text-green-400 font-medium ml-4">
                  {task.reward}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Featured Characters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-effect p-6 rounded-xl"
        >
          <h3 className="text-xl font-semibold mb-6">Your Team</h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {state.characters.filter(c => c.owned).map((character) => (
              <div key={character.id} className="text-center">
                <div className={`character-portrait mx-auto mb-3 rarity-${character.rarity}`}>
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IiM0Nzc0OEIiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMCIgeT0iMjAiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDE2IDE1SDhBNCA0IDAgMCAwIDQgMTlWMjEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                    }}
                  />
                </div>
                <h4 className="text-sm font-medium">{character.name}</h4>
                <p className="text-xs text-gray-400">{character.role} • Lv.{character.level}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
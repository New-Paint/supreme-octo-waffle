import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useGame } from '../context/GameContext';

const { FiUsers, FiStar, FiHeart, FiShield, FiZap, FiTrendingUp, FiGift } = FiIcons;

const Characters = () => {
  const { state, dispatch } = useGame();
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [activeTab, setActiveTab] = useState('owned');

  const ownedCharacters = state.characters.filter(c => c.owned);
  const allCharacters = state.characters;

  const getRarityColor = (rarity) => {
    const colors = {
      1: 'from-gray-500 to-gray-600',
      2: 'from-green-500 to-green-600',
      3: 'from-blue-500 to-blue-600',
      4: 'from-purple-500 to-purple-600',
      5: 'from-yellow-500 to-orange-500'
    };
    return colors[rarity] || colors[3];
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Tank': return FiShield;
      case 'Attacker': return FiZap;
      case 'Support': return FiHeart;
      default: return FiUsers;
    }
  };

  const levelUpCharacter = (characterId) => {
    if (state.player.credits < 500) {
      alert("Not enough credits to level up!");
      return;
    }

    // In a real implementation, this would update the character
    dispatch({ type: 'SPEND_CREDITS', amount: 500 });
    alert("Character leveled up! (Feature in development)");
  };

  const increaseBond = (characterId) => {
    if (state.player.credits < 50) {
      alert("Not enough credits for a gift!");
      return;
    }

    dispatch({ type: 'SPEND_CREDITS', amount: 50 });
    alert("Bond level increased! (Feature in development)");
  };

  const charactersToShow = activeTab === 'owned' ? ownedCharacters : allCharacters;

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center space-x-3">
            <SafeIcon icon={FiUsers} className="w-10 h-10 text-purple-400" />
            <span>Character Management</span>
          </h1>
          <p className="text-gray-300 text-lg">Build your team and strengthen bonds with your characters</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="glass-effect p-1 rounded-lg flex">
            {['owned', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab === 'owned' ? 'My Characters' : 'All Characters'}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Grid */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {charactersToShow.map((character, index) => (
                <motion.div
                  key={character.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className={`glass-effect p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                    selectedCharacter?.id === character.id
                      ? 'ring-2 ring-blue-500 bg-blue-900/20'
                      : 'hover:bg-slate-800/30'
                  } ${!character.owned ? 'opacity-60' : ''}`}
                  onClick={() => setSelectedCharacter(character)}
                >
                  <div className="text-center mb-4">
                    <div className="relative inline-block">
                      <img
                        src={character.image}
                        alt={character.name}
                        className={`w-20 h-20 rounded-full mx-auto border-4 rarity-${character.rarity}`}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iNDAiIGZpbGw9IiM0Nzc0OEIiLz4KPHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyMCIgeT0iMjAiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDE2IDE1SDhBNCA0IDAgMCAwIDQgMTlWMjEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                        }}
                      />
                      {!character.owned && (
                        <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center">
                          <SafeIcon icon={FiUsers} className="w-8 h-8 text-gray-400" />
                        </div>
                      )}

                      {/* Rarity Stars */}
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                        {[...Array(character.rarity)].map((_, i) => (
                          <SafeIcon key={i} icon={FiStar} className="w-3 h-3 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold mt-4 mb-1">{character.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{character.role}</p>

                    {character.owned && (
                      <div className="text-sm space-y-1">
                        <p>Level {character.level} • Bond {character.bondLevel}</p>
                        <p className="text-xs text-gray-500">{character.relation}</p>
                      </div>
                    )}
                  </div>

                  {/* Stats Preview */}
                  {character.owned && (
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="bg-slate-800/50 p-2 rounded">
                        <SafeIcon icon={FiHeart} className="w-4 h-4 mx-auto mb-1 text-red-400" />
                        <p>{character.hp}</p>
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded">
                        <SafeIcon icon={FiZap} className="w-4 h-4 mx-auto mb-1 text-orange-400" />
                        <p>{character.atk}</p>
                      </div>
                      <div className="bg-slate-800/50 p-2 rounded">
                        <SafeIcon icon={FiShield} className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                        <p>{character.def}</p>
                      </div>
                    </div>
                  )}

                  {!character.owned && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Not Owned</p>
                      <p className="text-xs text-gray-600">Obtain from Gacha</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Character Details */}
          <div className="lg:col-span-1">
            {selectedCharacter ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-effect p-6 rounded-xl sticky top-8"
              >
                <div className="text-center mb-6">
                  <img
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    className={`w-24 h-24 rounded-full mx-auto border-4 rarity-${selectedCharacter.rarity} mb-4`}
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTYiIGhlaWdodD0iOTYiIHZpZXdCb3g9IjAgMCA5NiA5NiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijk2IiBoZWlnaHQ9Ijk2IiByeD0iNDgiIGZpbGw9IiM0Nzc0OEIiLz4KPHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIyNCIgeT0iMjQiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDE2IDE1SDhBNCA0IDAgMCAwIDQgMTlWMjEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                    }}
                  />
                  <h2 className="text-2xl font-bold">{selectedCharacter.name}</h2>
                  <div className="flex items-center justify-center space-x-2 mt-2">
                    <SafeIcon icon={getRoleIcon(selectedCharacter.role)} className="w-5 h-5 text-blue-400" />
                    <span className="text-gray-300">{selectedCharacter.role}</span>
                  </div>

                  <p className="text-sm text-gray-400 mt-2">{selectedCharacter.relation}</p>

                  {/* Rarity Stars */}
                  <div className="flex justify-center space-x-1 mt-2">
                    {[...Array(selectedCharacter.rarity)].map((_, i) => (
                      <SafeIcon key={i} icon={FiStar} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>

                {selectedCharacter.owned ? (
                  <>
                    {/* Stats */}
                    <div className="space-y-4 mb-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Level</span>
                          <span className="text-sm">{selectedCharacter.level}/50</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(selectedCharacter.level / 50) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Bond Level</span>
                          <span className="text-sm">{selectedCharacter.bondLevel}/10</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(selectedCharacter.bondLevel / 10) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Detailed Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                        <SafeIcon icon={FiHeart} className="w-6 h-6 mx-auto mb-2 text-red-400" />
                        <p className="text-sm text-gray-400">HP</p>
                        <p className="text-lg font-bold">{selectedCharacter.hp}</p>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                        <SafeIcon icon={FiZap} className="w-6 h-6 mx-auto mb-2 text-orange-400" />
                        <p className="text-sm text-gray-400">ATK</p>
                        <p className="text-lg font-bold">{selectedCharacter.atk}</p>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                        <SafeIcon icon={FiShield} className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                        <p className="text-sm text-gray-400">DEF</p>
                        <p className="text-lg font-bold">{selectedCharacter.def}</p>
                      </div>
                      <div className="bg-slate-800/50 p-3 rounded-lg text-center">
                        <SafeIcon icon={FiTrendingUp} className="w-6 h-6 mx-auto mb-2 text-green-400" />
                        <p className="text-sm text-gray-400">SPD</p>
                        <p className="text-lg font-bold">{selectedCharacter.spd}</p>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-6">
                      <h3 className="text-lg font-bold mb-3">Skills</h3>
                      <div className="space-y-2">
                        {selectedCharacter.skills.map((skill, index) => (
                          <div key={index} className="bg-slate-800/50 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{skill.name}</span>
                              <span className="text-xs text-gray-400">CD: {skill.cooldown}</span>
                            </div>
                            <p className="text-sm text-gray-400">{skill.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => levelUpCharacter(selectedCharacter.id)}
                        disabled={state.player.credits < 500 || selectedCharacter.level >= 50}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <SafeIcon icon={FiTrendingUp} className="w-5 h-5" />
                        <span>Level Up (500 Credits)</span>
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => increaseBond(selectedCharacter.id)}
                        disabled={state.player.credits < 50 || selectedCharacter.bondLevel >= 10}
                        className="w-full bg-pink-600 hover:bg-pink-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                      >
                        <SafeIcon icon={FiGift} className="w-5 h-5" />
                        <span>Give Gift (50 Credits)</span>
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <SafeIcon icon={FiUsers} className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                    <h3 className="text-lg font-bold mb-2">Character Not Owned</h3>
                    <p className="text-gray-400 mb-4">
                      Obtain this character through the Gacha system to unlock their full potential.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.hash = '#/gacha'}
                      className="bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Go to Gacha
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-effect p-6 rounded-xl text-center"
              >
                <SafeIcon icon={FiUsers} className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-lg font-bold mb-2">Select a Character</h3>
                <p className="text-gray-400">
                  Click on any character to view their details and manage their growth.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Characters;
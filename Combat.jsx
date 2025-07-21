import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useGame } from '../context/GameContext';

const { FiZap, FiShield, FiHeart, FiTarget, FiRotateCw, FiSword, FiMove, FiArrowRight } = FiIcons;

const Combat = () => {
  const { state, dispatch } = useGame();
  const [battleState, setBattleState] = useState('setup'); // setup, combat, victory, defeat
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [playerTeam, setPlayerTeam] = useState([]);
  const [enemyTeam, setEnemyTeam] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('player');
  const [turnOrder, setTurnOrder] = useState([]);
  const [currentUnit, setCurrentUnit] = useState(0);
  const [grid, setGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [moveMode, setMoveMode] = useState(false);
  const [moveRange, setMoveRange] = useState([]);
  const [attackRange, setAttackRange] = useState([]);
  const [hoverCell, setHoverCell] = useState(null);

  // Initialize 5x5 combat grid
  useEffect(() => {
    initializeGrid();
  }, []);

  const initializeGrid = () => {
    const newGrid = [];
    for (let row = 0; row < 5; row++) {
      newGrid[row] = [];
      for (let col = 0; col < 5; col++) {
        newGrid[row][col] = {
          row,
          col,
          occupied: null,
          hazard: Math.random() < 0.1 ? 'crowd_noise' : null,
          type: Math.random() < 0.2 ? 'desk' : 'floor',
        };
      }
    }
    setGrid(newGrid);
  };

  // Initialize battle
  const startBattle = () => {
    if (state.player.stamina < 15) {
      alert("Not enough stamina for combat!");
      return;
    }

    // Setup player team
    const team = state.characters
      .filter(c => c.owned)
      .slice(0, 3) // Allow up to 3 characters
      .map((char, index) => ({
        ...char,
        currentHp: char.hp,
        position: { row: 4, col: index * 2 },
        isPlayer: true,
        id: `player_${char.id}`,
        moved: false,
        attacked: false
      }));

    // Setup enemy team (Studio Massa boss fight)
    const enemies = [
      {
        id: 'studio_massa',
        name: 'Studio Massa',
        role: 'Boss',
        level: 5,
        hp: 1200,
        currentHp: 1200,
        maxHp: 1200,
        atk: 150,
        def: 100,
        spd: 5,
        position: { row: 0, col: 2 },
        isPlayer: false,
        phase: 1,
        image: 'https://static.wikia.nocookie.net/ongezellig/images/1/11/Massa1.jpg',
        skills: [
          { name: 'Budget Cuts', cooldown: 3, currentCooldown: 0, description: 'Spawns minions and debuffs' },
          { name: 'Deadline Crunch', cooldown: 4, currentCooldown: 0, description: '300% ATK single target' },
          { name: 'Last Gasp', cooldown: 5, currentCooldown: 0, description: '200% ATK area attack' }
        ],
        moved: false,
        attacked: false
      },
      {
        id: 'minion_1',
        name: 'Minion',
        role: 'Attacker',
        level: 3,
        hp: 300,
        currentHp: 300,
        maxHp: 300,
        atk: 80,
        def: 50,
        spd: 4,
        position: { row: 1, col: 1 },
        isPlayer: false,
        image: null,
        skills: [
          { name: 'Attack', cooldown: 0, currentCooldown: 0, description: 'Basic attack' }
        ],
        moved: false,
        attacked: false
      },
      {
        id: 'minion_2',
        name: 'Minion',
        role: 'Attacker',
        level: 3,
        hp: 300,
        currentHp: 300,
        maxHp: 300,
        atk: 80,
        def: 50,
        spd: 4,
        position: { row: 1, col: 3 },
        isPlayer: false,
        image: null,
        skills: [
          { name: 'Attack', cooldown: 0, currentCooldown: 0, description: 'Basic attack' }
        ],
        moved: false,
        attacked: false
      }
    ];

    setPlayerTeam(team);
    setEnemyTeam(enemies);

    // Place units on grid
    const newGrid = JSON.parse(JSON.stringify(grid)); // Deep copy
    team.forEach(unit => {
      newGrid[unit.position.row][unit.position.col].occupied = unit;
    });
    enemies.forEach(unit => {
      newGrid[unit.position.row][unit.position.col].occupied = unit;
    });
    setGrid(newGrid);

    // Calculate turn order by speed
    const allUnits = [...team, ...enemies];
    const order = allUnits.sort((a, b) => b.spd - a.spd);
    setTurnOrder(order);
    setCurrentUnit(0);

    setBattleState('combat');
    setBattleLog(['Battle begins! Face Studio Massa in the final showdown!']);
    
    dispatch({ type: 'USE_STAMINA', amount: 15 });
  };

  const selectCharacter = (character) => {
    if (battleState !== 'combat' || currentTurn !== 'player') return;
    
    const currentUnitData = turnOrder[currentUnit];
    if (currentUnitData.id !== character.id) return;

    // Reset states
    setSelectedCharacter(character);
    setSelectedSkill(null);
    setMoveMode(false);
    setAttackRange([]);
    setMoveRange([]);

    // Calculate move range
    if (!character.moved) {
      const range = calculateMoveRange(character.position, 2); // Movement range of 2
      setMoveRange(range);
    }
  };

  const toggleMoveMode = () => {
    if (!selectedCharacter || selectedCharacter.moved) return;
    
    setMoveMode(!moveMode);
    setSelectedSkill(null);
    setAttackRange([]);
  };

  const calculateMoveRange = (position, range) => {
    const movePositions = [];
    
    for (let r = Math.max(0, position.row - range); r <= Math.min(4, position.row + range); r++) {
      for (let c = Math.max(0, position.col - range); c <= Math.min(4, position.col + range); c++) {
        // Manhattan distance check
        if (Math.abs(r - position.row) + Math.abs(c - position.col) <= range) {
          // Check if position is empty
          if (!grid[r][c].occupied) {
            movePositions.push({row: r, col: c});
          }
        }
      }
    }
    
    return movePositions;
  };

  const calculateAttackRange = (position, range = 1) => {
    const attackPositions = [];
    
    for (let r = Math.max(0, position.row - range); r <= Math.min(4, position.row + range); r++) {
      for (let c = Math.max(0, position.col - range); c <= Math.min(4, position.col + range); c++) {
        // Manhattan distance check
        if (Math.abs(r - position.row) + Math.abs(c - position.col) <= range) {
          attackPositions.push({row: r, col: c});
        }
      }
    }
    
    return attackPositions;
  };

  const selectSkill = (skill) => {
    if (!selectedCharacter || skill.currentCooldown > 0 || selectedCharacter.attacked) return;
    
    setSelectedSkill(skill);
    setMoveMode(false);
    
    // Calculate attack range based on skill
    const range = skill.name === 'Power Strike' ? 2 : 1;
    const attackPositions = calculateAttackRange(selectedCharacter.position, range);
    setAttackRange(attackPositions);
  };

  const selectCell = (row, col) => {
    // Movement logic
    if (moveMode && isInMoveRange({row, col})) {
      moveCharacter(selectedCharacter, row, col);
      return;
    }
    
    // Attack logic
    if (selectedSkill && isInAttackRange({row, col})) {
      executeSkill(selectedCharacter, selectedSkill, row, col);
      return;
    }
    
    setSelectedCell({row, col});
  };

  const isInMoveRange = (position) => {
    return moveRange.some(pos => pos.row === position.row && pos.col === position.col);
  };

  const isInAttackRange = (position) => {
    return attackRange.some(pos => pos.row === position.row && pos.col === position.col);
  };

  const moveCharacter = (character, row, col) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    
    // Remove character from old position
    newGrid[character.position.row][character.position.col].occupied = null;
    
    // Update character position
    character.position = { row, col };
    character.moved = true;
    
    // Place character in new position
    newGrid[row][col].occupied = character;
    
    setGrid(newGrid);
    setMoveMode(false);
    setMoveRange([]);
    
    // Update player team with the moved character
    if (character.isPlayer) {
      setPlayerTeam(playerTeam.map(unit => 
        unit.id === character.id ? character : unit
      ));
    } else {
      setEnemyTeam(enemyTeam.map(unit => 
        unit.id === character.id ? character : unit
      ));
    }
    
    setBattleLog(prev => [...prev, `${character.name} moved to position (${row}, ${col}).`]);
  };

  const executeSkill = (attacker, skill, targetRow, targetCol) => {
    const newGrid = JSON.parse(JSON.stringify(grid));
    const target = newGrid[targetRow][targetCol].occupied;
    
    let damage = 0;
    let logMessage = '';
    let areaAffected = [];

    if (skill.name === 'Power Strike') {
      // Area attack
      areaAffected = calculateAttackRange({row: targetRow, col: targetCol}, 1);
      
      areaAffected.forEach(pos => {
        const aoeTarget = grid[pos.row][pos.col].occupied;
        if (aoeTarget && !aoeTarget.isPlayer) {
          damage = Math.floor(attacker.atk * 1.5 * (1 - aoeTarget.def / 300));
          aoeTarget.currentHp = Math.max(0, aoeTarget.currentHp - damage);
          newGrid[pos.row][pos.col].occupied = aoeTarget;
          
          logMessage += `${attacker.name} hits ${aoeTarget.name} with ${skill.name} for ${damage} damage! `;
        }
      });
      
    } else if (skill.name === 'Inspiration') {
      // Buff team members
      playerTeam.forEach(member => {
        member.buffedAtk = Math.floor(member.atk * 1.1);
        logMessage = `${attacker.name} inspires the team! ATK increased by 10% for 3 turns!`;
      });
      
    } else if (skill.name === 'Historical Defense') {
      // Buff defense
      playerTeam.forEach(member => {
        member.buffedDef = Math.floor(member.def * 1.2);
        logMessage = `${attacker.name} reinforces the team! DEF increased by 20% for 4 turns!`;
      });
      
    } else if (target) {
      // Basic attack or other targeted skill
      const defFactor = 1 - (target.def / 300);
      damage = Math.floor(attacker.atk * defFactor);
      target.currentHp = Math.max(0, target.currentHp - damage);
      newGrid[targetRow][targetCol].occupied = target;
      
      logMessage = `${attacker.name} attacks ${target.name} for ${damage} damage!`;
    }

    setBattleLog(prev => [...prev, logMessage]);

    // Update cooldown and attacked status
    attacker.attacked = true;
    skill.currentCooldown = skill.cooldown;
    
    // Update grid and teams
    setGrid(newGrid);
    
    if (attacker.isPlayer) {
      setPlayerTeam(playerTeam.map(unit => 
        unit.id === attacker.id ? attacker : unit
      ));
    } else {
      setEnemyTeam(enemyTeam.map(unit => 
        unit.id === attacker.id ? attacker : unit
      ));
    }

    // Reset attack UI
    setSelectedSkill(null);
    setAttackRange([]);
    
    // Check if all actions are done
    if (attacker.moved && attacker.attacked) {
      nextTurn();
    }
  };

  const endTurn = () => {
    if (currentTurn !== 'player') return;
    nextTurn();
  };

  const nextTurn = () => {
    // Reduce cooldowns for current character
    const currentCharacter = turnOrder[currentUnit];
    currentCharacter.skills?.forEach(skill => {
      if (skill.currentCooldown > 0) {
        skill.currentCooldown--;
      }
    });

    // Check for victory/defeat
    const playerAlive = playerTeam.some(unit => unit.currentHp > 0);
    const enemyAlive = enemyTeam.some(unit => unit.currentHp > 0);

    if (!playerAlive) {
      setBattleState('defeat');
      return;
    }

    if (!enemyAlive) {
      setBattleState('victory');
      // Reward player
      dispatch({ type: 'SPEND_CREDITS', amount: -500 });
      dispatch({ type: 'UPDATE_STORY', updates: { currentChapter: 11 } });
      return;
    }

    // Next unit's turn
    const nextUnitIndex = (currentUnit + 1) % turnOrder.length;
    
    // Reset current unit's action flags if we've gone through all units
    if (nextUnitIndex === 0) {
      // Reset all units' moved and attacked flags for a new round
      const resetTurnOrder = turnOrder.map(unit => ({
        ...unit,
        moved: false,
        attacked: false
      }));
      setTurnOrder(resetTurnOrder);
      
      // Update player team and enemy team
      setPlayerTeam(playerTeam.map(unit => ({
        ...unit,
        moved: false,
        attacked: false
      })));
      
      setEnemyTeam(enemyTeam.map(unit => ({
        ...unit,
        moved: false,
        attacked: false
      })));
      
      setBattleLog(prev => [...prev, "--- New Round Begins ---"]);
    }
    
    setCurrentUnit(nextUnitIndex);
    const nextUnit = turnOrder[nextUnitIndex];
    setCurrentTurn(nextUnit.isPlayer ? 'player' : 'enemy');

    // AI turn for enemies
    if (!nextUnit.isPlayer) {
      setTimeout(() => {
        executeAITurn(nextUnit);
      }, 1000);
    }

    setSelectedCharacter(null);
    setSelectedSkill(null);
    setSelectedCell(null);
    setMoveMode(false);
    setMoveRange([]);
    setAttackRange([]);
  };

  const executeAITurn = (aiUnit) => {
    // AI movement
    if (!aiUnit.moved) {
      const moveOptions = calculateMoveRange(aiUnit.position, 2);
      
      if (moveOptions.length > 0) {
        // Find move that brings AI closer to player units
        let bestMove = moveOptions[0];
        let shortestDistance = 999;
        
        playerTeam.forEach(playerUnit => {
          if (playerUnit.currentHp > 0) {
            moveOptions.forEach(movePos => {
              const distance = Math.abs(movePos.row - playerUnit.position.row) + 
                              Math.abs(movePos.col - playerUnit.position.col);
              if (distance < shortestDistance) {
                shortestDistance = distance;
                bestMove = movePos;
              }
            });
          }
        });
        
        moveCharacter(aiUnit, bestMove.row, bestMove.col);
      }
    }
    
    // AI attack
    setTimeout(() => {
      if (!aiUnit.attacked) {
        // Find closest player unit to attack
        const attackRange = calculateAttackRange(aiUnit.position, 1);
        let targetFound = false;
        
        // Check if any player unit is in attack range
        attackRange.forEach(pos => {
          if (!targetFound && grid[pos.row][pos.col].occupied && 
              grid[pos.row][pos.col].occupied.isPlayer) {
            
            const target = grid[pos.row][pos.col].occupied;
            const damage = Math.floor(aiUnit.atk * (0.8 + Math.random() * 0.4) * (1 - target.def / 300));
            
            // Execute attack
            executeSkill(aiUnit, aiUnit.skills[0], pos.row, pos.col);
            targetFound = true;
          }
        });
        
        // If no target in range, end turn
        if (!targetFound) {
          aiUnit.attacked = true;
          setBattleLog(prev => [...prev, `${aiUnit.name} couldn't find a target.`]);
        }
      }
      
      // Check for boss phase transition
      if (aiUnit.name === 'Studio Massa' && aiUnit.currentHp < aiUnit.maxHp * 0.3 && aiUnit.phase === 1) {
        aiUnit.phase = 2;
        aiUnit.def = Math.floor(aiUnit.def * 0.5);
        setBattleLog(prev => [...prev, 'Studio Massa enters Creative Block phase! Defense reduced!']);
      }
      
      // End AI turn
      setTimeout(() => {
        nextTurn();
      }, 500);
    }, 800);
  };

  const resetBattle = () => {
    setBattleState('setup');
    setPlayerTeam([]);
    setEnemyTeam([]);
    setSelectedCharacter(null);
    setSelectedSkill(null);
    setBattleLog([]);
    setCurrentUnit(0);
    setMoveMode(false);
    setMoveRange([]);
    setAttackRange([]);
    
    initializeGrid();
  };

  const getCellClass = (row, col) => {
    let classes = "grid-cell relative";
    
    // Base cell type
    if (grid[row][col].type === 'desk') {
      classes += " bg-slate-700/50";
    }
    
    // Cell status
    if (grid[row][col].occupied) {
      classes += " occupied";
      if (grid[row][col].occupied.isPlayer) {
        classes += " player-occupied";
      } else {
        classes += " enemy-occupied";
      }
    }
    
    // Selected cell
    if (selectedCell?.row === row && selectedCell?.col === col) {
      classes += " selected";
    }
    
    // Movement range
    if (moveMode && isInMoveRange({row, col})) {
      classes += " move-range";
    }
    
    // Attack range
    if (selectedSkill && isInAttackRange({row, col})) {
      classes += " attack-range";
    }
    
    // Hover highlight
    if (hoverCell?.row === row && hoverCell?.col === col) {
      classes += " hover-cell";
    }
    
    // Hazard
    if (grid[row][col].hazard) {
      classes += " hazard-cell";
    }
    
    return classes;
  };

  const getCharacterDisplay = (character) => {
    if (!character) return null;
    
    return (
      <div className={`character-token ${character.isPlayer ? 'player-token' : 'enemy-token'}`}>
        {character.image ? (
          <img 
            src={character.image} 
            alt={character.name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM0Nzc0OEIiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iMTIiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDE2IDE1SDhBNCA0IDAgMCAwIDQgMTlWMjEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=';
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-xs font-bold">
            {character.name.charAt(0)}
          </div>
        )}
        
        {/* Health bar */}
        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-red-600"
            style={{width: `${(character.currentHp / character.maxHp) * 100}%`}}
          ></div>
        </div>
      </div>
    );
  };

  if (battleState === 'victory') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-32 h-32 mx-auto bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center"
          >
            <SafeIcon icon={FiTarget} className="w-16 h-16 text-white" />
          </motion.div>
          
          <h1 className="text-4xl font-bold text-yellow-400">VICTORY!</h1>
          <p className="text-xl text-gray-300">
            Maya and her sisters have defeated Studio Massa! The series continues!
          </p>
          <p className="text-lg text-green-400">
            Rewards: 500 Credits earned!
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetBattle}
            className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Battle Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (battleState === 'defeat') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <div className="w-32 h-32 mx-auto bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center">
            <SafeIcon icon={FiShield} className="w-16 h-16 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-red-400">DEFEAT</h1>
          <p className="text-xl text-gray-300">
            Studio Massa proved too powerful this time...
          </p>
          <p className="text-lg text-gray-400">
            Train your characters and try again!
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetBattle}
            className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center space-x-3">
            <SafeIcon icon={FiZap} className="w-10 h-10 text-red-400" />
            <span>Combat Arena</span>
          </h1>
          {battleState === 'setup' && (
            <p className="text-gray-300 text-lg">Prepare for the final battle against Studio Massa!</p>
          )}
        </motion.div>

        {battleState === 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <div className="glass-effect p-8 rounded-xl max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Final Boss: Studio Massa</h2>
              <p className="text-gray-300 mb-6 leading-relaxed">
                The creator who axed the series appears as the ultimate challenge. 
                Maya and her sisters must overcome their fears and lead the team to victory to save their world!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Your Team</h3>
                  {state.characters.filter(c => c.owned).slice(0, 3).map(char => (
                    <div key={char.id} className="flex items-center space-x-2 mb-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 ${
                        char.rarity >= 4 ? 'border-purple-500 bg-purple-900/30' : 'border-blue-500 bg-blue-900/30'
                      }`}>
                        {char.level}
                      </div>
                      <span className="text-sm">{char.name} ({char.role})</span>
                    </div>
                  ))}
                </div>
                
                <div className="bg-slate-800/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Boss Info</h3>
                  <div className="text-sm space-y-1">
                    <p>• Multi-phase boss fight</p>
                    <p>• Tactical 5x5 grid</p>
                    <p>• Special abilities per phase</p>
                    <p>• Movement and attack strategy</p>
                  </div>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startBattle}
                disabled={state.player.stamina < 15}
                className="bg-red-600 hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-8 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mx-auto"
              >
                <SafeIcon icon={FiSword} className="w-5 h-5" />
                <span>Start Battle (15 Stamina)</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {battleState === 'combat' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Combat Grid */}
            <div className="lg:col-span-2">
              <div className="glass-effect p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold flex items-center space-x-2">
                    <SafeIcon icon={FiTarget} className="w-6 h-6" />
                    <span>Battle Grid</span>
                  </h3>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">
                      Turn: {turnOrder[currentUnit]?.name || 'Calculating...'}
                    </span>
                    {currentTurn === 'player' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={endTurn}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
                      >
                        <span>End Turn</span>
                        <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </div>
                
                <div className="combat-grid-wrapper">
                  <div className="combat-grid">
                    {grid.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={getCellClass(rowIndex, colIndex)}
                          onClick={() => selectCell(rowIndex, colIndex)}
                          onMouseEnter={() => setHoverCell({row: rowIndex, col: colIndex})}
                          onMouseLeave={() => setHoverCell(null)}
                        >
                          {/* Cell coordinates */}
                          <div className="absolute top-0 left-0 text-[8px] text-gray-500 opacity-50">
                            {rowIndex},{colIndex}
                          </div>
                          
                          {/* Character token */}
                          {cell.occupied && getCharacterDisplay(cell.occupied)}
                          
                          {/* Hazard indicator */}
                          {cell.hazard && (
                            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {currentTurn === 'player' && selectedCharacter && (
                  <div className="mt-4 flex justify-center space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={toggleMoveMode}
                      disabled={selectedCharacter.moved}
                      className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                        moveMode 
                          ? 'bg-green-600 text-white' 
                          : selectedCharacter.moved 
                          ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                          : 'bg-blue-600 hover:bg-blue-500 text-white'
                      }`}
                    >
                      <SafeIcon icon={FiMove} className="w-4 h-4" />
                      <span>{moveMode ? 'Cancel Move' : 'Move'}</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={endTurn}
                      className="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                      <SafeIcon icon={FiArrowRight} className="w-4 h-4" />
                      <span>End Turn</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Battle UI */}
            <div className="space-y-6">
              {/* Player Team */}
              <div className="glass-effect p-4 rounded-xl">
                <h3 className="text-lg font-bold mb-4">Your Team</h3>
                <div className="space-y-3">
                  {playerTeam.map(character => (
                    <div
                      key={character.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedCharacter?.id === character.id
                          ? 'bg-blue-600/30 border border-blue-500'
                          : character.moved && character.attacked 
                          ? 'bg-gray-700/50 opacity-70' 
                          : 'bg-slate-800/50 hover:bg-slate-700/50'
                      } ${turnOrder[currentUnit]?.id === character.id ? 'ring-2 ring-yellow-500' : ''}`}
                      onClick={() => selectCharacter(character)}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={character.image}
                          alt={character.name}
                          className={`w-12 h-12 rounded-full ${character.moved && character.attacked ? 'opacity-50' : ''}`}
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM0Nzc0OEIiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iMTIiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDE2IDE1SDhBNCA0IDAgMCAwIDQgMTlWMjEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                          }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{character.name}</span>
                            <div className="flex items-center space-x-1">
                              {character.moved && (
                                <span className="text-xs bg-gray-600 px-1.5 py-0.5 rounded">
                                  Moved
                                </span>
                              )}
                              {character.attacked && (
                                <span className="text-xs bg-red-600 px-1.5 py-0.5 rounded">
                                  Attacked
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <SafeIcon icon={FiHeart} className="w-4 h-4 text-red-400" />
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                              <div
                                className="hp-bar rounded-full h-2"
                                style={{ width: `${(character.currentHp / character.hp) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs">{character.currentHp}/{character.hp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enemy Team */}
              <div className="glass-effect p-4 rounded-xl">
                <h3 className="text-lg font-bold mb-4">Enemy Team</h3>
                <div className="space-y-3">
                  {enemyTeam.map((enemy) => (
                    <div key={enemy.id} className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center space-x-3">
                        {enemy.image ? (
                          <img
                            src={enemy.image}
                            alt={enemy.name}
                            className="w-12 h-12 rounded-full"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM3ODM0MzQiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iMTIiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDE2IDE1SDhBNCA0IDAgMCAwIDQgMTlWMjEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                            }}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-red-900/30 border-2 border-red-500 flex items-center justify-center text-sm">
                            {enemy.name.charAt(0)}
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{enemy.name}</span>
                            {enemy.name === 'Studio Massa' && (
                              <span className="text-xs bg-red-600 px-1.5 py-0.5 rounded">
                                Phase {enemy.phase}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <SafeIcon icon={FiHeart} className="w-4 h-4 text-red-400" />
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-red-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(enemy.currentHp / enemy.maxHp) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs">{enemy.currentHp}/{enemy.maxHp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              {selectedCharacter && (
                <div className="glass-effect p-4 rounded-xl">
                  <h3 className="text-lg font-bold mb-4">Skills</h3>
                  <div className="space-y-2">
                    {selectedCharacter.skills.map((skill, index) => (
                      <button
                        key={index}
                        onClick={() => selectSkill(skill)}
                        disabled={skill.currentCooldown > 0 || selectedCharacter.attacked}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          selectedSkill === skill
                            ? 'skill-button'
                            : skill.currentCooldown > 0 || selectedCharacter.attacked
                            ? 'bg-gray-700 cursor-not-allowed opacity-50'
                            : 'bg-slate-800 hover:bg-slate-700'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{skill.name}</span>
                          {skill.currentCooldown > 0 && (
                            <span className="text-xs bg-red-600 px-2 py-1 rounded">
                              CD: {skill.currentCooldown}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{skill.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Battle Log */}
              <div className="glass-effect p-4 rounded-xl">
                <h3 className="text-lg font-bold mb-4">Battle Log</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto px-2">
                  {battleLog.map((log, index) => (
                    <p key={index} className={`text-sm ${log.startsWith('---') ? 'text-yellow-400 font-medium' : 'text-gray-300'}`}>
                      {log}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Combat;
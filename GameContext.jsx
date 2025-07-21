import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

const initialState = {
  player: {
    level: 1,
    exp: 0,
    gems: 1500,
    credits: 5000,
    stamina: 100,
    maxStamina: 100
  },
  characters: [
    {
      id: 'maya',
      name: 'Maya',
      role: 'Support',
      rarity: 3,
      level: 1,
      hp: 600,
      maxHp: 600,
      atk: 120,
      def: 80,
      spd: 6,
      bondLevel: 1,
      image: 'https://static.wikia.nocookie.net/ongezellig/images/f/fa/Mayahome.png',
      skills: [
        { name: 'Inspiration', cooldown: 3, currentCooldown: 0, description: '+10% team ATK for 3 turns' }
      ],
      owned: true,
      relation: 'Oldest sister'
    },
    {
      id: 'coco',
      name: 'Coco',
      role: 'Attacker',
      rarity: 4,
      level: 1,
      hp: 750,
      maxHp: 750,
      atk: 180,
      def: 60,
      spd: 8,
      bondLevel: 1,
      image: 'https://static.wikia.nocookie.net/ongezellig/images/7/79/Cocohome.png',
      skills: [
        { name: 'Power Strike', cooldown: 4, currentCooldown: 0, description: '150% ATK damage to area' }
      ],
      owned: true,
      relation: 'Middle sister'
    },
    {
      id: 'mymy',
      name: 'Mymy',
      role: 'Tank',
      rarity: 5,
      level: 1,
      hp: 900,
      maxHp: 900,
      atk: 100,
      def: 120,
      spd: 4,
      bondLevel: 1,
      image: 'https://static.wikia.nocookie.net/ongezellig/images/4/42/Mymyhome.png',
      skills: [
        { name: 'Historical Defense', cooldown: 5, currentCooldown: 0, description: '+20% DEF for 4 turns' }
      ],
      owned: true,
      relation: 'Youngest sister'
    },
    {
      id: 'vera',
      name: 'Vera Persijn',
      role: 'Support',
      rarity: 4,
      level: 1,
      hp: 550,
      maxHp: 550,
      atk: 110,
      def: 70,
      spd: 7,
      bondLevel: 1,
      image: 'https://static.wikia.nocookie.net/ongezellig/images/1/1c/Verahome.png',
      skills: [
        { name: 'Guidance', cooldown: 4, currentCooldown: 0, description: 'Reduce team cooldowns by 1' }
      ],
      owned: true,
      relation: 'Teacher'
    },
    {
      id: 'kiki',
      name: 'Kiki',
      role: 'Attacker',
      rarity: 4,
      level: 1,
      hp: 680,
      maxHp: 680,
      atk: 200,
      def: 50,
      spd: 9,
      bondLevel: 1,
      image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiM4QjVDRjYiLz4KPHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIzMiIgeT0iMzIiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDE2IDE1SDhBNCA0IDAgMCAwIDQgMTlWMjEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=',
      skills: [
        { name: "Pirate's Cutlass", cooldown: 3, currentCooldown: 0, description: '200% ATK single target damage' }
      ],
      owned: false,
      relation: 'Friend, Pirate enthusiast'
    }
  ],
  currentTeam: ['maya', 'coco', 'mymy'],
  story: {
    currentChapter: 1,
    completedChapters: [],
    currentScene: 0
  },
  combat: {
    inCombat: false,
    currentBattle: null,
    playerTurn: true
  },
  gacha: {
    pityCounter: 0,
    lastPull: null
  }
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SPEND_GEMS':
      return {
        ...state,
        player: {
          ...state.player,
          gems: Math.max(0, state.player.gems - action.amount)
        }
      };
    
    case 'SPEND_CREDITS':
      return {
        ...state,
        player: {
          ...state.player,
          credits: Math.max(0, state.player.credits - action.amount)
        }
      };
    
    case 'ADD_CHARACTER':
      return {
        ...state,
        characters: state.characters.map(char =>
          char.id === action.character.id
            ? { ...char, owned: true }
            : char
        )
      };
    
    case 'UPDATE_STORY':
      return {
        ...state,
        story: {
          ...state.story,
          ...action.updates
        }
      };
    
    case 'START_COMBAT':
      return {
        ...state,
        combat: {
          ...state.combat,
          inCombat: true,
          currentBattle: action.battle
        }
      };
    
    case 'END_COMBAT':
      return {
        ...state,
        combat: {
          ...state.combat,
          inCombat: false,
          currentBattle: null
        }
      };
    
    case 'USE_STAMINA':
      return {
        ...state,
        player: {
          ...state.player,
          stamina: Math.max(0, state.player.stamina - action.amount)
        }
      };
    
    case 'RESTORE_STAMINA':
      return {
        ...state,
        player: {
          ...state.player,
          stamina: Math.min(state.player.maxStamina, state.player.stamina + action.amount)
        }
      };
    
    case 'GACHA_PULL':
      return {
        ...state,
        gacha: {
          ...state.gacha,
          pityCounter: action.result.rarity >= 4 ? 0 : state.gacha.pityCounter + 1,
          lastPull: action.result
        }
      };
    
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Auto-restore stamina
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({
        type: 'RESTORE_STAMINA',
        amount: 1
      });
    }, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useGame } from '../context/GameContext';

const { FiBook, FiPlay, FiLock, FiStar, FiArrowRight, FiCheck, FiX } = FiIcons;

const Story = () => {
  const { state, dispatch } = useGame();
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [showStoryScene, setShowStoryScene] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState(0);
  const [showCombatChoice, setShowCombatChoice] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [combatResult, setCombatResult] = useState(null);
  const [showCombatResult, setShowCombatResult] = useState(false);
  
  const chapters = [
    {
      id: 1,
      title: "A Reluctant Step Forward",
      description: "Maya struggles with her first day at Het Amsterdams Lyceum and faces a group project challenge.",
      unlocked: true,
      scenes: [
        // Scene 1: Maya's Room
        {
          background: "A dimly lit room with anime posters on the walls, a cluttered desk with manga and snacks, and a computer glowing faintly in the dark.",
          character: "Narrator",
          text: "Maya sits hunched over her desk, the faint hum of her computer filling the room. Her eyes are locked on the screen, where an over-the-top anime plays out a dramatic confession scene.",
          image: null
        },
        {
          character: "Anime Girl",
          text: "\"Senpai, itsumo anata o aishite kita!\" (\"Senpai, I've always loved you!\")",
          image: null
        },
        {
          character: "Maya",
          text: "(whispering to herself, entranced) \"This is it… the best part…\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/f/fa/Mayahome.png"
        },
        {
          character: "Narrator",
          text: "The door bursts open with a loud creak.",
          image: null
        },
        {
          character: "Coco",
          text: "\"Hoi Maya! What are you doing?\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/7/79/Cocohome.png"
        },
        {
          character: "Narrator",
          text: "Maya jolts, quickly minimizing the anime window. Her desktop now shows the default Windows XP hills.",
          image: null
        },
        {
          character: "Maya",
          text: "(panicky) \"NOTHING! I was just, uh… appreciating landscape art.\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/f/fa/Mayahome.png"
        },
        {
          character: "Coco",
          text: "(enthusiastic) \"Oh, that's wonderful! I love Pierneef's geometric landscapes. Who's your favorite painter?\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/7/79/Cocohome.png"
        },
        {
          character: "Maya",
          text: "(stammering) \"Uh… uh… Hitler?\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/f/fa/Mayahome.png"
        },
        {
          character: "Coco",
          text: "(uncomfortable) \"…Hmmm, uhm… Anyway! There's a school assembly today. It's important!\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/7/79/Cocohome.png"
        },
        {
          character: "Maya",
          text: "(groaning) \"Do I have to go? Can't I just stay here?\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/f/fa/Mayahome.png"
        },
        {
          character: "Coco",
          text: "\"Come on, Maya. Mymy's already waiting downstairs. It'll be fine!\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/7/79/Cocohome.png"
        },
        {
          character: "Narrator",
          text: "Maya sighs, her shoulders slumping. She grabs her red hoodie and reluctantly follows Coco out, the sound of the anime lingering faintly in her mind.",
          image: null
        },
        
        // Scene 2: School Assembly
        {
          background: "A bustling assembly hall filled with students. The principal stands at a podium at the front.",
          character: "Narrator",
          text: "The hall buzzes with chatter as Maya, Coco, and Mymy take seats near the back. Maya fidgets, her hands twisting the drawstrings of her hoodie, while Coco beams at the crowd and Mymy sits with an air of smug confidence.",
          image: null
        },
        {
          character: "Principal",
          text: "\"Good morning, students! Today, we're announcing the Class Representative election. Each class will choose a leader for school activities and competitions.\"",
          image: null
        },
        {
          character: "Narrator",
          text: "Maya sinks lower in her seat, eyes wide with dread.",
          image: null
        },
        {
          character: "Mymy",
          text: "(whispering to Coco, smug) \"This is my moment. I'll be class representative and rule them all.\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/4/42/Mymyhome.png"
        },
        {
          character: "Coco",
          text: "(excited) \"That's great, Mymy! What about you, Maya? Want to run?\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/7/79/Cocohome.png"
        },
        {
          character: "Maya",
          text: "(shaking her head) \"No way. Too many people staring at me.\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/f/fa/Mayahome.png"
        },
        {
          character: "Mymy",
          text: "(scoffing) \"Don't be pathetic, Maya. You could at least try to be useful.\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/4/42/Mymyhome.png"
        },
        {
          character: "Narrator",
          text: "Maya glares at Mymy but says nothing, her mind drifting back to her room as the principal drones on about responsibilities.",
          image: null
        },
        
        // Scene 3: History Class
        {
          background: "A cluttered classroom with maps on the walls—one of Japan behind Mymy, one of South Africa behind Coco, and one of Indonesia overlaying Europe behind Maya.",
          character: "Narrator",
          text: "Vera Persijn slumps at the teacher's desk, a Nirvana mug in hand and a bottle of Jip & Janneke Bubbelsap nearby.",
          image: null
        },
        {
          character: "Vera",
          text: "(bored) \"Alright, settle down. Today's the Dutch Golden Age. Let's get this over with.\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/1/1c/Verahome.png"
        },
        {
          character: "Mymy",
          text: "\"Finally, something worth my time.\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/4/42/Mymyhome.png"
        },
        {
          character: "Vera",
          text: "\"Yes, Mymy, we know you're obsessed. Spare us.\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/1/1c/Verahome.png"
        },
        {
          character: "Narrator",
          text: "Maya doodles in her notebook, her mind wandering. Suddenly, Vera's voice cuts through her haze.",
          image: null
        },
        {
          character: "Vera",
          text: "\"Maya, what year was the Dutch East India Company founded?\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/1/1c/Verahome.png"
        },
        {
          character: "Narrator",
          text: "Maya freezes, her pencil trembling.",
          image: null
        },
        {
          character: "Maya",
          text: "(stammering) \"Uh… 1602?\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/f/fa/Mayahome.png"
        },
        {
          character: "Vera",
          text: "(nodding curtly) \"Correct. Try staying awake next time.\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/1/1c/Verahome.png"
        },
        {
          character: "Narrator",
          text: "Coco flashes Maya a thumbs-up from across the room. Maya exhales shakily, relieved to escape further scrutiny—for now.",
          image: null
        },
        
        // Scene 4: Lunchtime
        {
          background: "A noisy cafeteria with students chatting at tables.",
          character: "Narrator",
          text: "Maya sits alone, picking at her food. Coco chats with friends nearby, glancing at Maya with concern. Mymy holds court with her own group, bragging loudly.",
          image: null
        },
        {
          character: "Mymy",
          text: "(boasting) \"Once I'm class representative, this school will bow to my brilliance!\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/4/42/Mymyhome.png"
        },
        {
          character: "Narrator",
          text: "Coco excuses herself and approaches Maya's table.",
          image: null
        },
        {
          character: "Coco",
          text: "\"Hoi, Maya. Can I sit with you?\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/7/79/Cocohome.png"
        },
        {
          character: "Maya",
          text: "(surprised) \"Uh, sure… but don't you want to be with your friends?\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/f/fa/Mayahome.png"
        },
        {
          character: "Coco",
          text: "\"They're fine. I'd rather check on you. We're sisters, ja?\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/7/79/Cocohome.png"
        },
        {
          character: "Narrator",
          text: "Maya offers a faint smile, but it fades as a passing student sneers.",
          image: null
        },
        {
          character: "Student",
          text: "\"Look at Maya, always alone. No wonder she's friendless.\"",
          image: null
        },
        {
          character: "Narrator",
          text: "Maya's face falls, her hands clenching her tray.",
          image: null
        },
        {
          character: "Coco",
          text: "(firmly) \"Ignore them, Maya. They're just mean.\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/7/79/Cocohome.png"
        },
        {
          character: "Narrator",
          text: "The words sting, but Coco's kindness softens the blow—barely.",
          image: null
        },
        
        // Scene 5: After School - The Assignment
        {
          background: "The school courtyard, students trickling out as the day ends.",
          character: "Narrator",
          text: "Vera stops Maya as she tries to leave, her expression stern.",
          image: null
        },
        {
          character: "Vera",
          text: "\"Maya, a word.\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/1/1c/Verahome.png"
        },
        {
          character: "Maya",
          text: "(nervous) \"Y-yes, Ms. Persijn?\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/f/fa/Mayahome.png"
        },
        {
          character: "Vera",
          text: "\"Your participation's abysmal. I'm assigning you to lead a group project on the Dutch Golden Age. With Coco and Mymy.\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/1/1c/Verahome.png"
        },
        {
          character: "Narrator",
          text: "Maya's eyes widen in horror.",
          image: null
        },
        {
          character: "Maya",
          text: "(panicked) \"A group project? Me? Lead? I can't—\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/f/fa/Mayahome.png"
        },
        {
          character: "Vera",
          text: "(cutting her off) \"You can. You will. Don't make me regret this.\"",
          image: "https://static.wikia.nocookie.net/ongezellig/images/1/1c/Verahome.png"
        },
        {
          character: "Narrator",
          text: "Vera walks off, leaving Maya trembling. Maya's world spins. Leading a group? With Mymy? This is her nightmare made real.",
          image: null,
          isCombatTrigger: true
        }
      ],
      combatChoices: [
        {
          prompt: "How will you delegate the tasks?",
          options: [
            {
              text: "Coco, you research art. Mymy, you handle trade. I'll do the slides.",
              outcome: {
                morale: 10,
                progress: 5,
                stress: -5,
                confidence: 3
              },
              resultText: "Coco cheerfully digs into art history, Mymy rants about Dutch trade superiority, and Maya fumbles with PowerPoint, her hands shaking."
            },
            {
              text: "Mymy, take charge of everything. I'll just watch.",
              outcome: {
                morale: -5,
                progress: 10,
                stress: 0,
                confidence: -5
              },
              resultText: "Mymy overworks herself taking charge, Coco feels useless sitting idle, and Maya's anxiety spikes watching from the sidelines."
            },
            {
              text: "I'll do it all myself. You two just… stay out of it.",
              outcome: {
                morale: 0,
                progress: -5,
                stress: -10,
                confidence: 5
              },
              resultText: "Maya burns herself out handling everything, Coco and Mymy slack off completely, but Maya gains a slight boost in confidence from the autonomy."
            }
          ]
        }
      ],
      combatResults: {
        victory: {
          text: "The presentation is decent, and Maya survives with a small confidence boost. Despite her anxiety, she's taken the first step forward.",
          dialogues: [
            {
              character: "Coco",
              text: "(smiling) \"We did okay, ja? You're tougher than you think, Maya.\"",
              image: "https://static.wikia.nocookie.net/ongezellig/images/7/79/Cocohome.png"
            },
            {
              character: "Mymy",
              text: "(smirking) \"Don't get cocky. I carried this team.\"",
              image: "https://static.wikia.nocookie.net/ongezellig/images/4/42/Mymyhome.png"
            },
            {
              character: "Maya",
              text: "(to herself) \"…Maybe I can do this. Maybe.\"",
              image: "https://static.wikia.nocookie.net/ongezellig/images/f/fa/Mayahome.png"
            }
          ]
        },
        defeat: {
          text: "The presentation flops, and Maya retreats further into herself, her confidence shattered by the experience.",
          dialogues: [
            {
              character: "Coco",
              text: "(sympathetic) \"It's okay, Maya. We'll do better next time.\"",
              image: "https://static.wikia.nocookie.net/ongezellig/images/7/79/Cocohome.png"
            },
            {
              character: "Mymy",
              text: "(annoyed) \"This is what happens when you don't listen to me.\"",
              image: "https://static.wikia.nocookie.net/ongezellig/images/4/42/Mymyhome.png"
            },
            {
              character: "Maya",
              text: "(defeated) \"I knew I couldn't do this...\"",
              image: "https://static.wikia.nocookie.net/ongezellig/images/f/fa/Mayahome.png"
            }
          ]
        }
      },
      reward: {
        credits: 200,
        exp: 100
      }
    },
    {
      id: 2,
      title: "Making Friends",
      description: "Maya meets her new classmates and begins to open up",
      unlocked: state.story.completedChapters.includes(1),
      scenes: [
        {
          character: "Maya",
          text: "Maybe... maybe I can actually make friends here.",
          image: "https://static.wikia.nocookie.net/ongezellig/images/f/fa/Mayahome.png"
        }
      ],
      reward: {
        credits: 250,
        exp: 150
      }
    },
    {
      id: 3,
      title: "First Challenge",
      description: "The academy announces its first competition",
      unlocked: state.story.completedChapters.includes(2),
      scenes: [],
      reward: {
        credits: 300,
        exp: 200
      }
    }
  ];

  const storyDialogues = selectedChapter ? chapters.find(c => c.id === selectedChapter)?.scenes || [] : [];
  
  const startChapter = (chapterId) => {
    if (state.player.stamina < 10) {
      alert("Not enough stamina! Wait for it to restore or use gems to refill.");
      return;
    }
    
    setSelectedChapter(chapterId);
    setShowStoryScene(true);
    setCurrentDialogue(0);
    setShowCombatChoice(false);
    setSelectedChoice(null);
    setShowCombatResult(false);
    setCombatResult(null);
    
    dispatch({ type: 'USE_STAMINA', amount: 10 });
  };

  const nextDialogue = () => {
    if (currentDialogue < storyDialogues.length - 1) {
      const nextIndex = currentDialogue + 1;
      setCurrentDialogue(nextIndex);
      
      // Check if the next dialogue is the combat trigger
      if (storyDialogues[nextIndex].isCombatTrigger) {
        setShowCombatChoice(true);
      }
    } else {
      // If we've reached the end and have combat result, show it
      if (combatResult) {
        setShowCombatResult(true);
      } else {
        completeChapter();
      }
    }
  };
  
  const handleCombatChoice = (choice) => {
    setSelectedChoice(choice);
    
    // Determine if victory or defeat based on choice outcomes
    const outcome = choice.outcome;
    const totalScore = outcome.morale + outcome.progress + outcome.stress + outcome.confidence;
    
    // Victory if total score is positive
    const result = totalScore > 0 ? 'victory' : 'defeat';
    setCombatResult({
      result,
      outcomeText: choice.resultText,
      ...chapters.find(c => c.id === selectedChapter).combatResults[result]
    });
    
    setShowCombatChoice(false);
    nextDialogue();
  };
  
  const finishCombatResult = () => {
    setShowCombatResult(false);
    completeChapter();
  };

  const completeChapter = () => {
    const chapter = chapters.find(c => c.id === selectedChapter);
    
    dispatch({ type: 'SPEND_CREDITS', amount: -chapter.reward.credits });
    dispatch({
      type: 'UPDATE_STORY',
      updates: {
        completedChapters: [...state.story.completedChapters, selectedChapter],
        currentChapter: selectedChapter + 1
      }
    });
    
    setShowStoryScene(false);
    setSelectedChapter(null);
    setCurrentDialogue(0);
  };

  // Combat choice screen
  if (showStoryScene && showCombatChoice) {
    const combatChoiceData = chapters.find(c => c.id === selectedChapter).combatChoices[0];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full"
        >
          <div className="glass-effect p-8 rounded-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">Combat Mission: History Project Prep Battle</h2>
            
            <div className="bg-slate-800/50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-bold mb-2">Your Team Stats</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium mb-1">Maya</h4>
                  <p>• High Knowledge</p>
                  <p>• Low Charisma</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium mb-1">Coco</h4>
                  <p>• High Support</p>
                  <p>• Low Tech</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <h4 className="font-medium mb-1">Mymy</h4>
                  <p>• High Ambition</p>
                  <p>• Low Cooperation</p>
                </div>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-4">{combatChoiceData.prompt}</h3>
            
            <div className="space-y-4">
              {combatChoiceData.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCombatChoice(option)}
                  className="w-full text-left glass-effect bg-slate-800/50 hover:bg-slate-700/70 p-4 rounded-lg transition-all"
                >
                  {option.text}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Combat result screen
  if (showStoryScene && showCombatResult && combatResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full"
        >
          <div className="glass-effect p-8 rounded-2xl">
            <div className="flex items-center justify-center mb-6">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
                combatResult.result === 'victory' ? 'bg-green-600' : 'bg-red-600'
              }`}>
                <SafeIcon 
                  icon={combatResult.result === 'victory' ? FiCheck : FiX} 
                  className="w-10 h-10 text-white"
                />
              </div>
            </div>
            
            <h2 className={`text-2xl font-bold text-center mb-4 ${
              combatResult.result === 'victory' ? 'text-green-400' : 'text-red-400'
            }`}>
              {combatResult.result === 'victory' ? 'Victory!' : 'Defeat...'}
            </h2>
            
            <p className="text-white text-center mb-8">{combatResult.outcomeText}</p>
            <p className="text-gray-300 text-center mb-8">{combatResult.text}</p>
            
            <div className="space-y-4 mb-8">
              {combatResult.dialogues.map((dialogue, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-lg">
                  <img 
                    src={dialogue.image} 
                    alt={dialogue.character} 
                    className="w-12 h-12 rounded-full"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMjQiIGZpbGw9IiM0Nzc0OEIiLz4KPHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIxMiIgeT0iMTIiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDE2IDE1SDhBNCA0IDAgMCAwIDQgMTlWMjEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo='
                    }}
                  />
                  <div>
                    <p className="font-bold">{dialogue.character}</p>
                    <p className="text-gray-300">{dialogue.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <p className="text-lg text-yellow-400 font-medium">Rewards</p>
                <p className="text-gray-300">Credits: {chapters.find(c => c.id === selectedChapter).reward.credits}</p>
                <p className="text-gray-300">Experience: {chapters.find(c => c.id === selectedChapter).reward.exp}</p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={finishCombatResult}
                className="bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Complete Chapter
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Story dialogue screen
  if (showStoryScene && storyDialogues.length > 0) {
    const currentScene = storyDialogues[currentDialogue];
    const hasBackground = currentScene.background !== undefined;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full"
        >
          {/* Background description */}
          {hasBackground && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-effect p-4 rounded-xl mb-4 text-sm text-gray-300"
            >
              <p>{currentScene.background}</p>
            </motion.div>
          )}
          
          {/* Character Portrait */}
          {currentScene.image && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <img
                src={currentScene.image}
                alt={currentScene.character}
                className="w-32 h-32 mx-auto rounded-full border-4 border-white shadow-2xl"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiByeD0iNjQiIGZpbGw9IiM0Nzc0OEIiLz4KPHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4PSIzMiIgeT0iMzIiPgo8cGF0aCBkPSJNMjAgMjFWMTlBNCA0IDAgMCAwIDE2IDE1SDhBNCA0IDAgMCAwIDQgMTlWMjEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cjwvc3ZnPgo=';
                }}
              />
              <h3 className="text-2xl font-bold text-white mt-4">{currentScene.character}</h3>
            </motion.div>
          )}

          {/* Dialogue Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-effect p-8 rounded-2xl"
          >
            {!currentScene.image && (
              <h3 className="text-xl font-bold text-white mb-4">{currentScene.character}</h3>
            )}
            
            <p className="story-text text-lg leading-relaxed text-white mb-6">
              {currentScene.text}
            </p>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                {currentDialogue + 1} / {storyDialogues.length}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextDialogue}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <span>Continue</span>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

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
            <SafeIcon icon={FiBook} className="w-10 h-10 text-blue-400" />
            <span>Story Mode</span>
          </h1>
          <p className="text-gray-300 text-lg">Follow Maya's journey through Het Amsterdams Lyceum</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect p-6 rounded-xl mb-8"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Story Progress</span>
            <span className="text-sm text-gray-400">
              Chapter {state.story.currentChapter} / {chapters.length}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${(state.story.completedChapters.length / chapters.length) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`glass-effect p-6 rounded-xl transition-all duration-300 ${
                chapter.unlocked ? 'hover:bg-slate-800/50 cursor-pointer' : 'opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      state.story.completedChapters.includes(chapter.id)
                        ? 'bg-green-600'
                        : chapter.unlocked
                        ? 'bg-blue-600'
                        : 'bg-gray-600'
                    }`}
                  >
                    {state.story.completedChapters.includes(chapter.id) ? (
                      <SafeIcon icon={FiStar} className="w-4 h-4" />
                    ) : chapter.unlocked ? (
                      chapter.id
                    ) : (
                      <SafeIcon icon={FiLock} className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm text-gray-400">Chapter {chapter.id}</span>
                </div>
                
                {chapter.unlocked && !state.story.completedChapters.includes(chapter.id) && (
                  <div className="text-xs bg-red-600 px-2 py-1 rounded">
                    10 Stamina
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-2">{chapter.title}</h3>
              
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                {chapter.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Rewards: {chapter.reward.credits} Credits, {chapter.reward.exp} EXP
                </div>
                
                {chapter.unlocked && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startChapter(chapter.id)}
                    disabled={state.story.completedChapters.includes(chapter.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      state.story.completedChapters.includes(chapter.id)
                        ? 'bg-green-600 text-white cursor-default'
                        : 'bg-blue-600 hover:bg-blue-500 text-white'
                    }`}
                  >
                    <SafeIcon
                      icon={state.story.completedChapters.includes(chapter.id) ? FiStar : FiPlay}
                      className="w-4 h-4"
                    />
                    <span>
                      {state.story.completedChapters.includes(chapter.id) ? 'Completed' : 'Start'}
                    </span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Maya's Journey Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="glass-effect p-6 rounded-xl mt-8"
        >
          <h3 className="text-xl font-bold mb-4">Maya's Journey</h3>
          <p className="text-gray-300 leading-relaxed">
            Follow Maya as she overcomes her social anxiety and grows into a confident leader. 
            Together with her sisters Coco and Mymy, and with help from their teacher Vera Persijn, 
            Maya will navigate the challenges of Het Amsterdams Lyceum. The story culminates in an 
            epic confrontation with Studio Massa, the creator who threatens to end their world. 
            Through friendship, determination, and tactical battles, Maya will prove that their 
            stories deserve to continue.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Story;
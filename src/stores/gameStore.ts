import { create } from 'zustand';
import { Room, Player, Card, Threat, RoomSettings, ScoutingLocation, GameEventType, GENIE_WISHES, SCOUTING_LOCATIONS, RANDOM_EVENTS } from '../types';
import { getRandomCards, allCards } from '../data/cards';

interface GameState {
  room: Room | null;
  playerId: string | null;
  isHost: boolean;
  
  currentView: 'home' | 'create' | 'join' | 'lobby' | 'game' | 'scouting' | 'results';
  showCardModal: Card | null;
  showThreatModal: Threat | null;
  showVotingModal: boolean;
  showScoutingModal: boolean;
  showEventModal: GameEventType | null;
  showManiacModal: boolean;
  showGenieModal: boolean;
  showKillModal: boolean;
  
  // Scouting state
  currentScoutLocation: ScoutingLocation | null;
  scoutItems: string[];
  
  // Actions
  createRoom: (settings: Partial<RoomSettings>) => void;
  joinRoom: (code: string, playerName: string) => void;
  leaveRoom: () => void;
  startGame: () => void;
  revealCard: (cardId: string) => void;
  addThreat: () => void;
  resolveThreat: (item: string) => void;
  eliminatePlayer: (playerId: string, reason?: string) => void;
  returnPlayer: (playerId: string) => void;
  vote: (playerId: string) => void;
  nextTurn: () => void;
  
  // Scouting
  startScouting: () => void;
  selectLocation: (location: ScoutingLocation) => void;
  toggleScoutItem: (item: string) => void;
  completeScout: () => void;
  cancelScout: () => void;
  
  // Events
  triggerRandomEvent: () => void;
  handleGenieWish: (wish: string) => void;
  
  // Maniac
  killPlayer: (playerId: string) => void;
  activateManiac: () => void;
  
  // Scoring
  addScore: (playerId: string, points: number, action: string) => void;
  calculateResults: () => void;
}

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

const generatePlayerId = () => 'p' + Math.random().toString(36).substr(2, 9);

const defaultSettings: RoomSettings = {
  playerCount: 6,
  cardsPerPlayer: 8,
  survivalDays: 5,
  gameMode: 'classic',
  timerEnabled: true,
  timerDuration: 60,
  heartsCount: 3,
  showDescriptions: false,
  scoutEnabled: true,
  eventsEnabled: true,
  forcedVotingEnabled: true,
  maniacEnabled: true,
  genieChance: 10,
  eventFrequency: 'random',
  eventIntensity: 'medium',
};

export const useGameStore = create<GameState>((set, get) => ({
  room: null,
  playerId: null,
  isHost: false,
  
  currentView: 'home',
  showCardModal: null,
  showThreatModal: null,
  showVotingModal: false,
  showScoutingModal: false,
  showEventModal: null,
  showManiacModal: false,
  showGenieModal: false,
  showKillModal: false,
  
  currentScoutLocation: null,
  scoutItems: [],
  
  createRoom: (settings) => {
    const playerId = generatePlayerId();
    const roomCode = generateRoomCode();
    
    const hostPlayer: Player = {
      id: playerId,
      name: 'Хост',
      isHost: true,
      isOnline: true,
      hearts: defaultSettings.heartsCount,
      cards: [],
      revealedCards: [],
      eliminated: false,
      items: [],
      score: 0,
      actions: [],
    };
    
    const room: Room = {
      code: roomCode,
      hostId: playerId,
      players: [hostPlayer],
      phase: 'lobby',
      currentDay: 1,
      currentPlayerIndex: 0,
      currentThreat: null,
      currentEvent: null,
      settings: { ...defaultSettings, ...settings },
      events: [],
      scoutingMission: null,
    };
    
    set({ room, playerId, isHost: true, currentView: 'lobby' });
  },
  
  joinRoom: (code, playerName) => {
    const playerId = generatePlayerId();
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      isHost: false,
      isOnline: true,
      hearts: 3,
      cards: [],
      revealedCards: [],
      eliminated: false,
      items: [],
      score: 0,
      actions: [],
    };
    
    set((state) => ({
      playerId,
      isHost: false,
      currentView: 'lobby',
      room: state.room ? { ...state.room, players: [...state.room.players, newPlayer] } : null,
    }));
  },
  
  leaveRoom: () => {
    set({ room: null, playerId: null, isHost: false, currentView: 'home' });
  },
  
  startGame: () => {
    const { room, playerId } = get();
    if (!room || !playerId) return;
    
    const categories = ['profession', 'bio', 'health', 'hobby', 'phobia', 'info', 'knowledge', 'bagage'];
    
    const playersWithCards = room.players.map(player => {
      const cards = getRandomCards(room.settings.cardsPerPlayer, categories);
      return { ...player, cards, revealedCards: [], score: 0, actions: [] };
    });
    
    const threats = allCards.filter(c => c.category === 'threat');
    const randomThreat = threats[Math.floor(Math.random() * threats.length)];
    
    // Activate maniac in madness mode
    let players = playersWithCards;
    if (room.settings.maniacEnabled && room.settings.gameMode === 'madness') {
      const nonHost = players.filter(p => !p.isHost);
      if (nonHost.length > 0) {
        const maniacIndex = Math.floor(Math.random() * nonHost.length);
        players = players.map((p, i) => 
          p.id === nonHost[maniacIndex].id ? { ...p, isManiac: true } : p
        );
      }
    }
    
    set({
      room: { ...room, players, phase: 'reveal', currentThreat: randomThreat as Threat },
      currentView: 'game',
    });
    
    // Trigger initial event if enabled
    if (room.settings.eventsEnabled) {
      setTimeout(() => get().triggerRandomEvent(), 2000);
    }
  },
  
  revealCard: (cardId) => {
    const { room, playerId, addScore } = get();
    if (!room || !playerId) return;
    
    const players = room.players.map(p => {
      if (p.id === playerId && !p.eliminated) {
        const newRevealed = [...p.revealedCards, cardId];
        return { ...p, revealedCards: newRevealed };
      }
      return p;
    });
    
    addScore(playerId, 5, 'Вскрыл карту');
    set({ room: { ...room, players } });
  },
  
  addThreat: () => {
    const { room } = get();
    if (!room) return;
    
    const threats = allCards.filter(c => c.category === 'threat');
    const randomThreat = threats[Math.floor(Math.random() * threats.length)];
    
    set({ room: { ...room, currentThreat: randomThreat as Threat }, showThreatModal: randomThreat as Threat });
  },
  
  resolveThreat: (item) => {
    const { room, playerId, addScore } = get();
    if (!room || !room.currentThreat || !playerId) return;
    
    const threat = room.currentThreat;
    const correctItems = threat.requiredItems || [];
    
    if (correctItems.includes(item)) {
      addScore(playerId, 20, 'Решил угрозу');
      set({ room: { ...room, currentThreat: null, phase: 'reveal' }, showThreatModal: null });
    } else {
      const players = room.players.map(p => {
        if (p.id === playerId) {
          return { ...p, hearts: Math.max(0, p.hearts - 1), score: p.score - 10 };
        }
        return p;
      });
      
      addScore(playerId, -10, 'Неверный предмет');
      set({ room: { ...room, players, phase: 'voting' }, showVotingModal: true });
    }
  },
  
  eliminatePlayer: (playerId, reason = 'Изгнан') => {
    const { room, addScore } = get();
    if (!room) return;
    
    const players = room.players.map(p => {
      if (p.id === playerId) {
        addScore(playerId, -30, reason);
        return { ...p, eliminated: true, hearts: 0 };
      }
      return p;
    });
    
    // Check condition cards
    const eliminated = room.players.find(p => p.id === playerId);
    if (eliminated?.cards.some(c => c.category === 'condition' && c.name === 'Камикадзе')) {
      // Kamikaze - kill another random player
      const alive = players.filter(p => !p.eliminated && p.id !== playerId);
      if (alive.length > 0) {
        const victim = alive[Math.floor(Math.random() * alive.length)];
        setTimeout(() => get().eliminatePlayer(victim.id, 'Погиб с камикадзе'), 1000);
      }
    }
    
    set({ room: { ...room, players }, showVotingModal: false });
  },
  
  returnPlayer: (playerId) => {
    const { room } = get();
    if (!room) return;
    
    const players = room.players.map(p => {
      if (p.id === playerId) {
        return { ...p, eliminated: false, hearts: room.settings.heartsCount };
      }
      return p;
    });
    
    set({ room: { ...room, players } });
  },
  
  vote: (playerId) => {
    const { room, playerId: myId, addScore } = get();
    if (!room) return;
    
    // Add score for voting
    if (myId) {
      addScore(myId, 5, 'Проголосовал');
    }
    
    get().eliminatePlayer(playerId, 'Изгнан голосованием');
  },
  
  nextTurn: () => {
    const { room, addScore } = get();
    if (!room) return;
    
    const alive = room.players.filter(p => !p.eliminated);
    if (alive.length <= 1) {
      get().calculateResults();
      return;
    }
    
    const nextIndex = (room.currentPlayerIndex + 1) % alive.length;
    const nextPlayer = alive[nextIndex];
    
    // Check for maniac kill phase
    const currentPlayer = room.players[room.currentPlayerIndex];
    if (currentPlayer?.isManiac && room.settings.maniacEnabled) {
      set({ showKillModal: true });
      return;
    }
    
    // Check for random events
    if (room.settings.eventsEnabled && Math.random() * 100 < (room.settings.genieChance || 10)) {
      get().triggerRandomEvent();
    }
    
    set({ room: { ...room, currentPlayerIndex: nextIndex } });
  },
  
  // Scouting system
  startScouting: () => {
    set({ showScoutingModal: true, currentScoutLocation: null, scoutItems: [] });
  },
  
  selectLocation: (location) => {
    set({ currentScoutLocation: location, scoutItems: [] });
  },
  
  toggleScoutItem: (item) => {
    const { scoutItems, currentScoutLocation } = get();
    const maxItems = 2 + (scoutItems.includes('Сумка') || scoutItems.includes('Рюкзак') ? 3 : 0);
    
    if (scoutItems.includes(item)) {
      set({ scoutItems: scoutItems.filter(i => i !== item) });
    } else if (scoutItems.length < maxItems) {
      set({ scoutItems: [...scoutItems, item] });
    }
  },
  
  completeScout: () => {
    const { room, playerId, currentScoutLocation, scoutItems } = get();
    if (!room || !playerId || !currentScoutLocation) return;
    
    // Calculate survival chance
    const baseChance = 80;
    const distancePenalty = currentScoutLocation.distance * 10;
    const itemsBonus = scoutItems.length * 5;
    const finalChance = Math.max(20, Math.min(95, baseChance - distancePenalty + itemsBonus));
    
    const survived = Math.random() * 100 < finalChance;
    
    const players = room.players.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          items: [...p.items, ...scoutItems],
          score: p.score + (survived ? 15 : -20),
        };
      }
      return p;
    });
    
    const event = {
      id: 'e' + Date.now(),
      timestamp: Date.now(),
      type: 'scout',
      description: survived 
        ? `${p.name} вернулся из разведки с ${scoutItems.join(', ')}`
        : `${p.name} не вернулся из разведки`,
      playerId,
    };
    
    set({
      room: { ...room, players, events: [...room.events, event], phase: 'reveal' },
      showScoutingModal: false,
      currentScoutLocation: null,
      scoutItems: [],
    });
  },
  
  cancelScout: () => {
    set({ showScoutingModal: false, currentScoutLocation: null, scoutItems: [] });
  },
  
  // Random events
  triggerRandomEvent: () => {
    const { room, playerId } = get();
    if (!room) return;
    
    const events = RANDOM_EVENTS;
    const event = events[Math.floor(Math.random() * events.length)];
    
    switch (event.type) {
      case 'food_found':
        const players1 = room.players.map(p => ({
          ...p,
          items: [...p.items, 'Консервы'],
        }));
        set({ room: { ...room, players: players1 }, showEventModal: { type: 'food_found' } as any });
        break;
        
      case 'psychopath':
        // Find random player to be maniac
        const nonHost = room.players.filter(p => !p.isHost && !p.eliminated);
        if (nonHost.length > 0) {
          const maniac = nonHost[Math.floor(Math.random() * nonHost.length)];
          const players2 = room.players.map(p => 
            p.id === maniac.id ? { ...p, isManiac: true } : p
          );
          set({ room: { ...room, players: players2 }, showEventModal: { type: 'maniac', maniacId: maniac.id } as any });
        }
        break;
        
      case 'radiation_burst':
        const players3 = room.players.map(p => {
          const badHealth = p.cards.some(c => c.category === 'health' && c.dangerLevel && c.dangerLevel >= 3);
          if (badHealth) {
            return { ...p, hearts: Math.max(0, p.hearts - 1), score: p.score - 15 };
          }
          return p;
        });
        set({ room: { ...room, players: players3 }, showEventModal: { type: 'radiation_burst' } as any });
        break;
    }
    
    setTimeout(() => set({ showEventModal: null }), 5000);
  },
  
  handleGenieWish: (wish) => {
    const { room, playerId, addScore } = get();
    if (!room || !playerId) return;
    
    addScore(playerId, 10, 'Использовал желание джина');
    
    switch (wish) {
      case 'Добавить себе карту действия':
        const actions = allCards.filter(c => c.category === 'action');
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        const players1 = room.players.map(p => {
          if (p.id === playerId) return { ...p, cards: [...p.cards, randomAction] };
          return p;
        });
        set({ room: { ...room, players: players1 }, showGenieModal: false });
        break;
        
      case 'Вернуть вылетевшего игрока':
        get().returnPlayer(room.players.find(p => p.eliminated)?.id || '');
        set({ showGenieModal: false });
        break;
        
      default:
        set({ showGenieModal: false });
    }
  },
  
  // Maniac
  killPlayer: (playerId) => {
    get().eliminatePlayer(playerId, 'Убит маньяком');
    set({ showKillModal: false });
    get().nextTurn();
  },
  
  activateManiac: () => {
    const { room } = get();
    if (!room) return;
    
    const nonHost = room.players.filter(p => !p.isHost && !p.eliminated);
    if (nonHost.length === 0) return;
    
    const maniac = nonHost[Math.floor(Math.random() * nonHost.length)];
    const players = room.players.map(p => 
      p.id === maniac.id ? { ...p, isManiac: true } : p
    );
    
    set({ room: { ...room, players }, showManiacModal: true });
    setTimeout(() => set({ showManiacModal: false }), 5000);
  },
  
  // Scoring
  addScore: (playerId, points, action) => {
    const { room } = get();
    if (!room) return;
    
    const players = room.players.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          score: p.score + points,
          actions: [...p.actions, { type: 'score', points, description: action, timestamp: Date.now() }],
        };
      }
      return p;
    });
    
    set({ room: { ...room, players } });
  },
  
  calculateResults: () => {
    const { room } = get();
    if (!room) return;
    
    // Final scoring
    const survivors = room.players.filter(p => !p.eliminated);
    
    if (survivors.length === 0) {
      // All died - check for maniac win
      const maniac = room.players.find(p => p.isManiac);
      if (maniac) {
        set({ room: { ...room, phase: 'end', players: room.players.map(p => ({ ...p, score: p.isManiac ? 100 : p.score })) } });
      }
    } else {
      // Add survival points
      const players = room.players.map(p => {
        if (!p.eliminated) {
          return { ...p, score: p.score + 50 + (p.hearts * 10) };
        }
        return p;
      });
      
      set({ room: { ...room, phase: 'end', players }, currentView: 'results' });
    }
  },
}));
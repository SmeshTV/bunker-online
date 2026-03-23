import { create } from 'zustand';
import { Room, Player, Card, Threat, RoomSettings, ScoutingMission } from '../types';
import { getRandomCards, allCards } from '../data/cards';

interface GameState {
  // Room state
  room: Room | null;
  playerId: string | null;
  isHost: boolean;
  
  // UI state
  currentView: 'home' | 'create' | 'join' | 'lobby' | 'game' | 'scouting' | 'results';
  showCardModal: Card | null;
  showThreatModal: Threat | null;
  showVotingModal: boolean;
  showScoutingModal: boolean;
  showEventModal: { type: string; data: any } | null;
  showManiacModal: boolean;
  
  // Game actions
  createRoom: (settings: Partial<RoomSettings>) => void;
  joinRoom: (code: string, playerName: string) => void;
  leaveRoom: () => void;
  startGame: () => void;
  revealCard: (cardId: string) => void;
  addThreat: () => void;
  resolveThreat: (item: string) => void;
  eliminatePlayer: (playerId: string) => void;
  returnPlayer: (playerId: string) => void;
  useItem: (item: string) => void;
  startScouting: (playerId: string) => void;
  completeScouting: (survived: boolean, items: string[]) => void;
  vote: (playerId: string) => void;
  nextTurn: () => void;
  addEvent: (type: string, description: string) => void;
  toggleManiac: () => void;
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
  
  createRoom: (settings) => {
    const playerId = generatePlayerId();
    const roomCode = generateRoomCode();
    
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
    };
    
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
    };
    
    const room: Room = {
      code: roomCode,
      hostId: playerId,
      players: [hostPlayer],
      phase: 'lobby',
      currentDay: 1,
      currentPlayerIndex: 0,
      currentThreat: null,
      settings: { ...defaultSettings, ...settings },
      events: [],
    };
    
    set({ 
      room, 
      playerId, 
      isHost: true, 
      currentView: 'lobby' 
    });
  },
  
  joinRoom: (code, playerName) => {
    const playerId = generatePlayerId();
    // In real app, this would connect to server
    // For now, simulate joining
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
    };
    
    set((state) => ({
      playerId,
      isHost: false,
      currentView: 'lobby',
      room: state.room ? {
        ...state.room,
        players: [...state.room.players, newPlayer],
      } : null,
    }));
  },
  
  leaveRoom: () => {
    set({
      room: null,
      playerId: null,
      isHost: false,
      currentView: 'home',
    });
  },
  
  startGame: () => {
    const { room, playerId } = get();
    if (!room || !playerId) return;
    
    // Distribute cards to all players
    const categories = ['profession', 'bio', 'health', 'hobby', 'phobia', 'info', 'knowledge', 'bagage'];
    
    const playersWithCards = room.players.map(player => {
      const cards = getRandomCards(room.settings.cardsPerPlayer, categories);
      return {
        ...player,
        cards,
        revealedCards: [], // First reveal only profession
      };
    });
    
    // Set first threat
    const threats = allCards.filter(c => c.category === 'threat');
    const randomThreat = threats[Math.floor(Math.random() * threats.length)];
    
    set({
      room: {
        ...room,
        players: playersWithCards,
        phase: 'reveal',
        currentThreat: randomThreat as Threat,
      },
      currentView: 'game',
    });
  },
  
  revealCard: (cardId) => {
    const { room, playerId } = get();
    if (!room || !playerId) return;
    
    const players = room.players.map(p => {
      if (p.id === playerId && !p.eliminated) {
        return {
          ...p,
          revealedCards: [...p.revealedCards, cardId],
        };
      }
      return p;
    });
    
    set({
      room: { ...room, players },
    });
  },
  
  addThreat: () => {
    const { room } = get();
    if (!room) return;
    
    const threats = allCards.filter(c => c.category === 'threat');
    const randomThreat = threats[Math.floor(Math.random() * threats.length)];
    
    set({
      room: { ...room, currentThreat: randomThreat as Threat },
      showThreatModal: randomThreat as Threat,
    });
  },
  
  resolveThreat: (item) => {
    const { room } = get();
    if (!room || !room.currentThreat) return;
    
    // Check if item solves threat
    const solved = room.currentThreat.requiredItems?.includes(item);
    
    if (solved) {
      set({
        room: { ...room, currentThreat: null, phase: 'reveal' },
        showThreatModal: null,
      });
    } else {
      // Wrong item - lose heart
      const { playerId } = get();
      const players = room.players.map(p => {
        if (p.id === playerId) {
          return { ...p, hearts: Math.max(0, p.hearts - 1) };
        }
        return p;
      });
      
      set({
        room: { ...room, players },
        showVotingModal: true,
      });
    }
  },
  
  eliminatePlayer: (playerId) => {
    const { room } = get();
    if (!room) return;
    
    const players = room.players.map(p => {
      if (p.id === playerId) {
        return { ...p, eliminated: true, hearts: 0 };
      }
      return p;
    });
    
    // Check for condition cards (kamikaze etc)
    const eliminatedPlayer = room.players.find(p => p.id === playerId);
    const hasCondition = eliminatedPlayer?.cards.some(c => c.category === 'condition');
    
    set({
      room: { ...room, players },
    });
    
    if (hasCondition) {
      // Handle condition card effects
    }
  },
  
  returnPlayer: (playerId) => {
    const { room } = get();
    if (!room) return;
    
    const players = room.players.map(p => {
      if (p.id === playerId) {
        return { 
          ...p, 
          eliminated: false, 
          hearts: room.settings.heartsCount 
        };
      }
      return p;
    });
    
    set({ room: { ...room, players } });
  },
  
  useItem: (item) => {
    const { room, playerId } = get();
    if (!room || !playerId) return;
    
    const players = room.players.map(p => {
      if (p.id === playerId && p.items.includes(item)) {
        return {
          ...p,
          items: p.items.filter(i => i !== item),
        };
      }
      return p;
    });
    
    set({ room: { ...room, players } });
  },
  
  startScouting: (playerId) => {
    set({ showScoutingModal: true });
  },
  
  completeScouting: (survived, items) => {
    const { room, playerId } = get();
    if (!room || !playerId) return;
    
    const players = room.players.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          items: [...p.items, ...items],
        };
      }
      return p;
    });
    
    set({
      room: { ...room, players, phase: 'reveal' },
      showScoutingModal: false,
    });
  },
  
  vote: (playerId) => {
    // In real app, this would be a voting system
    get().eliminatePlayer(playerId);
    set({ showVotingModal: false });
  },
  
  nextTurn: () => {
    const { room } = get();
    if (!room) return;
    
    const nextIndex = (room.currentPlayerIndex + 1) % room.players.filter(p => !p.eliminated).length;
    
    set({
      room: { ...room, currentPlayerIndex: nextIndex },
    });
  },
  
  addEvent: (type, description) => {
    const { room } = get();
    if (!room) return;
    
    const event = {
      id: 'e' + Date.now(),
      timestamp: Date.now(),
      type,
      description,
    };
    
    set({
      room: { ...room, events: [...room.events, event] },
    });
  },
  
  toggleManiac: () => {
    const { room } = get();
    if (!room) return;
    
    // Assign maniac to random non-host player
    const nonHostPlayers = room.players.filter(p => !p.isHost && !p.eliminated);
    if (nonHostPlayers.length === 0) return;
    
    const maniac = nonHostPlayers[Math.floor(Math.random() * nonHostPlayers.length)];
    
    const players = room.players.map(p => {
      if (p.id === maniac.id) {
        return { ...p, isManiac: true };
      }
      return p;
    });
    
    set({
      room: { ...room, players },
      showManiacModal: true,
    });
  },
}));
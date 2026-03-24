import { create } from 'zustand';
import { Room, Player, Card, Threat, RoomSettings } from './types';
import { gameSocket } from './socket';
import { getRandomCards, allCards } from './data/cards';

interface GameState {
  room: Room | null;
  playerId: string | null;
  isHost: boolean;
  connected: boolean;
  
  currentView: 'home' | 'create' | 'join' | 'lobby' | 'game' | 'scouting' | 'results';
  showCardModal: Card | null;
  showThreatModal: Threat | null;
  showVotingModal: boolean;
  showScoutingModal: boolean;
  showEventModal: { type: string; data: any } | null;
  showManiacModal: boolean;
  
  connect: () => void;
  disconnect: () => void;
  createRoom: (settings: Partial<RoomSettings>, hostName: string) => Promise<void>;
  joinRoom: (code: string, playerName: string) => Promise<void>;
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

const generatePlayerId = () => 'p' + Math.random().toString(36).substr(2, 9);

export const useGameStore = create<GameState>((set, get) => ({
  room: null,
  playerId: null,
  isHost: false,
  connected: false,
  
  currentView: 'home',
  showCardModal: null,
  showThreatModal: null,
  showVotingModal: false,
  showScoutingModal: false,
  showEventModal: null,
  showManiacModal: false,
  
  connect: () => {
    gameSocket.connect();
    set({ connected: true });
    
    gameSocket.on('room-created', (data) => {
      set({ 
        room: data.room, 
        playerId: gameSocket.socketId || null, 
        isHost: true, 
        currentView: 'lobby' 
      });
    });
    
    gameSocket.on('joined', (data) => {
      set({ 
        room: data.room, 
        playerId: gameSocket.socketId || null, 
        currentView: 'lobby' 
      });
    });
    
    gameSocket.on('player-joined', (data) => {
      const { room } = get();
      if (room) {
        set({ 
          room: { 
            ...room, 
            players: [...room.players, data.player] 
          } 
        });
      }
    });
    
    gameSocket.on('game-started', (data) => {
      set({ 
        room: data.room, 
        currentView: 'game' 
      });
    });
    
    gameSocket.on('room-updated', (data) => {
      set({ room: data.room });
    });
    
    gameSocket.on('player-left', (data) => {
      const { room } = get();
      if (room) {
        set({ 
          room: { 
            ...room, 
            players: room.players.filter(p => p.id !== data.playerId) 
          } 
        });
      }
    });
  },
  
  disconnect: () => {
    gameSocket.disconnect();
    set({ connected: false });
  },
  
  createRoom: async (settings, hostName) => {
    const { connected } = get();
    if (!connected) {
      get().connect();
    }
    
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
    
    const result = await gameSocket.createRoom(
      { ...defaultSettings, ...settings },
      hostName
    );
    
    if (result.success && result.room) {
      set({ 
        room: result.room, 
        playerId: gameSocket.socketId || null, 
        isHost: true, 
        currentView: 'lobby' 
      });
    }
  },
  
  joinRoom: async (code, playerName) => {
    const { connected } = get();
    if (!connected) {
      get().connect();
    }
    
    const result = await gameSocket.joinRoom(code, playerName);
    
    if (result.success && result.room) {
      set({ 
        room: result.room, 
        playerId: gameSocket.socketId || null, 
        isHost: false, 
        currentView: 'lobby' 
      });
    } else {
      alert(result.error || 'Не удалось присоединиться');
    }
  },
  
  leaveRoom: () => {
    const { room } = get();
    if (room) {
      gameSocket.leaveRoom(room.code);
    }
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
    
    const categories = ['profession', 'bio', 'health', 'hobby', 'phobia', 'info', 'knowledge', 'bagage'];
    
    const playersWithCards = room.players.map(player => ({
      ...player,
      cards: getRandomCards(room.settings.cardsPerPlayer, categories),
      revealedCards: [],
    }));
    
    const threats = allCards.filter(c => c.category === 'threat');
    const randomThreat = threats[Math.floor(Math.random() * threats.length)];
    
    const updatedRoom = {
      ...room,
      players: playersWithCards,
      phase: 'reveal' as const,
      currentThreat: randomThreat as Threat,
    };
    
    gameSocket.updateRoom(room.code, updatedRoom);
    set({ room: updatedRoom, currentView: 'game' });
  },
  
  revealCard: (cardId) => {
    const { room, playerId } = get();
    if (!room || !playerId) return;
    
    const players = room.players.map(p => {
      if (p.id === playerId && !p.eliminated) {
        return { ...p, revealedCards: [...p.revealedCards, cardId] };
      }
      return p;
    });
    
    const updatedRoom = { ...room, players };
    gameSocket.updateRoom(room.code, updatedRoom);
    set({ room: updatedRoom });
  },
  
  addThreat: () => {
    const { room } = get();
    if (!room) return;
    
    const threats = allCards.filter(c => c.category === 'threat');
    const randomThreat = threats[Math.floor(Math.random() * threats.length)];
    
    const updatedRoom = { ...room, currentThreat: randomThreat as Threat };
    gameSocket.updateRoom(room.code, updatedRoom);
    set({ room: updatedRoom, showThreatModal: randomThreat as Threat });
  },
  
  resolveThreat: (item) => {
    const { room, playerId } = get();
    if (!room || !room.currentThreat) return;
    
    const solved = room.currentThreat.requiredItems?.includes(item);
    
    if (solved) {
      const updatedRoom = { ...room, currentThreat: null, phase: 'reveal' };
      gameSocket.updateRoom(room.code, updatedRoom);
      set({ room: updatedRoom, showThreatModal: null });
    } else {
      const players = room.players.map(p => {
        if (p.id === playerId) {
          return { ...p, hearts: Math.max(0, p.hearts - 1) };
        }
        return p;
      });
      
      const updatedRoom = { ...room, players };
      gameSocket.updateRoom(room.code, updatedRoom);
      set({ room: updatedRoom, showVotingModal: true });
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
    
    const updatedRoom = { ...room, players };
    gameSocket.updateRoom(room.code, updatedRoom);
    set({ room: updatedRoom });
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
    
    const updatedRoom = { ...room, players };
    gameSocket.updateRoom(room.code, updatedRoom);
    set({ room: updatedRoom });
  },
  
  useItem: (item) => {
    const { room, playerId } = get();
    if (!room || !playerId) return;
    
    const players = room.players.map(p => {
      if (p.id === playerId && p.items.includes(item)) {
        return { ...p, items: p.items.filter(i => i !== item) };
      }
      return p;
    });
    
    const updatedRoom = { ...room, players };
    gameSocket.updateRoom(room.code, updatedRoom);
    set({ room: updatedRoom });
  },
  
  startScouting: (playerId) => {
    set({ showScoutingModal: true });
  },
  
  completeScouting: (survived, items) => {
    const { room, playerId } = get();
    if (!room || !playerId) return;
    
    const players = room.players.map(p => {
      if (p.id === playerId) {
        return { ...p, items: [...p.items, ...items] };
      }
      return p;
    });
    
    const updatedRoom = { ...room, players, phase: 'reveal' };
    gameSocket.updateRoom(room.code, updatedRoom);
    set({ room: updatedRoom, showScoutingModal: false });
  },
  
  vote: (playerId) => {
    get().eliminatePlayer(playerId);
    set({ showVotingModal: false });
  },
  
  nextTurn: () => {
    const { room } = get();
    if (!room) return;
    
    const activePlayers = room.players.filter(p => !p.eliminated);
    const nextIndex = (room.currentPlayerIndex + 1) % activePlayers.length;
    
    const updatedRoom = { ...room, currentPlayerIndex: nextIndex };
    gameSocket.updateRoom(room.code, updatedRoom);
    set({ room: updatedRoom });
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
    
    const updatedRoom = { ...room, events: [...room.events, event] };
    gameSocket.updateRoom(room.code, updatedRoom);
    set({ room: updatedRoom });
  },
  
  toggleManiac: () => {
    const { room } = get();
    if (!room) return;
    
    const nonHostPlayers = room.players.filter(p => !p.isHost && !p.eliminated);
    if (nonHostPlayers.length === 0) return;
    
    const maniac = nonHostPlayers[Math.floor(Math.random() * nonHostPlayers.length)];
    
    const players = room.players.map(p => {
      if (p.id === maniac.id) {
        return { ...p, isManiac: true };
      }
      return p;
    });
    
    const updatedRoom = { ...room, players };
    gameSocket.updateRoom(room.code, updatedRoom);
    set({ room: updatedRoom, showManiacModal: true });
  },
}));
import { create } from 'zustand';
import { Room, Player, Card, Threat, RoomSettings } from './types';
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
  
  connect: () => Promise<void>;
  disconnect: () => void;
  createRoom: (settings: Partial<RoomSettings>, hostName: string) => Promise<string>;
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
const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
};

// Firebase configuration
const FIREBASE_URL = 'https://bunker-game-4feaa-default-rtdb.europe-west1.firebasedatabase.app';

// Firebase helper functions
const getRoomRef = (code: string) => FIREBASE_URL + '/rooms/' + code;

const fetchRoom = async (code: string): Promise<Room | null> => {
  try {
    const res = await fetch(getRoomRef(code) + '.json');
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

const updateRoom = async (code: string, room: Room) => {
  try {
    await fetch(getRoomRef(code) + '.json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(room)
    });
  } catch (e) {
    console.error('Failed to update room:', e);
  }
};

const deleteRoom = async (code: string) => {
  try {
    await fetch(getRoomRef(code) + '.json', { method: 'DELETE' });
  } catch {}
};

// Polling for updates
let pollInterval: number | null = null;

const startPolling = (code: string, onUpdate: (room: Room) => void) => {
  stopPolling();
  pollInterval = window.setInterval(async () => {
    const room = await fetchRoom(code);
    if (room) onUpdate(room);
  }, 1000);
};

const stopPolling = () => {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
};

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
  
  connect: async () => {
    set({ connected: true });
  },
  
  disconnect: () => {
    stopPolling();
    set({ connected: false });
  },
  
  createRoom: async (settings, hostName) => {
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
    
    const code = generateRoomCode();
    const playerId = generatePlayerId();
    
    const room: Room = {
      code,
      hostId: playerId,
      players: [{
        id: playerId,
        name: hostName,
        isHost: true,
        isOnline: true,
        hearts: defaultSettings.heartsCount,
        cards: [],
        revealedCards: [],
        eliminated: false,
        items: [],
        score: 0,
        actions: []
      }],
      settings: { ...defaultSettings, ...settings },
      phase: 'lobby',
      currentDay: 1,
      currentPlayerIndex: 0,
      currentThreat: null,
      events: []
    };
    
    await updateRoom(code, room);
    set({ room, playerId, isHost: true, currentView: 'lobby' });
    
    // Start polling for updates
    startPolling(code, (updatedRoom) => {
      set({ room: updatedRoom });
    });
    
    return code;
  },
  
  joinRoom: async (code, playerName) => {
    const room = await fetchRoom(code.toUpperCase());
    
    if (!room) {
      alert('Комната не найдена');
      return;
    }
    
    const playerId = generatePlayerId();
    const newPlayer: Player = {
      id: playerId,
      name: playerName,
      isHost: false,
      isOnline: true,
      hearts: room.settings.heartsCount,
      cards: [],
      revealedCards: [],
      eliminated: false,
      items: [],
      score: 0,
      actions: []
    };
    
    const updatedRoom = {
      ...room,
      players: [...room.players, newPlayer]
    };
    
    await updateRoom(code.toUpperCase(), updatedRoom);
    
    set({ 
      room: updatedRoom, 
      playerId, 
      isHost: false, 
      currentView: 'lobby',
      connected: true 
    });
    
    // Start polling
    startPolling(code.toUpperCase(), (remoteRoom) => {
      const { playerId: myId } = get();
      const me = remoteRoom.players.find((p: Player) => p.id === myId);
      if (me) {
        set({ room: remoteRoom });
      }
    });
  },
  
  leaveRoom: async () => {
    const { room, playerId } = get();
    if (room && playerId) {
      const updatedRoom = {
        ...room,
        players: room.players.filter(p => p.id !== playerId)
      };
      
      if (updatedRoom.players.length > 0) {
        await updateRoom(room.code, updatedRoom);
      } else {
        await deleteRoom(room.code);
      }
    }
    
    stopPolling();
    set({
      room: null,
      playerId: null,
      isHost: false,
      currentView: 'home',
      connected: false,
    });
  },
  
  startGame: () => {
    const { room } = get();
    if (!room) return;
    
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
    
    set({ room: updatedRoom, currentView: 'game' });
    updateRoom(room.code, updatedRoom);
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
    set({ room: updatedRoom });
    updateRoom(room.code, updatedRoom);
  },
  
  addThreat: () => {
    const { room } = get();
    if (!room) return;
    
    const threats = allCards.filter(c => c.category === 'threat');
    const randomThreat = threats[Math.floor(Math.random() * threats.length)];
    
    const updatedRoom = { ...room, currentThreat: randomThreat as Threat };
    set({ room: updatedRoom, showThreatModal: randomThreat as Threat });
    updateRoom(room.code, updatedRoom);
  },
  
  resolveThreat: (item) => {
    const { room, playerId } = get();
    if (!room || !room.currentThreat) return;
    
    const solved = room.currentThreat.requiredItems?.includes(item);
    
    if (solved) {
      const updatedRoom = { ...room, currentThreat: null, phase: 'reveal' };
      set({ room: updatedRoom, showThreatModal: null });
      updateRoom(room.code, updatedRoom);
    } else {
      const players = room.players.map(p => {
        if (p.id === playerId) {
          return { ...p, hearts: Math.max(0, p.hearts - 1) };
        }
        return p;
      });
      
      const updatedRoom = { ...room, players };
      set({ room: updatedRoom, showVotingModal: true });
      updateRoom(room.code, updatedRoom);
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
    set({ room: updatedRoom });
    updateRoom(room.code, updatedRoom);
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
    set({ room: updatedRoom });
    updateRoom(room.code, updatedRoom);
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
    set({ room: updatedRoom });
    updateRoom(room.code, updatedRoom);
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
    set({ room: updatedRoom, showScoutingModal: false });
    updateRoom(room.code, updatedRoom);
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
    set({ room: updatedRoom });
    updateRoom(room.code, updatedRoom);
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
    set({ room: updatedRoom });
    updateRoom(room.code, updatedRoom);
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
    set({ room: updatedRoom, showManiacModal: true });
    updateRoom(room.code, updatedRoom);
  },
}));
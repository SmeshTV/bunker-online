export interface Card {
  id: string;
  category: 'profession' | 'bio' | 'health' | 'hobby' | 'phobia' | 'info' | 'knowledge' | 'bagage' | 'action' | 'condition';
  name: string;
  description: string;
  dangerLevel?: number;
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  isOnline: boolean;
  hearts: number;
  cards: Card[];
  revealedCards: string[];
  eliminated: boolean;
  isManiac?: boolean;
  items: string[];
}

export interface Room {
  code: string;
  hostId: string;
  players: Player[];
  phase: 'lobby' | 'reveal' | 'threat' | 'voting' | 'scouting' | 'end';
  currentDay: number;
  currentPlayerIndex: number;
  currentThreat: Threat | null;
  settings: RoomSettings;
  events: GameEvent[];
}

export interface RoomSettings {
  playerCount: number;
  cardsPerPlayer: number;
  survivalDays: number;
  gameMode: 'classic' | 'hard' | 'madness';
  timerEnabled: boolean;
  timerDuration: number;
  heartsCount: number;
  showDescriptions: boolean;
  scoutEnabled: boolean;
  eventsEnabled: boolean;
  forcedVotingEnabled: boolean;
}

export interface Threat {
  id: string;
  name: string;
  description: string;
  dangerLevel: number;
  category: 'natural' | 'technical' | 'biological' | 'human' | 'random';
  requiredItems: string[];
  solution?: string;
}

export interface GameEvent {
  id: string;
  timestamp: number;
  type: string;
  description: string;
  playerId?: string;
}

export interface ScoutingMission {
  playerId: string;
  location: string;
  distance: number;
  items: string[];
  selectedItems: string[];
  survived?: boolean;
  result?: string;
}
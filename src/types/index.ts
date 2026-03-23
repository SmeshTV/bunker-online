export interface Card {
  id: string;
  category: 'profession' | 'bio' | 'health' | 'hobby' | 'phobia' | 'info' | 'knowledge' | 'bagage' | 'action' | 'condition' | 'threat';
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
  score: number;
  actions: PlayerAction[];
}

export interface PlayerAction {
  type: 'vote' | 'solve_threat' | 'reveal_card' | 'use_item' | 'scout' | 'kill' | 'help_player' | 'bad_decision';
  points: number;
  description: string;
  timestamp: number;
}

export interface Room {
  code: string;
  hostId: string;
  players: Player[];
  phase: 'lobby' | 'reveal' | 'threat' | 'voting' | 'scouting' | 'night_kill' | 'events' | 'end';
  currentDay: number;
  currentPlayerIndex: number;
  currentThreat: Threat | null;
  currentEvent: GameEventType | null;
  settings: RoomSettings;
  events: GameEvent[];
  scoutingMission: ScoutingLocation | null;
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
  maniacEnabled: boolean;
  genieChance: number;
  eventFrequency: 'none' | 'every_round' | 'every_2' | 'every_3' | 'random';
  eventIntensity: 'easy' | 'medium' | 'hard' | 'extreme';
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

// Random events types
export type GameEventType = 
  | { type: 'genie'; playerId: string; wishes: string[] }
  | { type: 'maniac'; maniacId: string }
  | { type: 'food_found' }
  | { type: 'radiation_burst' }
  | { type: 'mass_sleep' }
  | { type: 'psychopath' }
  | { type: 'traitor' };

export interface ScoutingLocation {
  name: string;
  distance: number;
  danger: number;
  items: string[];
  description: string;
}

export const SCOUTING_LOCATIONS: ScoutingLocation[] = [
  { name: 'Аптека', distance: 1, danger: 2, items: ['Аптечка', 'Бинты', 'Лекарства'], description: 'Сарай с медикаментами' },
  { name: 'Склад', distance: 2, danger: 3, items: ['Консервы', 'Вода', 'Одеяло'], description: 'Заброшенный склад' },
  { name: 'Военная часть', distance: 3, danger: 5, items: ['Нож', 'Патроны', 'Бронежилет'], description: 'Военная база' },
  { name: 'Лаборатория', distance: 4, danger: 4, items: ['Дозиметр', 'Хирургические инструменты', 'Препараты'], description: 'Секретная лаборатория' },
  { name: 'Магазин', distance: 1, danger: 1, items: ['Фонарик', 'Батарейки', 'Веревка'], description: 'Разрушенный магазин' },
  { name: 'Гараж', distance: 2, danger: 2, items: ['Инструменты', 'Канистра', 'Провода'], description: 'Брошенный гараж' },
  { name: 'Церковь', distance: 3, danger: 3, items: ['Крест', 'Свечи', 'Бинты'], description: 'Старая церковь' },
  { name: 'Школа', distance: 2, danger: 2, items: ['Аптечка', 'Нож', 'Веревка'], description: 'Заброшенная школа' },
];

export const GENIE_WISHES = [
  'Вскрыть 2 характеристики любому игроку',
  'Добавить себе карту действия',
  'Вылечить всем здоровье',
  'Убрать одного игрока из игры',
  'Получить координаты безопасного места',
  'Вернуть вылетевшего игрока',
  'Случайное желание',
  'Ничего не желать',
];

export const RANDOM_EVENTS = [
  { type: 'food_found', title: 'Нашли еду!', description: 'В бункере нашли запас консервов', effect: 'all_heal' },
  { type: 'radiation_burst', title: 'Радиация!', description: 'Выброс радиации! Те, у кого плохое здоровье, теряют шанс выжить', effect: 'health_risk' },
  { type: 'mass_sleep', title: 'Массовый сон', description: 'Все уснули. Следующий раунд без обсуждения', effect: 'skip_discussion' },
  { type: 'psychopath', title: 'Опасный псих', description: 'Среди вас скрытый маньяк', effect: 'activate_maniac' },
];
import { io, Socket } from 'socket.io-client';
import { Room, Player } from '../types';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

class GameSocket {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  connect() {
    if (this.socket?.connected) return;
    
    this.socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('room-created', (data) => {
      this.emit('room-created', data);
    });

    this.socket.on('joined', (data) => {
      this.emit('joined', data);
    });

    this.socket.on('player-joined', (data) => {
      this.emit('player-joined', data);
    });

    this.socket.on('game-started', (data) => {
      this.emit('game-started', data);
    });

    this.socket.on('room-updated', (data) => {
      this.emit('room-updated', data);
    });

    this.socket.on('player-left', (data) => {
      this.emit('player-left', data);
    });

    this.socket.on('action-performed', (data) => {
      this.emit('action-performed', data);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }

  createRoom(settings: any, hostName: string): Promise<{ success: boolean; code?: string; room?: Room; error?: string }> {
    return new Promise((resolve) => {
      this.socket?.emit('create-room', { settings, hostName }, (response: any) => {
        resolve(response);
      });
    });
  }

  joinRoom(code: string, playerName: string): Promise<{ success: boolean; room?: Room; error?: string }> {
    return new Promise((resolve) => {
      this.socket?.emit('join-room', { code, playerName }, (response: any) => {
        resolve(response);
      });
    });
  }

  startGame(code: string): Promise<{ success: boolean; room?: Room; error?: string }> {
    return new Promise((resolve) => {
      this.socket?.emit('start-game', { code }, (response: any) => {
        resolve(response);
      });
    });
  }

  updateRoom(code: string, updates: Partial<Room>) {
    this.socket?.emit('update-room', { code, updates });
  }

  playerAction(code: string, action: string, data: any) {
    this.socket?.emit('player-action', { code, action, data });
  }

  leaveRoom(code: string) {
    this.socket?.emit('leave-room', { code });
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach(callback => callback(data));
  }

  get socketId() {
    return this.socket?.id;
  }
}

export const gameSocket = new GameSocket();
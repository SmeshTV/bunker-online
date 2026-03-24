import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// In-memory storage
const rooms = new Map();

// Generate room code
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Create room
  socket.on('create-room', (data, callback) => {
    const code = generateCode();
    const room = {
      code,
      hostId: socket.id,
      players: [{
        id: socket.id,
        name: data.hostName || 'Хост',
        isHost: true,
        isOnline: true,
        hearts: data.settings?.heartsCount || 3,
        cards: [],
        revealedCards: [],
        eliminated: false,
        items: [],
        score: 0,
        actions: []
      }],
      settings: data.settings,
      phase: 'lobby',
      currentDay: 1,
      currentPlayerIndex: 0,
      currentThreat: null,
      events: []
    };
    
    rooms.set(code, room);
    socket.join(code);
    socket.emit('room-created', { code, room });
    console.log('Room created:', code);
    callback({ success: true, code, room });
  });

  // Join room
  socket.on('join-room', (data, callback) => {
    const room = rooms.get(data.code);
    if (!room) {
      callback({ success: false, error: 'Комната не найдена' });
      return;
    }
    
    if (room.players.length >= room.settings.playerCount) {
      callback({ success: false, error: 'Комната полна' });
      return;
    }
    
    const player = {
      id: socket.id,
      name: data.playerName,
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
    
    room.players.push(player);
    socket.join(data.code);
    socket.emit('joined', { room });
    socket.to(data.code).emit('player-joined', { player });
    callback({ success: true, room });
  });

  // Start game
  socket.on('start-game', (data, callback) => {
    const room = rooms.get(data.code);
    if (!room) {
      callback({ success: false, error: 'Комната не найдена' });
      return;
    }
    
    room.phase = 'reveal';
    
    io.to(data.code).emit('game-started', { room });
    callback({ success: true, room });
  });

  // Update room state
  socket.on('update-room', (data) => {
    const room = rooms.get(data.code);
    if (room) {
      Object.assign(room, data.updates);
      socket.to(data.code).emit('room-updated', { room });
    }
  });

  // Player action
  socket.on('player-action', (data) => {
    const room = rooms.get(data.code);
    if (room) {
      socket.to(data.code).emit('action-performed', { 
        playerId: socket.id, 
        action: data.action,
        data: data.data
      });
    }
  });

  // Leave room
  socket.on('leave-room', (data) => {
    const room = rooms.get(data.code);
    if (room) {
      room.players = room.players.filter(p => p.id !== socket.id);
      socket.to(data.code).emit('player-left', { playerId: socket.id });
      socket.leave(data.code);
      
      if (room.players.length === 0) {
        rooms.delete(data.code);
      }
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    
    rooms.forEach((room, code) => {
      const player = room.players.find(p => p.id === socket.id);
      if (player) {
        room.players = room.players.filter(p => p.id !== socket.id);
        io.to(code).emit('player-left', { playerId: socket.id });
        
        if (room.players.length === 0) {
          rooms.delete(code);
        }
      }
    });
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🎮 Server running on port ${PORT}`);
});
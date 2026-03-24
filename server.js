import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for simplicity in this dev environment
    methods: ["GET", "POST"]
  }
});

// In-memory storage
const rooms = new Map();

// Generate unique room code
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
  } while (rooms.has(code)); // Ensure uniqueness
  return code;
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Create room
  socket.on('create-room', (data, callback) => {
    try {
      const code = generateCode();
      const room = {
        code,
        hostId: socket.id,
        players: [{
          id: socket.id,
          name: data.hostName || 'Host',
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
        settings: data.settings || {},
        phase: 'lobby',
        currentDay: 1,
        currentPlayerIndex: 0,
        currentThreat: null,
        events: []
      };
      
      rooms.set(code, room);
      socket.join(code);
      
      // Send back response
      if (typeof callback === 'function') {
        callback({ success: true, code, room });
      }
      
      console.log(`Room created: ${code} by ${socket.id}`);
    } catch (error) {
      console.error('Error creating room:', error);
      if (typeof callback === 'function') {
        callback({ success: false, error: 'Failed to create room' });
      }
    }
  });

  // Join room
  socket.on('join-room', (data, callback) => {
    try {
      const room = rooms.get(data.code);
      
      if (!room) {
        if (typeof callback === 'function') callback({ success: false, error: 'Room not found' });
        return;
      }
      
      if (room.players.length >= (room.settings.playerCount || 10)) { // Default max 10 if not set
        if (typeof callback === 'function') callback({ success: false, error: 'Room is full' });
        return;
      }
      
      // Check if player is already in room (reconnection)
      const existingPlayerIndex = room.players.findIndex(p => p.id === socket.id);
      if (existingPlayerIndex !== -1) {
         room.players[existingPlayerIndex].isOnline = true;
         socket.join(data.code);
         socket.emit('joined', { room });
         io.to(data.code).emit('player-rejoined', { playerId: socket.id });
         if (typeof callback === 'function') callback({ success: true, room });
         return;
      }

      const player = {
        id: socket.id,
        name: data.playerName || 'Player',
        isHost: false,
        isOnline: true,
        hearts: room.settings.heartsCount || 3,
        cards: [],
        revealedCards: [],
        eliminated: false,
        items: [],
        score: 0,
        actions: []
      };
      
      room.players.push(player);
      socket.join(data.code);
      
      // Notify other players
      socket.to(data.code).emit('player-joined', { player });
      
      // Respond to joiner
      if (typeof callback === 'function') {
        callback({ success: true, room });
      }
      
      console.log(`Player ${data.playerName} (${socket.id}) joined room ${data.code}`);
    } catch (error) {
      console.error('Error joining room:', error);
      if (typeof callback === 'function') {
        callback({ success: false, error: 'Failed to join room' });
      }
    }
  });

  // Start game
  socket.on('start-game', (data, callback) => {
    const room = rooms.get(data.code);
    if (!room) {
      if (typeof callback === 'function') callback({ success: false, error: 'Room not found' });
      return;
    }
    
    // Only host can start
    if (room.hostId !== socket.id) {
       if (typeof callback === 'function') callback({ success: false, error: 'Only host can start game' });
       return;
    }

    room.phase = 'reveal'; // Or whatever the first game phase is
    io.to(data.code).emit('game-started', { room });
    
    if (typeof callback === 'function') callback({ success: true, room });
  });

  // Update room state (generic sync)
  socket.on('update-room', (data) => {
    const room = rooms.get(data.code);
    if (room) {
      // Basic validation: ensure sender is in the room
      if (room.players.some(p => p.id === socket.id)) {
        Object.assign(room, data.updates);
        // Broadcast to everyone in the room including sender if needed, 
        // usually state updates go to everyone.
        io.to(data.code).emit('room-updated', { room });
      }
    }
  });

  // Player action (specific events)
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

  // Leave room explicitly
  socket.on('leave-room', (data) => {
    const room = rooms.get(data.code);
    if (room) {
      handlePlayerLeave(room, socket.id);
      socket.leave(data.code);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    // Find rooms where this socket was a player
    rooms.forEach((room) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        handlePlayerLeave(room, socket.id);
      }
    });
  });
});

function handlePlayerLeave(room, playerId) {
  const playerIndex = room.players.findIndex(p => p.id === playerId);
  if (playerIndex !== -1) {
    const wasHost = room.players[playerIndex].isHost;
    
    // Remove player
    room.players.splice(playerIndex, 1);
    
    // Notify room
    io.to(room.code).emit('player-left', { playerId });
    
    if (room.players.length === 0) {
      // Delete room if empty
      rooms.delete(room.code);
      console.log(`Room ${room.code} deleted (empty)`);
    } else if (wasHost) {
      // Assign new host
      room.players[0].isHost = true;
      room.hostId = room.players[0].id;
      io.to(room.code).emit('host-changed', { newHostId: room.hostId });
    }
  }
}

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

export default function Lobby() {
  const { room, playerId, isHost, startGame, leaveRoom } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [starting, setStarting] = useState(false);
  
  if (!room) return null;
  
  const copyCode = () => {
    navigator.clipboard.writeText(room.code);
  };
  
  const handleStartGame = async () => {
    setStarting(true);
    startGame();
    setStarting(false);
  };
  
  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <div className="max-w-lg w-full">
        {/* Room Code */}
        <div className="text-center mb-8">
          <div className="bg-gray-900/50 p-4 rounded-lg border border-red-500/30 inline-block">
            <p className="text-gray-400 text-sm mb-1">Код комнаты</p>
            <p className="text-4xl font-bold text-red-500 tracking-widest">{room.code}</p>
          </div>
          <button
            onClick={copyCode}
            className="block mx-auto mt-2 text-gray-400 text-sm hover:text-white"
          >
            Копировать
          </button>
        </div>
        
        {!isHost && room.players.length === 1 ? (
          /* Join as player */
          <div className="bg-gray-900/50 p-6 rounded-lg border border-red-500/20">
            <h3 className="text-xl font-bold text-white mb-4">Присоединиться к игре</h3>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Ваше имя"
              className="w-full bg-gray-800 text-white p-3 rounded-lg border border-red-500/30 mb-4"
            />
            <button
              onClick={async () => {
                if (playerName.trim()) {
                  await useGameStore.getState().joinRoom(room.code, playerName.trim());
                }
              }}
              disabled={!playerName.trim()}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg disabled:opacity-50"
            >
              Присоединиться
            </button>
          </div>
        ) : (
          /* Players list */
          <div className="bg-gray-900/50 p-6 rounded-lg border border-red-500/20">
            <h3 className="text-xl font-bold text-white mb-4">
              Игроки ({room.players.length}/{room.settings.playerCount})
            </h3>
            
            <div className="space-y-3">
              {room.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <p className="text-white font-medium">{player.name}</p>
                      {player.isHost && <span className="text-red-400 text-sm">Ведущий</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${player.isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Host controls */}
            {isHost && room.players.length >= 2 && (
              <button
                onClick={handleStartGame}
                disabled={starting}
                className="w-full mt-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xl disabled:opacity-50"
              >
                {starting ? 'Запуск...' : 'Начать игру'}
              </button>
            )}
            
            {!isHost && room.players.length >= 2 && (
              <p className="text-center text-gray-400 mt-4">Ожидаем начала игры от ведущего...</p>
            )}
          </div>
        )}
        
        {/* Leave button */}
        <button
          onClick={leaveRoom}
          className="w-full mt-4 py-2 text-gray-400 hover:text-white"
        >
          Покинуть комнату
        </button>
      </div>
    </div>
  );
}
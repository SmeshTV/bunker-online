import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

export default function JoinRoom() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const joinRoom = useGameStore((state) => state.joinRoom);
  
  const handleJoin = () => {
    if (code.length === 6 && name.length > 0) {
      joinRoom(code.toUpperCase(), name);
    }
  };
  
  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-red-500 mb-8">Вход в комнату</h2>
      
      <div className="max-w-md w-full space-y-6">
        <div>
          <label className="block text-gray-300 mb-2">Код комнаты</label>
          <input
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="XXXXXX"
            className="w-full bg-gray-800 text-white text-2xl text-center p-4 rounded-lg border border-red-500/30 tracking-widest"
          />
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Ваше имя</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ваше имя"
            className="w-full bg-gray-800 text-white p-4 rounded-lg border border-red-500/30"
          />
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={() => useGameStore.setState({ currentView: 'home' })}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            Назад
          </button>
          <button
            onClick={handleJoin}
            disabled={code.length !== 6 || name.length === 0}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Войти
          </button>
        </div>
      </div>
    </div>
  );
}
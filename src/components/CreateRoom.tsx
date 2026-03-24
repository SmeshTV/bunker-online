import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { RoomSettings } from '../types';

export default function CreateRoom() {
  const createRoom = useGameStore((state) => state.createRoom);
  
  const [hostName, setHostName] = useState('Хост');
  const [settings, setSettings] = useState<Partial<RoomSettings>>({
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
    maniacEnabled: true,
    genieChance: 10,
    eventFrequency: 'random',
    eventIntensity: 'medium',
  });
  
  const handleCreate = async () => {
    await createRoom(settings, hostName);
  };
  
  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-red-500 mb-8">Создание комнаты</h2>
      
      <div className="max-w-xl w-full space-y-6 overflow-auto">
        {/* Host Name */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-red-500/20">
          <label className="block text-gray-300 mb-2">Ваше имя</label>
          <input 
            type="text" 
            value={hostName} 
            onChange={(e) => setHostName(e.target.value)} 
            className="w-full bg-gray-800 text-white p-2 rounded border border-red-500/30"
            placeholder="Как вас зовут?"
          />
        </div>
        
        {/* Player Count */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-red-500/20">
          <label className="block text-gray-300 mb-2">Количество игроков: {settings.playerCount}</label>
          <input type="range" min="4" max="12" value={settings.playerCount} onChange={(e) => setSettings({ ...settings, playerCount: parseInt(e.target.value) })} className="w-full accent-red-500" />
        </div>
        
        {/* Cards per Player */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-red-500/20">
          <label className="block text-gray-300 mb-2">Карт на игрока: {settings.cardsPerPlayer}</label>
          <input type="range" min="5" max="10" value={settings.cardsPerPlayer} onChange={(e) => setSettings({ ...settings, cardsPerPlayer: parseInt(e.target.value) })} className="w-full accent-red-500" />
        </div>
        
        {/* Survival Days */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-red-500/20">
          <label className="block text-gray-300 mb-2">Дней до победы: {settings.survivalDays}</label>
          <input type="range" min="3" max="10" value={settings.survivalDays} onChange={(e) => setSettings({ ...settings, survivalDays: parseInt(e.target.value) })} className="w-full accent-red-500" />
        </div>
        
        {/* Hearts */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-red-500/20">
          <label className="block text-gray-300 mb-2">Сердечек: {settings.heartsCount}</label>
          <input type="range" min="1" max="5" value={settings.heartsCount} onChange={(e) => setSettings({ ...settings, heartsCount: parseInt(e.target.value) })} className="w-full accent-red-500" />
        </div>
        
        {/* Game Mode */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-red-500/20">
          <label className="block text-gray-300 mb-2">Режим игры</label>
          <select value={settings.gameMode} onChange={(e) => setSettings({ ...settings, gameMode: e.target.value as any })} className="w-full bg-gray-800 text-white p-2 rounded border border-red-500/30">
            <option value="classic">Классика</option>
            <option value="hard">Жёсткий</option>
            <option value="madness">Безумие (с маньяком)</option>
          </select>
        </div>
        
        {/* Genie Chance */}
        {settings.eventsEnabled && (
          <div className="bg-gray-900/50 p-4 rounded-lg border border-yellow-500/20">
            <label className="block text-gray-300 mb-2">Шанс джина: {settings.genieChance}%</label>
            <input type="range" min="0" max="30" value={settings.genieChance} onChange={(e) => setSettings({ ...settings, genieChance: parseInt(e.target.value) })} className="w-full accent-yellow-500" />
          </div>
        )}
        
        {/* Event Frequency */}
        {settings.eventsEnabled && (
          <div className="bg-gray-900/50 p-4 rounded-lg border border-yellow-500/20">
            <label className="block text-gray-300 mb-2">Частота событий</label>
            <select value={settings.eventFrequency} onChange={(e) => setSettings({ ...settings, eventFrequency: e.target.value as any })} className="w-full bg-gray-800 text-white p-2 rounded border border-yellow-500/30">
              <option value="none">Выключены</option>
              <option value="every_round">Каждый раунд</option>
              <option value="every_2">Каждые 2 раунда</option>
              <option value="every_3">Каждые 3 раунда</option>
              <option value="random">Случайно</option>
            </select>
          </div>
        )}
        
        {/* Toggles */}
        <div className="bg-gray-900/50 p-4 rounded-lg border border-red-500/20 space-y-3">
          <label className="flex items-center justify-between text-gray-300">
            <span>Показывать описания карт всем</span>
            <input type="checkbox" checked={settings.showDescriptions} onChange={(e) => setSettings({ ...settings, showDescriptions: e.target.checked })} className="w-5 h-5 accent-red-500" />
          </label>
          
          <label className="flex items-center justify-between text-gray-300">
            <span>🔪 Маньяк (режим Безумие)</span>
            <input type="checkbox" checked={settings.maniacEnabled} onChange={(e) => setSettings({ ...settings, maniacEnabled: e.target.checked })} className="w-5 h-5 accent-red-500" />
          </label>
          
          <label className="flex items-center justify-between text-gray-300">
            <span>🚀 Разведка</span>
            <input type="checkbox" checked={settings.scoutEnabled} onChange={(e) => setSettings({ ...settings, scoutEnabled: e.target.checked })} className="w-5 h-5 accent-red-500" />
          </label>
          
          <label className="flex items-center justify-between text-gray-300">
            <span>⚡ Случайные события</span>
            <input type="checkbox" checked={settings.eventsEnabled} onChange={(e) => setSettings({ ...settings, eventsEnabled: e.target.checked })} className="w-5 h-5 accent-red-500" />
          </label>
          
          <label className="flex items-center justify-between text-gray-300">
            <span>🗳️ Принудительное голосование</span>
            <input type="checkbox" checked={settings.forcedVotingEnabled} onChange={(e) => setSettings({ ...settings, forcedVotingEnabled: e.target.checked })} className="w-5 h-5 accent-red-500" />
          </label>
          
          <label className="flex items-center justify-between text-gray-300">
            <span>⏱️ Таймер хода</span>
            <input type="checkbox" checked={settings.timerEnabled} onChange={(e) => setSettings({ ...settings, timerEnabled: e.target.checked })} className="w-5 h-5 accent-red-500" />
          </label>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-4">
          <button onClick={() => useGameStore.setState({ currentView: 'home' })} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">Назад</button>
          <button onClick={handleCreate} className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg">Создать</button>
        </div>
      </div>
    </div>
  );
}
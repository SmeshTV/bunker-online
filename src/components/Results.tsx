import { useGameStore } from '../stores/gameStore';

export default function Results() {
  const { room, leaveRoom } = useGameStore();
  
  if (!room) return null;
  
  const survivors = room.players.filter(p => !p.eliminated);
  const eliminated = room.players.filter(p => p.eliminated);
  
  // Calculate scores based on various factors
  const calculateScore = (player: typeof room.players[0]) => {
    let score = 50;
    
    // Hearts remaining
    score += player.hearts * 10;
    
    // Cards revealed
    score += player.revealedCards.length * 5;
    
    // Items collected
    score += player.items.length * 3;
    
    // No negative condition cards triggered
    const badConditions = player.cards.filter(c => c.category === 'condition' && c.dangerLevel && c.dangerLevel >= 3);
    if (badConditions.length === 0) score += 20;
    
    return score;
  };
  
  const getPlayerResult = (player: typeof room.players[0]) => {
    const score = calculateScore(player);
    
    if (player.isManiac) {
      return {
        title: '🔪 Маньяк',
        description: 'Ты был маньяком и всех убил! Победа!',
        color: 'text-purple-400',
      };
    }
    
    if (!player.eliminated) {
      return {
        title: '🏆 Выживший',
        description: 'Поздравляем! Ты выжил в бункере!',
        color: 'text-green-400',
      };
    }
    
    if (score >= 80) {
      return {
        title: '⭐ Герой',
        description: 'Ты героически погиб, но твои действия были на высоте!',
        color: 'text-yellow-400',
      };
    }
    
    return {
      title: '💀 Погибший',
      description: 'Ты не справился с выживанием в бункере.',
      color: 'text-red-400',
    };
  };
  
  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-red-500 mb-8">Игра завершена!</h1>
      
      <div className="max-w-2xl w-full space-y-6">
        {/* Results for each player */}
        {room.players.map(player => {
          const result = getPlayerResult(player);
          return (
            <div key={player.id} className="bg-gray-900/50 p-4 rounded-lg border border-red-500/20">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{player.name}</h3>
                <span className={`text-lg ${result.color}`}>{result.title}</span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{result.description}</p>
              
              <div className="flex gap-4 text-sm text-gray-500">
                <span>❤️: {player.hearts}/{room.settings.heartsCount}</span>
                <span>📤: {player.revealedCards.length}</span>
                <span>🎒: {player.items.length}</span>
                <span>📊: {calculateScore(player)}</span>
              </div>
            </div>
          );
        })}
        
        {/* Summary */}
        <div className="bg-gray-900/50 p-6 rounded-lg border border-red-500/20 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Итоги игры</h3>
          <p className="text-gray-400">
            Выжило {survivors.length} из {room.players.length} игроков
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Всего дней: {room.currentDay} | Событий: {room.events.length}
          </p>
        </div>
        
        {/* Actions */}
        <button
          onClick={leaveRoom}
          className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg"
        >
          В главное меню
        </button>
      </div>
    </div>
  );
}
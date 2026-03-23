import { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { Card, Player, ScoutingLocation } from '../types';
import { SCOUTING_LOCATIONS, GENIE_WISHES } from '../types';

export default function Game() {
  const { 
    room, 
    playerId, 
    isHost, 
    revealCard, 
    addThreat, 
    resolveThreat, 
    eliminatePlayer, 
    returnPlayer,
    vote,
    startScouting,
    selectLocation,
    toggleScoutItem,
    completeScout,
    cancelScout,
    showCardModal,
    showThreatModal,
    showVotingModal,
    showScoutingModal,
    showEventModal,
    showManiacModal,
    showGenieModal,
    showKillModal,
    currentScoutLocation,
    scoutItems,
    killPlayer,
    handleGenieWish,
    triggerRandomEvent,
    nextTurn,
  } = useGameStore();
  
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [activeTab, setActiveTab] = useState<'my-cards' | 'players' | 'threat' | 'items'>('my-cards');
  
  if (!room || !playerId) return null;
  
  const currentPlayer = room.players.find(p => p.id === playerId);
  const isMyTurn = room.players[room.currentPlayerIndex]?.id === playerId;
  const isManiac = currentPlayer?.isManiac;
  
  const getCardCategoryName = (category: string) => {
    const names: Record<string, string> = {
      profession: 'Профессия',
      bio: 'Био.характеристики',
      health: 'Состояние здоровья',
      hobby: 'Хобби',
      phobia: 'Фобия',
      info: 'Доп.информация',
      knowledge: 'Знание',
      bagage: 'Багаж',
      action: 'Карта действия',
      condition: 'Карта условия',
      threat: 'Угроза',
    };
    return names[category] || category;
  };
  
  const renderCard = (card: Card, showFull = false) => {
    const isRevealed = currentPlayer?.revealedCards.includes(card.id);
    const showDescription = showFull || room.settings.showDescriptions;
    
    return (
      <div 
        key={card.id}
        className={`bg-gray-800 p-3 rounded-lg border ${isRevealed ? 'border-green-500/50' : 'border-red-500/30'} cursor-pointer hover:border-red-500 transition-all`}
        onClick={() => setSelectedCard(card)}
      >
        <div className="flex justify-between items-start mb-1">
          <span className="text-xs text-gray-400">{getCardCategoryName(card.category)}</span>
          {card.dangerLevel && (
            <span className="text-xs text-red-400">{'💀'.repeat(card.dangerLevel)}</span>
          )}
        </div>
        <h4 className="font-bold text-white">{card.name}</h4>
        {(isRevealed || showDescription) && card.description && (
          <p className="text-gray-400 text-sm mt-1">{card.description}</p>
        )}
        {!isRevealed && !showDescription && (
          <p className="text-gray-600 text-sm mt-1">Нажмите чтобы открыть</p>
        )}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 bg-gray-900/50 p-3 rounded-lg">
        <div className="flex items-center gap-4">
          <span className="text-red-500 font-bold">День {room.currentDay}</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">Фаза: {room.phase}</span>
        </div>
        <div className="flex items-center gap-2">
          {currentPlayer && (
            <>
              <span className="text-red-400">{'❤️'.repeat(currentPlayer.hearts)}</span>
              {isManiac && <span className="text-purple-400">🔪</span>}
            </>
          )}
        </div>
      </div>
      
      {/* Threat banner */}
      {room.currentThreat && (
        <div className="bg-red-900/50 border border-red-500 p-4 rounded-lg mb-4 animate-pulse">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-red-400 font-bold text-lg">⚠️ УГРОЗА</h3>
              <p className="text-white">{room.currentThreat.name}</p>
              {room.currentThreat.description && (
                <p className="text-gray-400 text-sm">{room.currentThreat.description}</p>
              )}
            </div>
            {isHost && (
              <button onClick={addThreat} className="px-4 py-2 bg-red-600 rounded-lg text-white">
                Новая
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(['my-cards', 'players', 'threat', 'items'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg ${activeTab === tab ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            {tab === 'my-cards' && 'Мои карты'}
            {tab === 'players' && 'Игроки'}
            {tab === 'threat' && 'Угроза'}
            {tab === 'items' && 'Предметы'}
          </button>
        ))}
        
        {room.settings.scoutEnabled && (
          <button
            onClick={startScouting}
            className="px-4 py-2 rounded-lg bg-green-600 text-white"
          >
            🚀 Разведка
          </button>
        )}
        
        {isHost && (
          <button
            onClick={triggerRandomEvent}
            className="px-4 py-2 rounded-lg bg-yellow-600 text-white"
          >
            ⚡ Событие
          </button>
        )}
        
        <button
          onClick={nextTurn}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white"
        >
          Следующий ход ➡️
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === 'my-cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentPlayer?.cards.map(card => renderCard(card, isMyTurn))}
          </div>
        )}
        
        {activeTab === 'players' && (
          <div className="space-y-3">
            {room.players.filter(p => !p.eliminated).map(player => (
              <div key={player.id} className="bg-gray-800 p-4 rounded-lg border border-red-500/20">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👤</span>
                    <div>
                      <h4 className="font-bold text-white">{player.name}</h4>
                      {player.isHost && <span className="text-red-400 text-sm">Ведущий</span>}
                      {player.isManiac && <span className="text-purple-400 text-sm ml-2">🔪 Маньяк</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400">{'❤️'.repeat(player.hearts)}</span>
                    <span className="text-gray-500 text-sm">({player.score} очков)</span>
                    {player.id === room.players[room.currentPlayerIndex]?.id && (
                      <span className="text-yellow-400 animate-pulse">▶️</span>
                    )}
                  </div>
                </div>
                
                {player.revealedCards.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {player.revealedCards.map(cardId => {
                      const card = player.cards.find(c => c.id === cardId);
                      return card ? (
                        <span key={cardId} className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300">
                          {card.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'threat' && room.currentThreat && (
          <div className="bg-gray-800 p-6 rounded-lg border border-red-500">
            <h3 className="text-2xl font-bold text-red-500 mb-4">{room.currentThreat.name}</h3>
            <p className="text-gray-300 mb-4">{room.currentThreat.description}</p>
            {room.currentThreat.dangerLevel && (
              <div className="mb-4">
                <span className="text-gray-400">Опасность: </span>
                <span className="text-red-400">{'💀'.repeat(room.currentThreat.dangerLevel)}</span>
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="text-white font-bold mb-2">Использовать предмет:</h4>
              <div className="flex flex-wrap gap-2">
                {currentPlayer?.items.map(item => (
                  <button
                    key={item}
                    onClick={() => resolveThreat(item)}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'items' && (
          <div>
            <h3 className="text-white font-bold mb-3">Мои предметы</h3>
            {currentPlayer?.items.length ? (
              <div className="flex flex-wrap gap-2">
                {currentPlayer.items.map(item => (
                  <div key={item} className="px-4 py-2 bg-gray-800 rounded-lg text-white border border-green-500/30">
                    {item}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Нет предметов</p>
            )}
          </div>
        )}
      </div>
      
      {/* Host controls */}
      {isHost && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex gap-2 flex-wrap">
            <button onClick={addThreat} className="px-4 py-2 bg-red-600 rounded-lg text-white">
              Угроза
            </button>
          </div>
          
          <div className="mt-4">
            <h4 className="text-gray-400 mb-2">Управление:</h4>
            <div className="flex flex-wrap gap-2">
              {room.players.map(player => (
                <div key={player.id} className="flex items-center gap-2 bg-gray-800 p-2 rounded">
                  <span className="text-white">{player.name}</span>
                  {player.eliminated ? (
                    <button onClick={() => returnPlayer(player.id)} className="px-2 py-1 bg-green-600 rounded text-white text-sm">
                      Вернуть
                    </button>
                  ) : (
                    <button onClick={() => eliminatePlayer(player.id)} className="px-2 py-1 bg-red-600 rounded text-white text-sm">
                      Изгнать
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Card Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-lg w-full border border-red-500">
            <div className="flex justify-between items-start mb-4">
              <span className="text-gray-400">{getCardCategoryName(selectedCard.category)}</span>
              <button onClick={() => setSelectedCard(null)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{selectedCard.name}</h3>
            {selectedCard.description && (
              <p className="text-gray-300 mb-4">{selectedCard.description}</p>
            )}
            {selectedCard.dangerLevel && (
              <div className="text-red-400">{'💀'.repeat(selectedCard.dangerLevel)}</div>
            )}
            
            {isHost && !currentPlayer?.revealedCards.includes(selectedCard.id) && (
              <button onClick={() => { revealCard(selectedCard.id); setSelectedCard(null); }} className="mt-4 w-full py-2 bg-red-600 rounded-lg text-white">
                Открыть всем
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Voting Modal */}
      {showVotingModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-lg w-full border border-red-500">
            <h3 className="text-xl font-bold text-white mb-4">Угроза не решена! Кого изгнать?</h3>
            <div className="space-y-2">
              {room.players.filter(p => !p.eliminated && p.id !== playerId).map(player => (
                <button key={player.id} onClick={() => vote(player.id)} className="w-full p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-left">
                  {player.name}
                </button>
              ))}
              <button onClick={() => useGameStore.setState({ showVotingModal: false })} className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-400">
                Воздержаться
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Scouting Modal */}
      {showScoutingModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-2xl w-full border border-green-500">
            <h3 className="text-xl font-bold text-white mb-4">🚀 Разведка</h3>
            
            {!currentScoutLocation ? (
              <div className="grid grid-cols-2 gap-3">
                {SCOUTING_LOCATIONS.map(loc => (
                  <button
                    key={loc.name}
                    onClick={() => selectLocation(loc)}
                    className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-left border border-gray-700"
                  >
                    <h4 className="text-white font-bold">{loc.name}</h4>
                    <p className="text-gray-400 text-sm">Расстояние: {loc.distance}km</p>
                    <p className="text-red-400 text-sm">Опасность: {'⚠️'.repeat(loc.danger)}</p>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                <div className="mb-4 p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-white font-bold">{currentScoutLocation.name}</h4>
                  <p className="text-gray-400">{currentScoutLocation.description}</p>
                  <p className="text-gray-500 text-sm">Расстояние: {currentScoutLocation.distance}km</p>
                </div>
                
                <h4 className="text-white mb-2">Доступные предметы (выберите до 2-5):</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentScoutLocation.items.map(item => (
                    <button
                      key={item}
                      onClick={() => toggleScoutItem(item)}
                      className={`px-3 py-2 rounded ${scoutItems.includes(item) ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                    >
                      {item} {scoutItems.includes(item) && '✓'}
                    </button>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <button onClick={cancelScout} className="flex-1 py-2 bg-gray-700 rounded-lg text-white">Отмена</button>
                  <button onClick={completeScout} disabled={scoutItems.length === 0} className="flex-1 py-2 bg-green-600 rounded-lg text-white disabled:opacity-50">
                    Отправиться ({Math.max(20, 80 - currentScoutLocation.distance * 10 + scoutItems.length * 5)}% шанс вернуться)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Maniac Kill Modal */}
      {showKillModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-lg w-full border border-purple-500">
            <h3 className="text-xl font-bold text-purple-400 mb-4">🔪 Ночь. Вы маньяк.</h3>
            <p className="text-gray-400 mb-4">Кого вы хотите убить?</p>
            <div className="space-y-2">
              {room.players.filter(p => !p.eliminated && p.id !== playerId).map(player => (
                <button key={player.id} onClick={() => killPlayer(player.id)} className="w-full p-3 bg-gray-800 hover:bg-purple-900 rounded-lg text-white text-left">
                  {player.name}
                </button>
              ))}
              <button onClick={() => { useGameStore.setState({ showKillModal: false }); nextTurn(); }} className="w-full p-3 bg-gray-700 rounded-lg text-gray-400">
                Никого (пропустить)
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-lg w-full border border-yellow-500 animate-pulse">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">
              {showEventModal.type === 'food_found' && '🍖 Нашли еду!'}
              {showEventModal.type === 'radiation_burst' && '☢️ Радиация!'}
              {showEventModal.type === 'maniac' && '🔪 Маньяк среди вас!'}
              {showEventModal.type === 'genie' && '🧞 Джин!'}
            </h3>
            <p className="text-gray-300">
              {showEventModal.type === 'food_found' && 'Все игроки получают по консерве'}
              {showEventModal.type === 'radiation_burst' && 'Те, у кого плохое здоровье, теряют сердечко'}
              {showEventModal.type === 'maniac' && 'Среди вас скрытый маньяк! Он может убивать по ночам!'}
            </p>
          </div>
        </div>
      )}
      
      {/* Maniac Info Modal */}
      {showManiacModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 p-6 rounded-lg max-w-lg w-full border border-purple-500">
            <h3 className="text-xl font-bold text-purple-400 mb-4">🔪 Маньяк активирован!</h3>
            <p className="text-gray-300">Один из игроков теперь маньяк. Он может убивать по ночам!</p>
            <p className="text-gray-500 text-sm mt-2">Не говорите никому!</p>
          </div>
        </div>
      )}
    </div>
  );
}
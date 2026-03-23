import { useGameStore } from '../stores/gameStore';

export default function Home() {
  const { currentView, room } = useGameStore();
  const setCurrentView = useGameStore.getState().currentView;
  
  const navigate = (view: any) => {
    useGameStore.setState({ currentView: view });
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-1 h-1 bg-red-500 rounded-full animate-pulse" style={{ top: '20%', left: '10%' }}></div>
        <div className="absolute w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ top: '60%', left: '80%' }}></div>
        <div className="absolute w-1 h-1 bg-red-600 rounded-full animate-pulse" style={{ top: '40%', left: '50%' }}></div>
        <div className="absolute w-1 h-1 bg-red-500 rounded-full animate-pulse" style={{ top: '80%', left: '20%' }}></div>
        <div className="absolute w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ top: '30%', left: '70%' }}></div>
      </div>
      
      {/* Title */}
      <h1 className="text-6xl md:text-8xl font-bold text-center mb-8 tracking-widest relative">
        <span className="text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-pulse">
          БУНКЕР
        </span>
      </h1>
      
      <p className="text-gray-400 text-center mb-12 text-lg">
        Постапокалиптическая игра о выживании
      </p>
      
      {/* Buttons */}
      <div className="flex flex-col gap-4 z-10">
        <button
          onClick={() => navigate('create')}
          className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white text-xl font-bold rounded-lg transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,0,0,0.5)]"
        >
          Создать комнату
        </button>
        
        <button
          onClick={() => navigate('join')}
          className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white text-xl font-bold rounded-lg border border-red-500/30 transition-all hover:scale-105"
        >
          Войти по коду
        </button>
      </div>
      
      {/* Rules */}
      <div className="mt-12 max-w-md p-6 bg-gray-900/50 rounded-lg border border-red-500/20">
        <h3 className="text-red-400 font-bold mb-2">Как играть</h3>
        <ul className="text-gray-400 text-sm space-y-2">
          <li>• Создай комнату или присоединись по коду</li>
          <li>• Получай карты с характеристиками персонажа</li>
          <li>• Решай угрозы, используя предметы</li>
          <li>• Выживи 5 дней или стань последним выжившим</li>
        </ul>
      </div>
    </div>
  );
}
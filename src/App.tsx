import { useGameStore } from './stores/gameStore';
import Home from './components/Home';
import CreateRoom from './components/CreateRoom';
import JoinRoom from './components/JoinRoom';
import Lobby from './components/Lobby';
import Game from './components/Game';
import Results from './components/Results';

function App() {
  const currentView = useGameStore((state) => state.currentView);
  
  switch (currentView) {
    case 'home':
      return <Home />;
    case 'create':
      return <CreateRoom />;
    case 'join':
      return <JoinRoom />;
    case 'lobby':
      return <Lobby />;
    case 'game':
    case 'scouting':
      return <Game />;
    case 'results':
      return <Results />;
    default:
      return <Home />;
  }
}

export default App;
import { useState, useEffect } from 'react';
import './App.css';
import farmBg from './assets/background-farm.png';
import { getSpriteUrl } from './utils/sprites';
import NewHuntModal from './components/NewHuntModal';
import HuntCounterModal from './components/HuntCounterModal';
import FarmView from './components/FarmView';

const GRID_SIZE = 12;

function App() {
  const [hunts, setHunts] = useState(
    () => JSON.parse(localStorage.getItem('hunts') || '[]')
  );
  const [view,        setView]        = useState('hunts'); // 'hunts' | 'farm'
  const [newHuntOpen, setNewHuntOpen] = useState(false);
  const [activeHunt,  setActiveHunt]  = useState(null);

  useEffect(() => {
    localStorage.setItem('hunts', JSON.stringify(hunts));
  }, [hunts]);

  function handleStart({ pokemon, gameId, methodId, modifiers, odds }) {
    const hunt = {
      id: Date.now().toString(),
      pokemon,
      gameId,
      methodId,
      modifiers,
      odds,
      count: 0,
      status: 'active',
      startedAt: new Date().toISOString(),
    };
    setHunts(prev => [...prev, hunt]);
    setNewHuntOpen(false);
  }

  function handleUpdateHunt(huntId, changes) {
    setHunts(prev =>
      prev.map(h => (h.id === huntId ? { ...h, ...changes } : h))
    );
    setActiveHunt(prev => (prev?.id === huntId ? { ...prev, ...changes } : prev));
  }

  function handleCatchHunt(huntId) {
    handleUpdateHunt(huntId, { status: 'caught' });
    setActiveHunt(null);
  }

  function handleCancelHunt(huntId) {
    setHunts(prev => prev.filter(h => h.id !== huntId));
    setActiveHunt(null);
  }

  function handleClearFarm() {
    setHunts([]);
    setActiveHunt(null);
  }

  const visibleHunts = hunts.filter(h => h.status === 'active');
  const caughtHunts  = hunts.filter(h => h.status === 'caught');
  const emptySlots   = Math.max(0, GRID_SIZE - visibleHunts.length);

  if (view === 'farm') {
    return (
      <FarmView
        caughtHunts={caughtHunts}
        onBack={() => setView('hunts')}
      />
    );
  }

  return (
    <div className="farm" style={{ backgroundImage: `url(${farmBg})` }}>
      <button className="clear-farm-btn" onClick={handleClearFarm}>
        Clear Farm
      </button>

      <div className="farm-overlay">
        <h1 className="farm-title">ShinyVortex's Shiny Farm</h1>

        <div className="pokemon-grid">
          {visibleHunts.map(hunt => (
            <div
              key={hunt.id}
              className="pokemon-slot pokemon-slot--filled"
              onClick={() => setActiveHunt(hunt)}
            >
              <img
                src={getSpriteUrl(hunt.pokemon.id, true)}
                alt={hunt.pokemon.name}
                className="pokemon-sprite"
                style={{ opacity: 0.35 }}
              />
            </div>
          ))}
          {Array.from({ length: emptySlots }).map((_, i) => (
            <div key={i} className="pokemon-slot" />
          ))}
        </div>

        <div className="farm-actions">
          <button className="hunt-button" onClick={() => setNewHuntOpen(true)}>
            Start a New Hunt
          </button>
          <button className="farm-view-btn" onClick={() => setView('farm')}>
            🌿 Go to Farm
          </button>
        </div>
      </div>

      {newHuntOpen && (
        <NewHuntModal
          onClose={() => setNewHuntOpen(false)}
          onStart={handleStart}
        />
      )}

      {activeHunt && (
        <HuntCounterModal
          hunt={activeHunt}
          onClose={() => setActiveHunt(null)}
          onUpdate={handleUpdateHunt}
          onCatch={handleCatchHunt}
          onCancel={handleCancelHunt}
        />
      )}

    </div>
  );
}

export default App;

import { useState } from 'react';
import './App.css';
import farmBg from './assets/background-farm.png';
import { getSpriteUrl, getCryUrl } from './utils/sprites';
import NewHuntModal from './components/NewHuntModal';

function playCry(id) {
  new Audio(getCryUrl(id)).play();
}

function App() {
  const [modalOpen, setModalOpen] = useState(false);

  function handleStart(huntData) {
    console.log('New hunt:', huntData);
    setModalOpen(false);
  }

  return (
    <div className="farm" style={{ backgroundImage: `url(${farmBg})` }}>
      <div className="farm-overlay">
        <h1 className="farm-title">ShinyVortex's Shiny Farm</h1>

        <div className="pokemon-grid">
          <div className="pokemon-slot pokemon-slot--filled">
            <img
              src={getSpriteUrl(63, true)}
              alt="Shiny Abra"
              className="pokemon-sprite"
              onClick={() => playCry(63)}
            />
          </div>
          {Array.from({ length: 11 }).map((_, i) => (
            <div key={i} className="pokemon-slot" />
          ))}
        </div>

        <button className="hunt-button" onClick={() => setModalOpen(true)}>
          Start a New Hunt
        </button>
      </div>

      {modalOpen && (
        <NewHuntModal
          onClose={() => setModalOpen(false)}
          onStart={handleStart}
        />
      )}
    </div>
  );
}

export default App;

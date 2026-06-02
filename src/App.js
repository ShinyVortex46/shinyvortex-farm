import './App.css';
import farmBg from './assets/background-farm.png';
import { getSpriteUrl, getCryUrl } from './utils/sprites';

function playCry(id) {
  new Audio(getCryUrl(id)).play();
}

function App() {
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

        <button className="hunt-button">Start a New Hunt</button>
      </div>
    </div>
  );
}

export default App;

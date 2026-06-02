import { GAMES } from '../data/games';
import { METHODS } from '../data/methods';
import { getSpriteUrl } from '../utils/sprites';
import './HuntSummaryModal.css';

function getGameName(gameId) {
  return GAMES.find(g => g.id === gameId)?.name ?? gameId;
}

function getMethodName(methodId) {
  return METHODS.find(m => m.id === methodId)?.name ?? methodId;
}

export default function HuntSummaryModal({ hunt, onClose }) {
  const { pokemon, gameId, methodId, odds, count } = hunt;

  return (
    <div className="hsm-backdrop" onClick={onClose}>
      <div className="hsm-modal" onClick={e => e.stopPropagation()}>

        <button className="hsm-close" onClick={onClose}>✕</button>

        <div className="hsm-game-banner">
          {getGameName(gameId).toUpperCase()} | {getMethodName(methodId).toUpperCase()}
        </div>

        <div className="hsm-header">
          <img
            src={getSpriteUrl(pokemon.id, true)}
            alt={`Shiny ${pokemon.name}`}
            className="hsm-sprite"
          />
          <h2 className="hsm-name">{pokemon.name}</h2>
          <span className="hsm-caught-badge">✨ Caught</span>
        </div>

        <div className="hsm-stats">
          <div className="hsm-stat">
            <span className="hsm-stat-label">Encounters</span>
            <span className="hsm-stat-value">{count.toLocaleString()}</span>
          </div>
          <div className="hsm-stat-divider" />
          <div className="hsm-stat">
            <span className="hsm-stat-label">Odds</span>
            <span className="hsm-stat-value">{odds ?? '—'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}

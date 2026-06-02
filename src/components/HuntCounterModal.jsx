import { getSpriteUrl } from '../utils/sprites';
import './HuntCounterModal.css';

function parseOddsDenom(odds) {
  // odds is a string like "1/4096" — we want the denominator as a number
  return parseInt(odds?.split('/')[1] ?? '4096', 10);
}

export default function HuntCounterModal({ hunt, onClose, onUpdate, onCatch }) {
  const { id, pokemon, odds, count } = hunt;
  const denom = parseOddsDenom(odds);
  const progress = Math.min(count / denom, 1);

  function increment() { onUpdate(id, { count: count + 1 }); }
  function decrement() { onUpdate(id, { count: Math.max(0, count - 1) }); }

  return (
    <div className="hcm-backdrop" onClick={onClose}>
      <div className="hcm-modal" onClick={e => e.stopPropagation()}>

        <button className="hcm-close" onClick={onClose}>✕</button>

        {/* Pokémon name + shiny sprite */}
        <div className="hcm-header">
          <img
            src={getSpriteUrl(pokemon.id, true)}
            alt={`Shiny ${pokemon.name}`}
            className="hcm-sprite"
          />
          <h2 className="hcm-name">{pokemon.name}</h2>
        </div>

        {/* Count display */}
        <div className="hcm-count-display">{count.toLocaleString()}</div>
        <div className="hcm-count-label">encounters</div>

        {/* +/- buttons */}
        <div className="hcm-controls">
          <button className="hcm-btn hcm-btn--minus" onClick={decrement} disabled={count === 0}>
            −
          </button>
          <button className="hcm-btn hcm-btn--plus" onClick={increment}>
            +
          </button>
        </div>

        {/* Odds + progress */}
        <div className="hcm-odds-row">
          <span className="hcm-odds-label">Odds</span>
          <span className="hcm-odds-value">{odds ?? '—'}</span>
        </div>

        <div className="hcm-progress-track">
          <div
            className="hcm-progress-fill"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <div className="hcm-progress-label">
          {(progress * 100).toFixed(1)}% of one full odds
        </div>

        {/* Catch button */}
        <button className="hcm-catch-btn" onClick={() => onCatch(id)}>
          ✨ Got it!
        </button>

      </div>
    </div>
  );
}

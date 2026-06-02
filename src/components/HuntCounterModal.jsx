import { useState } from 'react';
import { GAMES } from '../data/games';
import { METHODS } from '../data/methods';
import { getSpriteUrl } from '../utils/sprites';
import './HuntCounterModal.css';

function parseOddsDenom(odds) {
  return parseInt(odds?.split('/')[1] ?? '4096', 10);
}

function getGameName(gameId) {
  return GAMES.find(g => g.id === gameId)?.name ?? gameId;
}

function getMethodName(methodId) {
  return METHODS.find(m => m.id === methodId)?.name ?? methodId;
}

export default function HuntCounterModal({ hunt, onClose, onUpdate, onCatch, onCancel }) {
  const { id, pokemon, odds, count, gameId, methodId } = hunt;
  const [confirming, setConfirming] = useState(false);

  const denom = parseOddsDenom(odds);
  const progress = Math.min(count / denom, 1);

  function increment() { onUpdate(id, { count: count + 1 }); }
  function decrement() { onUpdate(id, { count: Math.max(0, count - 1) }); }

  return (
    <div className="hcm-backdrop" onClick={onClose}>
      <div className="hcm-modal" onClick={e => e.stopPropagation()}>

        <button className="hcm-close" onClick={onClose}>✕</button>

        {/* Game | Method banner */}
        <div className="hcm-game-banner">
          {getGameName(gameId).toUpperCase()} | {getMethodName(methodId).toUpperCase()}
        </div>

        {/* Pokémon name + shiny sprite */}
        <div className="hcm-header">
          <img
            src={getSpriteUrl(pokemon.id, true)}
            alt={`Shiny ${pokemon.name}`}
            className="hcm-sprite"
          />
          <h2 className="hcm-name">{pokemon.name}</h2>
        </div>

        {!confirming ? (
          <>
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

            {/* Actions */}
            <button className="hcm-catch-btn" onClick={() => onCatch(id)}>
              ✨ Got it!
            </button>
            <button className="hcm-cancel-btn" onClick={() => setConfirming(true)}>
              Cancel hunt
            </button>
          </>
        ) : (
          <div className="hcm-confirm">
            <p className="hcm-confirm-text">
              Delete this hunt and all its data?<br />This cannot be undone.
            </p>
            <button className="hcm-confirm-yes" onClick={() => onCancel(id)}>
              Yes, delete it
            </button>
            <button className="hcm-confirm-no" onClick={() => setConfirming(false)}>
              Go back
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

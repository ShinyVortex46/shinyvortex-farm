import { useState, useMemo } from 'react';
import pokemonList from '../data/pokemon.json';
import { GAMES } from '../data/games';
import { METHODS } from '../data/methods';
import { MODIFIERS } from '../data/modifiers';
import { getSpriteUrl, getCryUrl } from '../utils/sprites';
import './NewHuntModal.css';

const STEPS = ['Pokémon', 'Game', 'Method', 'Modifiers'];

// Converts a "1/N" odds string + active modifier extraRolls into a "1/X" string.
// All shiny mechanics are modelled as extra rolls out of 4096.
function computeOdds(method, activeModifiers) {
  if (!method) return null;
  const denom = parseInt(method.baseOdds.split('/')[1], 10);
  const baseRolls = Math.round(4096 / denom);
  const extraRolls = activeModifiers.reduce((sum, mod) => sum + mod.extraRolls, 0);
  const totalRolls = baseRolls + extraRolls;
  return `1/${Math.round(4096 / totalRolls)}`;
}

export default function NewHuntModal({ onClose, onStart }) {
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState('');
  const [pokemon, setPokemon] = useState(null);   // { id, name }
  const [gameId, setGameId] = useState('');
  const [methodId, setMethodId] = useState('');
  const [modifiers, setModifiers] = useState([]);  // array of modifier ids

  // ── Step 1: Pokémon search ────────────────────────────────────────────────
  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return pokemonList
      .filter(p => p.name.includes(q))
      .slice(0, 20);
  }, [search]);

  function selectPokemon(p) {
    setPokemon(p);
    setSearch(p.name);
  }

  // ── Step 2: Game ──────────────────────────────────────────────────────────
  const gamesByGen = useMemo(() => {
    const map = {};
    for (const g of GAMES) {
      (map[g.generation] ??= []).push(g);
    }
    return map;
  }, []);

  const selectedGame = GAMES.find(g => g.id === gameId) ?? null;

  // ── Step 3: Method ────────────────────────────────────────────────────────
  const availableMethods = useMemo(() => {
    if (!selectedGame) return [];
    return METHODS.filter(m => selectedGame.availableMethods.includes(m.id));
  }, [selectedGame]);

  const selectedMethod = METHODS.find(m => m.id === methodId) ?? null;

  // ── Step 4: Modifiers ─────────────────────────────────────────────────────
  const availableModifiers = useMemo(() => {
    if (!selectedGame) return [];
    return MODIFIERS.filter(
      m => m.games.includes('all') || m.games.includes(selectedGame.methodGroup)
    );
  }, [selectedGame]);

  const activeModifiers = useMemo(
    () => MODIFIERS.filter(m => modifiers.includes(m.id)),
    [modifiers]
  );

  const currentOdds = useMemo(
    () => computeOdds(selectedMethod, activeModifiers),
    [selectedMethod, activeModifiers]
  );

  function toggleModifier(id) {
    setModifiers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function canAdvance() {
    if (step === 0) return !!pokemon;
    if (step === 1) return !!gameId;
    if (step === 2) return !!methodId;
    return true;
  }

  function handleNext() {
    if (step === 0) {
      new Audio(getCryUrl(pokemon.id)).play();
    }
    if (step === 2) {
      setModifiers([]);
    }
    setStep(s => s + 1);
  }

  function handleBack() {
    setStep(s => s - 1);
  }

  function handleStart() {
    onStart({ pokemon, gameId, methodId, modifiers, odds: currentOdds });
  }

  // ── Sprite preview (shown once a pokémon is chosen) ───────────────────────
  function SpritePreview() {
    if (!pokemon) return null;
    return (
      <div className="nhm-sprite-preview">
        <div className="nhm-sprite-pair">
          <img src={getSpriteUrl(pokemon.id, false)} alt={pokemon.name} />
          <span className="nhm-sprite-label">Normal</span>
        </div>
        <div className="nhm-sprite-pair">
          <img src={getSpriteUrl(pokemon.id, true)} alt={`Shiny ${pokemon.name}`} />
          <span className="nhm-sprite-label nhm-sprite-label--shiny">✨ Shiny</span>
        </div>
        <div className="nhm-sprite-divider" />
        <div className="nhm-odds">
          {currentOdds ? (
            <>
              <span className="nhm-odds-label">Current Odds</span>
              <span className="nhm-odds-value">{currentOdds}</span>
            </>
          ) : (
            <span className="nhm-odds-label nhm-odds-label--empty">odds after<br/>method pick</span>
          )}
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="nhm-backdrop" onClick={onClose}>
      <div className="nhm-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="nhm-header">
          <h2 className="nhm-title">Start a New Hunt</h2>
          <button className="nhm-close" onClick={onClose}>✕</button>
        </div>

        {/* Step indicator */}
        <div className="nhm-steps">
          {STEPS.map((label, i) => (
            <div
              key={label}
              className={`nhm-step ${i === step ? 'nhm-step--active' : ''} ${i < step ? 'nhm-step--done' : ''}`}
            >
              <span className="nhm-step-dot">{i < step ? '✓' : i + 1}</span>
              <span className="nhm-step-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="nhm-body">
          {step === 0 && (
            <div className="nhm-section">
              <label className="nhm-label">Search Pokémon</label>
              <input
                className="nhm-input"
                type="text"
                placeholder="e.g. eevee"
                value={search}
                onChange={e => { setSearch(e.target.value); setPokemon(null); }}
                autoFocus
              />
              {searchResults.length > 0 && !pokemon && (
                <ul className="nhm-results">
                  {searchResults.map(p => (
                    <li
                      key={p.id}
                      className="nhm-result"
                      onClick={() => selectPokemon(p)}
                    >
                      <img
                        src={getSpriteUrl(p.id, false)}
                        alt={p.name}
                        className="nhm-result-sprite"
                      />
                      <span className="nhm-result-name">
                        #{p.id} {p.name}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <SpritePreview />
            </div>
          )}

          {step === 1 && (
            <div className="nhm-section">
              <SpritePreview />
              <label className="nhm-label">Select Game</label>
              <select
                className="nhm-select"
                value={gameId}
                onChange={e => { setGameId(e.target.value); setMethodId(''); setModifiers([]); }}
              >
                <option value="">— choose a game —</option>
                {Object.entries(gamesByGen).map(([gen, games]) => (
                  <optgroup key={gen} label={`Generation ${gen}`}>
                    {games.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}

          {step === 2 && (
            <div className="nhm-section">
              <SpritePreview />
              <label className="nhm-label">Select Method</label>
              <select
                className="nhm-select"
                value={methodId}
                onChange={e => setMethodId(e.target.value)}
              >
                <option value="">— choose a method —</option>
                {availableMethods.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          )}

          {step === 3 && (
            <div className="nhm-section">
              <SpritePreview />
              <label className="nhm-label">Modifiers</label>
              {availableModifiers.length === 0 ? (
                <p className="nhm-empty">No modifiers available for this game.</p>
              ) : (
                <div className="nhm-modifiers">
                  {availableModifiers.map(m => (
                    <label key={m.id} className="nhm-modifier">
                      <input
                        type="checkbox"
                        checked={modifiers.includes(m.id)}
                        onChange={() => toggleModifier(m.id)}
                      />
                      {m.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="nhm-footer">
          {step > 0 && (
            <button className="nhm-btn nhm-btn--secondary" onClick={handleBack}>
              Back
            </button>
          )}
          <div className="nhm-footer-right">
            {step < STEPS.length - 1 ? (
              <button
                className="nhm-btn nhm-btn--primary"
                onClick={handleNext}
                disabled={!canAdvance()}
              >
                Next
              </button>
            ) : (
              <button className="nhm-btn nhm-btn--start" onClick={handleStart}>
                Start Hunt
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

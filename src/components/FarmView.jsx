import { useEffect, useRef, useState } from 'react';
import { getSpriteUrl } from '../utils/sprites';
import HuntSummaryModal from './HuntSummaryModal';
import './FarmView.css';

const MAP_URL     = '/tilesets/vortexfarm-bg-0.1.json';
const TILESET_URL = '/tilesets/Outside.png';
const SCALE       = 2;
const TILE        = 16;
const MAP_W       = 30;
const MAP_H       = 20;
const CANVAS_W    = MAP_W * TILE * SCALE; // 960
const CANVAS_H    = MAP_H * TILE * SCALE; // 640
const TILE_PX      = TILE * SCALE;   // 32 — one rendered tile
const MIN_SPRITE   = TILE_PX;        // 32px minimum
const MAX_SPRITE   = TILE_PX * 4;   // 128px maximum (4× min)
const DEFAULT_SPRITE = TILE_PX * 2; // 64px default
const PADDING     = 50;
// Interval roughly matches the 0.8s alternate bounce cycle (1.6s full cycle)
const MOVE_INTERVAL = 1600;

const DIRS = [
  { dx:  TILE_PX, dy: 0        },
  { dx: -TILE_PX, dy: 0        },
  { dx:  0,       dy:  TILE_PX },
  { dx:  0,       dy: -TILE_PX },
];

function randomTilePos() {
  const stepsX = Math.floor((CANVAS_W - PADDING * 2 - DEFAULT_SPRITE) / TILE_PX);
  const stepsY = Math.floor((CANVAS_H - PADDING * 2 - DEFAULT_SPRITE) / TILE_PX);
  return {
    x: PADDING + Math.floor(Math.random() * (stepsX + 1)) * TILE_PX,
    y: PADDING + Math.floor(Math.random() * (stepsY + 1)) * TILE_PX,
  };
}

export default function FarmView({ caughtHunts, onBack }) {
  const canvasRef      = useRef(null);
  const huntsRef       = useRef(caughtHunts);
  const spriteSizeRef  = useRef(DEFAULT_SPRITE);
  const [mapData,      setMapData]      = useState(null);
  const [tilesetImg,   setTilesetImg]   = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [positions,    setPositions]    = useState(() =>
    Object.fromEntries(caughtHunts.map(h => [h.id, randomTilePos()]))
  );
  const [summaryHunt,  setSummaryHunt]  = useState(null);
  const [spriteSize,   setSpriteSize]   = useState(DEFAULT_SPRITE);
  const [optionsOpen,  setOptionsOpen]  = useState(false);
  const [pendingSize,  setPendingSize]  = useState(DEFAULT_SPRITE);

  // Keep refs current so interval callbacks never go stale
  useEffect(() => { huntsRef.current = caughtHunts; }, [caughtHunts]);
  useEffect(() => { spriteSizeRef.current = spriteSize; }, [spriteSize]);

  // Sync positions when caughtHunts changes (new catch or clear)
  useEffect(() => {
    setPositions(prev => {
      const next = { ...prev };
      let changed = false;
      for (const h of caughtHunts) {
        if (!next[h.id]) { next[h.id] = randomTilePos(); changed = true; }
      }
      const ids = new Set(caughtHunts.map(h => h.id));
      for (const id of Object.keys(next)) {
        if (!ids.has(id)) { delete next[id]; changed = true; }
      }
      return changed ? next : prev;
    });
  }, [caughtHunts]);

  // Movement: every bounce cycle, each Pokémon has 35% chance to shift one tile
  useEffect(() => {
    const id = setInterval(() => {
      setPositions(prev => {
        const next = { ...prev };
        let moved = false;
        for (const h of huntsRef.current) {
          if (Math.random() >= 0.35) continue;
          const cur = next[h.id];
          if (!cur) continue;
          const dir = DIRS[Math.floor(Math.random() * DIRS.length)];
          const sz = spriteSizeRef.current;
          const nx = Math.max(PADDING, Math.min(CANVAS_W - PADDING - sz, cur.x + dir.dx));
          const ny = Math.max(PADDING, Math.min(CANVAS_H - PADDING - sz, cur.y + dir.dy));
          if (nx !== cur.x || ny !== cur.y) { next[h.id] = { x: nx, y: ny }; moved = true; }
        }
        return moved ? next : prev;
      });
    }, MOVE_INTERVAL);
    return () => clearInterval(id);
  }, []); // runs once; hunts accessed via ref

  // Fetch map JSON
  useEffect(() => {
    fetch(MAP_URL)
      .then(r => { if (!r.ok) throw new Error(`Map fetch failed: ${r.status}`); return r.json(); })
      .then(setMapData)
      .catch(e => setError(e.message));
  }, []);

  // Load tileset image
  useEffect(() => {
    if (!mapData) return;
    const img = new Image();
    img.src = TILESET_URL;
    img.onload  = () => { setTilesetImg(img); setLoading(false); };
    img.onerror = () => setError('Failed to load tileset image.');
  }, [mapData]);

  // Draw tile layers
  useEffect(() => {
    if (!mapData || !tilesetImg || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    const tileset = mapData.tilesets[0];
    const { firstgid, columns, tilewidth, tileheight } = tileset;

    for (const layer of mapData.layers) {
      if (layer.type !== 'tilelayer') continue;
      layer.data.forEach((gid, i) => {
        if (gid === 0) return;
        const idx  = gid - firstgid;
        const srcX = (idx % columns) * tilewidth;
        const srcY = Math.floor(idx / columns) * tileheight;
        const dstX = (i % MAP_W) * tilewidth  * SCALE;
        const dstY = Math.floor(i / MAP_W) * tileheight * SCALE;
        ctx.drawImage(tilesetImg, srcX, srcY, tilewidth, tileheight, dstX, dstY, tilewidth * SCALE, tileheight * SCALE);
      });
    }
  }, [mapData, tilesetImg]);

  function handleOptionsOk() {
    setSpriteSize(pendingSize);
    setOptionsOpen(false);
  }

  function handleOptionsOpen() {
    setPendingSize(spriteSize);
    setOptionsOpen(true);
  }

  return (
    <div className="fv-root">
      <button className="fv-back-btn" onClick={onBack}>← Back</button>
      <button className="fv-options-btn" onClick={handleOptionsOpen}>⚙</button>

      {loading && !error && <div className="fv-status">Loading map…</div>}
      {error   && <div className="fv-status fv-status--error">Error: {error}</div>}

      <div className="fv-canvas-wrapper">
        <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className="fv-canvas" />

        {!loading && caughtHunts.map((hunt, idx) => {
          const pos = positions[hunt.id];
          if (!pos) return null;
          return (
            <div
              key={hunt.id}
              className="fv-sprite-wrap"
              style={{ left: pos.x, top: pos.y, width: spriteSize, height: spriteSize }}
              onClick={() => setSummaryHunt(hunt)}
            >
              <img
                src={getSpriteUrl(hunt.pokemon.id, true)}
                alt={hunt.pokemon.name}
                className="fv-sprite"
                style={{ animationDelay: `${idx * 0.3}s`, width: spriteSize, height: spriteSize }}
              />
            </div>
          );
        })}

        {!loading && caughtHunts.length === 0 && (
          <div className="fv-empty">Catch your first shiny to see it here!</div>
        )}
      </div>

      {optionsOpen && (
        <div className="fv-options-overlay" onClick={() => setOptionsOpen(false)}>
          <div className="fv-options-panel" onClick={e => e.stopPropagation()}>
            <div className="fv-options-title">Options</div>

            <div className="fv-options-row">
              <label className="fv-options-label">Pokémon Size</label>
              <div className="fv-options-slider-row">
                <input
                  type="range"
                  min={MIN_SPRITE}
                  max={MAX_SPRITE}
                  step={8}
                  value={pendingSize}
                  onChange={e => setPendingSize(Number(e.target.value))}
                  className="fv-options-slider"
                />
                <span className="fv-options-value">{pendingSize}px</span>
              </div>
            </div>

            <div className="fv-options-actions">
              <button className="fv-options-cancel" onClick={() => setOptionsOpen(false)}>Cancel</button>
              <button className="fv-options-ok" onClick={handleOptionsOk}>OK</button>
            </div>
          </div>
        </div>
      )}

      {summaryHunt && (
        <HuntSummaryModal hunt={summaryHunt} onClose={() => setSummaryHunt(null)} />
      )}
    </div>
  );
}

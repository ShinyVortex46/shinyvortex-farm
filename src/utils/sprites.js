const BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const CRIES_BASE = 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest';

export function getSpriteUrl(id, isShiny = false) {
  return isShiny ? `${BASE}/shiny/${id}.png` : `${BASE}/${id}.png`;
}

export function getCryUrl(id) {
  return `${CRIES_BASE}/${id}.ogg`;
}

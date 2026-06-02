// Fetches the full Pokémon list from PokeAPI and writes src/data/pokemon.json.
// Run with: node scripts/fetchPokemon.js

const { writeFileSync } = require('fs');
const { resolve } = require('path');

const OUT_PATH = resolve(__dirname, '../src/data/pokemon.json');

(async () => {
  const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
  if (!res.ok) throw new Error(`PokeAPI request failed: ${res.status}`);

  const { results } = await res.json();

  const pokemon = results
    .map(({ name, url }) => {
      // URL format: https://pokeapi.co/api/v2/pokemon/{id}/
      const id = parseInt(url.split('/').filter(Boolean).at(-1), 10);
      return { id, name };
    })
    .sort((a, b) => a.id - b.id);

  writeFileSync(OUT_PATH, JSON.stringify(pokemon, null, 2));
  console.log(`Wrote ${pokemon.length} Pokémon to ${OUT_PATH}`);
})();

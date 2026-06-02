// Fetches the full enriched Pokémon list from PokeAPI and writes src/data/pokemon.json.
// Run with: node scripts/fetchPokemon.js

const { writeFileSync } = require('fs');
const { resolve } = require('path');

const OUT_PATH = resolve(__dirname, '../src/data/pokemon.json');

const GEN_RANGES = [
  { gen: 1, max: 151  },
  { gen: 2, max: 251  },
  { gen: 3, max: 386  },
  { gen: 4, max: 493  },
  { gen: 5, max: 649  },
  { gen: 6, max: 721  },
  { gen: 7, max: 809  },
  { gen: 8, max: 905  },
  { gen: 9, max: Infinity },
];

function getGen(id) {
  return GEN_RANGES.find(r => id <= r.max).gen;
}

// PokeAPI version name → our game id
const VERSION_MAP = {
  'diamond':          'diamond',
  'pearl':            'pearl',
  'platinum':         'platinum',
  'heartgold':        'heartgold',
  'soulsilver':       'soulsilver',
  'black':            'black',
  'white':            'white',
  'black-2':          'black2',
  'white-2':          'white2',
  'x':                'x',
  'y':                'y',
  'omega-ruby':       'omega-ruby',
  'alpha-sapphire':   'alpha-sapphire',
  'sun':              'sun',
  'moon':             'moon',
  'ultra-sun':        'ultra-sun',
  'ultra-moon':       'ultra-moon',
  'lets-go-pikachu':  'lets-go-pikachu',
  'lets-go-eevee':    'lets-go-eevee',
  'sword':            'sword',
  'shield':           'shield',
  'brilliant-diamond':'brilliant-diamond',
  'shining-pearl':    'shining-pearl',
  'scarlet':          'scarlet',
  'violet':           'violet',
};

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

(async () => {
  // 1. Fetch the full list to get names + ids
  console.log('Fetching Pokémon list…');
  const listRes = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
  if (!listRes.ok) throw new Error(`List fetch failed: ${listRes.status}`);
  const { results } = await listRes.json();

  const base = results
    .map(({ name, url }) => ({
      id: parseInt(url.split('/').filter(Boolean).at(-1), 10),
      name,
    }))
    .sort((a, b) => a.id - b.id);

  // 2. Enrich each entry individually
  const pokemon = [];

  for (let i = 0; i < base.length; i++) {
    const { id, name } = base[i];
    process.stdout.write(`\rFetching ${i + 1}/${base.length}: ${name}              `);

    const detailRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    if (!detailRes.ok) throw new Error(`Detail fetch failed for #${id} (${name}): ${detailRes.status}`);
    const detail = await detailRes.json();

    const availableGames = (detail.game_indices ?? [])
      .map(gi => VERSION_MAP[gi.version.name])
      .filter(Boolean);  // drop versions not in our map

    pokemon.push({
      id,
      name,
      generation: getGen(id),
      availableGames,
    });

    if (i < base.length - 1) await sleep(100);
  }

  process.stdout.write('\n');
  writeFileSync(OUT_PATH, JSON.stringify(pokemon, null, 2));
  console.log(`Done — wrote ${pokemon.length} Pokémon to ${OUT_PATH}`);
})();

// Modifiers that affect shiny odds on top of a method's base odds.
// extraRolls: additional RNG rolls per encounter (the game rolls multiple
//   times and a shiny triggers if any roll hits, which approximates adding
//   extraRolls/4096 to the base probability).
// games: game ids this modifier exists in, or ["all"].

export const MODIFIERS = [
  {
    id: 'shiny-charm',
    name: 'Shiny Charm',
    // Adds 2 extra rolls → effective odds become roughly 3/4096 (~1/1365)
    // for random encounters and stack on top of Masuda to give 6/4096.
    extraRolls: 2,
    games: ['all'],
  },
  {
    id: 'lure',
    name: 'Lure',
    // Doubles the shiny rate in Let's Go while active in a chain.
    // Exact mechanic: adds 1 extra roll per encounter on top of chain bonus.
    extraRolls: 1,
    games: ['lets-go'],
  },
];

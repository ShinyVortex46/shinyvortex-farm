// Hunting methods available in the tracker.
// baseOdds: the base probability as a fraction string (display only).
// usesCounter: whether encounter count is tracked for this method.
// modifiers: modifier ids that can apply to this method.
// games: game ids this method is available in, or ["all"].

export const METHODS = [
  {
    id: 'random-encounter',
    name: 'Random Encounter',
    baseOdds: '1/4096',
    usesCounter: true,
    modifiers: ['shiny-charm'],
    games: ['all'],
  },
  {
    id: 'masuda',
    name: 'Masuda Method',
    baseOdds: '1/683',
    usesCounter: true,
    modifiers: ['shiny-charm'],
    games: ['gen4', 'gen5', 'gen6', 'gen7', 'gen8', 'gen9'],
  },
];

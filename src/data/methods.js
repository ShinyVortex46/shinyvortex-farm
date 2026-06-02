// Hunting methods available in the tracker.
// To find which games support a given method, filter GAMES by
// availableMethods.includes(method.id) — do not duplicate that logic here.
// baseOdds: the base probability as a fraction string (display only).
// usesCounter: whether encounter count is tracked for this method.
// modifiers: modifier ids that can apply to this method.

export const METHODS = [
  {
    id: 'random-encounter',
    name: 'Random Encounter',
    baseOdds: '1/4096',
    usesCounter: true,
    modifiers: ['shiny-charm'],
  },
  {
    id: 'masuda',
    name: 'Masuda Method',
    baseOdds: '1/683',
    usesCounter: true,
    modifiers: ['shiny-charm'],
  },
];

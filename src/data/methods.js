// Hunting methods available in the tracker.
// To find which games support a given method, filter GAMES by
// availableMethods.includes(method.id) — do not duplicate that logic here.
// baseOdds: generation-split odds. pre6 = gens 1-5 (8192 roll universe);
//   gen6plus = gens 6+ (4096 roll universe). computeOdds() picks the key.
// usesCounter: whether encounter count is tracked for this method.
// modifiers: modifier ids that can apply to this method.

export const METHODS = [
  {
    id: 'random-encounter',
    name: 'Random Encounter',
    baseOdds: { pre6: '1/8192', gen6plus: '1/4096' },
    usesCounter: true,
    modifiers: ['shiny-charm'],
  },
  {
    id: 'masuda',
    name: 'Masuda Method',
    // pre6: 5 rolls out of 8192 (gen 4-5); gen6plus: 6 rolls out of 4096
    baseOdds: { pre6: '1/1639', gen6plus: '1/683' },
    usesCounter: true,
    modifiers: ['shiny-charm'],
  },
];

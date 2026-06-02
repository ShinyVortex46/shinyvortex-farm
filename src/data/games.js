// Each entry is an individual game selectable during hunt creation.
// methodGroup: shared id used for method/odds lookups — paired games
//   (e.g. Diamond and Pearl) share the same group since their mechanics
//   are identical, but each has its own id so hunts can record the exact game.

export const GAMES = [
  // Gen 4
  { id: 'diamond',       name: 'Diamond',                    generation: 4, methodGroup: 'diamond-pearl',       availableMethods: ['random-encounter', 'masuda'] },
  { id: 'pearl',         name: 'Pearl',                      generation: 4, methodGroup: 'diamond-pearl',       availableMethods: ['random-encounter', 'masuda'] },
  { id: 'platinum',      name: 'Platinum',                   generation: 4, methodGroup: 'platinum',            availableMethods: ['random-encounter', 'masuda'] },
  { id: 'heartgold',     name: 'HeartGold',                  generation: 4, methodGroup: 'heartgold-soulsilver',availableMethods: ['random-encounter', 'masuda'] },
  { id: 'soulsilver',    name: 'SoulSilver',                 generation: 4, methodGroup: 'heartgold-soulsilver',availableMethods: ['random-encounter', 'masuda'] },

  // Gen 5
  { id: 'black',         name: 'Black',                      generation: 5, methodGroup: 'black-white',         availableMethods: ['random-encounter', 'masuda'] },
  { id: 'white',         name: 'White',                      generation: 5, methodGroup: 'black-white',         availableMethods: ['random-encounter', 'masuda'] },
  { id: 'black2',        name: 'Black 2',                    generation: 5, methodGroup: 'black2-white2',       availableMethods: ['random-encounter', 'masuda'] },
  { id: 'white2',        name: 'White 2',                    generation: 5, methodGroup: 'black2-white2',       availableMethods: ['random-encounter', 'masuda'] },

  // Gen 6
  { id: 'x',             name: 'X',                          generation: 6, methodGroup: 'xy',                  availableMethods: ['random-encounter', 'masuda'] },
  { id: 'y',             name: 'Y',                          generation: 6, methodGroup: 'xy',                  availableMethods: ['random-encounter', 'masuda'] },
  { id: 'omega-ruby',    name: 'Omega Ruby',                 generation: 6, methodGroup: 'oras',                availableMethods: ['random-encounter', 'masuda'] },
  { id: 'alpha-sapphire',name: 'Alpha Sapphire',             generation: 6, methodGroup: 'oras',                availableMethods: ['random-encounter', 'masuda'] },

  // Gen 7
  { id: 'sun',           name: 'Sun',                        generation: 7, methodGroup: 'sun-moon',            availableMethods: ['random-encounter', 'masuda'] },
  { id: 'moon',          name: 'Moon',                       generation: 7, methodGroup: 'sun-moon',            availableMethods: ['random-encounter', 'masuda'] },
  { id: 'ultra-sun',     name: 'Ultra Sun',                  generation: 7, methodGroup: 'usum',                availableMethods: ['random-encounter', 'masuda'] },
  { id: 'ultra-moon',    name: 'Ultra Moon',                 generation: 7, methodGroup: 'usum',                availableMethods: ['random-encounter', 'masuda'] },
  { id: 'lets-go-pikachu',name: "Let's Go Pikachu",          generation: 7, methodGroup: 'lets-go',            availableMethods: ['random-encounter'] },
  { id: 'lets-go-eevee', name: "Let's Go Eevee",             generation: 7, methodGroup: 'lets-go',            availableMethods: ['random-encounter'] },

  // Gen 8
  { id: 'sword',         name: 'Sword',                      generation: 8, methodGroup: 'sword-shield',        availableMethods: ['random-encounter', 'masuda'] },
  { id: 'shield',        name: 'Shield',                     generation: 8, methodGroup: 'sword-shield',        availableMethods: ['random-encounter', 'masuda'] },
  { id: 'brilliant-diamond', name: 'Brilliant Diamond',      generation: 8, methodGroup: 'bdsp',                availableMethods: ['random-encounter', 'masuda'] },
  { id: 'shining-pearl', name: 'Shining Pearl',              generation: 8, methodGroup: 'bdsp',                availableMethods: ['random-encounter', 'masuda'] },

  // Gen 9
  { id: 'scarlet',       name: 'Scarlet',                    generation: 9, methodGroup: 'scarlet-violet',      availableMethods: ['random-encounter', 'masuda'] },
  { id: 'violet',        name: 'Violet',                     generation: 9, methodGroup: 'scarlet-violet',      availableMethods: ['random-encounter', 'masuda'] },
];

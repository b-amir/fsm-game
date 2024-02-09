import { createMachine, createActor, assign } from "xstate";

const witcherMachine = createMachine({
  id: 'witcher',
  initial: 'relaxed',
  context: {
    enchantmentLevel: 0
  },

  states: {
    relaxed: {
      on: {
        CONSUME: [
          { target: 'enchanted.battleReady.powerful', cond: 'lvl10to40', actions: ['consume', 'speak'] },
          { target: 'enchanted.battleReady.beastMode', cond: 'lvl40to70', actions: ['consume', 'speak'] },
          { target: 'enchanted.sick', cond: 'lvlAbove70', actions: ['consume', 'speak'] }
        ]
      }
    },

    enchanted: {
      initial: 'battleReady',
      states: {

        battleReady: {
          initial: 'powerful',
          states: {
            powerful: {
              on: {
                CONSUME: [
                  { target: 'beastMode', cond: 'lvl40to70', actions: ['consume', 'speak'] },
                ],
              }
            },

            beastMode: {
              on: {
                CONSUME: [
                  { target: 'powerful', cond: 'lvl10to40', actions: ['consume', 'speak'] },
                  { target: '#witcher.passedOut', cond: 'lvlAbove70', actions: ['consume', 'speak'] }
                ]
              },
            },
          }
        },

        sick: {
          on: {
            CONSUME: [
              { target: 'battleReady', cond: 'lvlBelow70', actions: ['consume', 'speak'] },
              { target: '#witcher.dead', actions: ['consume', 'speak'] }
            ],
          }
        }
      },

      on: {
        CONSUME: [
          { target: 'relaxed', cond: 'lvlBelow10', actions: ['consume', 'speak'] }
        ],
        THROWUP: [
          { target: '#witcher.relaxed', actions: ['throwup', 'speak'] }
        ],
      }
    },

    passedOut: {
      on: {
        WAKE_UP: { target: '#witcher.enchanted.sick', actions: ['wakeup', 'speak'] }
      }
    },

    dead: { type: 'final' }
  }
},
  {
    actions: {
      speak: (context) => {
        const { enchantmentLevel: en_lvl } = context?.context
        function lofState(state) {
          console.log(`State: ${state}. Enchantment level: ${en_lvl}`);
        }
        if (en_lvl < 10) {
          lofState('relaxed');
        } else if (en_lvl < 40) {
          lofState('powerful');
        } else if (en_lvl < 70) {
          lofState('beastMode');
        } else {
          lofState('sick');
        }
      },
      wakeup: assign({
        enchantmentLevel: (context) => {
          context.enchantmentLevel - Math.floor(context.enchantmentLevel * 0.5)
        }
      }),
      throwup: assign({
        enchantmentLevel: (context) => {
          return Math.floor(Math.random() * 10)
        }
      }),
      consume: assign({
        enchantmentLevel: (context) => {
          const { enchantmentLevel } = context.context;
          const { potion } = context.event;
          if (potion.type === 'magical') {
            return enchantmentLevel + potion.power + Math.floor(Math.random() * 20);
          }
          if (potion.type === 'medical') {
            return Math.max(0, enchantmentLevel - potion.power - Math.floor(Math.random() * 20));
          }
        }
      })
    },

    guards: {
      lvlBelow10: (context) => context.enchantmentLevel < 10,
      lvl10to40: (context) => context.enchantmentLevel >= 10 && context.enchantmentLevel < 40,
      lvl40to70: (context) => context.enchantmentLevel >= 40 && context.enchantmentLevel < 70,
      lvlAbove70: (context) => context.enchantmentLevel >= 70,
      lvlBelow70: (context) => context.enchantmentLevel < 70
    }
  });


// the potions
const mysticMoonshine = {
  type: "magical",
  name: "Mystic Moonshine",
  power: 11,
  color: "#FDD932",
  emoji: "✨",
};

const dragonfireBrew = {
  type: "magical",
  name: "Dragonfire Brew",
  power: 16,
  color: "#db522c",
  emoji: "🥃",
};

const revitalizingTonic = {
  type: "medical",
  name: "Revitalizing Tonic",
  power: 8,
  color: "#2cf246",
  emoji: "🍃",
};

// Create and start the actor from the Witcher machine
const geraltActor = createActor(witcherMachine);
geraltActor.start();

geraltActor.send({ type: 'CONSUME', potion: mysticMoonshine });
geraltActor.send({ type: 'CONSUME', potion: dragonfireBrew });
geraltActor.send({ type: 'CONSUME', potion: dragonfireBrew });
geraltActor.send({ type: 'THROWUP' });
geraltActor.send({ type: 'CONSUME', potion: dragonfireBrew });
geraltActor.send({ type: 'CONSUME', potion: revitalizingTonic });
geraltActor.send({ type: 'CONSUME', potion: revitalizingTonic });
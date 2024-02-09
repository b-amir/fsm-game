const machine = {
  state: "RELAXED",
  enchantmentLevel: 0,
  transitions: {
    RELAXED: {
      speak: function (person) {
        this.logState();
        this.logQuote(person, "Hmmm hmmm hmm... mmmmmmmmmmmm... hhhhmm..");
      },
      consume: function (potion, person) {
        this.logState();
        this.logConsumption(potion)
        if (potion.type == "magical") {
          this.logQuote(person, "Let's see what happens!");
          this.enchantmentLevel += Math.floor(Math.random() * 21) + 10; //10 - 30
          this.setState("POWERFULL");
        } else {
          this.logQuote(person, "That was refreshing!");
          if (this.enchantmentLevel > 0) {
            this.enchantmentLevel -= Math.floor(this.enchantmentLevel * 0.5);
          }
        }
      }
    },
    POWERFULL: {
      speak: function (person) {
        this.logState();
        this.logQuote(person, "Huh! I feel funny! Like I'm on fire!");
      },
      consume: function (potion, person) {
        this.logState();
        this.logConsumption(potion)
        if (potion.type == "magical") {
          this.enchantmentLevel += Math.floor(Math.random() * 21) + 10; //20 - 60
          this.logQuote(person, "Ahhhhh! Whats happening to my body?");
          this.setState("BEAST_MODE");
        } else {
          this.enchantmentLevel -= Math.floor(this.enchantmentLevel * 0.5);
          this.logQuote(person, "Poof! That was something!");
          this.setState("RELAXED");
        }
      }
    },
    BEAST_MODE: {
      speak: function (person) {
        this.logState();
        this.logQuote(person, "Holy water cannot help you now, Thousand armies couldn't keep me out!");
      },
      consume: function (potion, person) {
        this.logState();
        this.logConsumption(potion)
        if (potion.type == "magical") {
          this.enchantmentLevel += Math.floor(Math.random() * 21) + 10; // 30 - 90
          if (this.enchantmentLevel > 70) {
            this.dispatch("throwup", [person]);
          } else {
            this.dispatch("passout", [person]);
          }
        } else {
          this.enchantmentLevel -= Math.floor(this.enchantmentLevel * 0.5);
          this.setState("POWERFULL");
        }
      },
      passout: function (person) {
        this.logQuote(person, "I'm passing out...");
        this.setState("PASSED_OUT");
      },
      throwup: function (person) {
        this.logQuote(person, "Bad idea! *vomits*");
        this.dispatch("passout", [person]);
      }
    },
    PASSED_OUT: {
      speak: function (person) {
        this.logState();
        this.logQuote(person, "ZZZZzzzzzzzZZZzzzzzzzZZZzzzzzzz");
      },
      wake: function () {
        this.enchantmentLevel -= Math.floor(this.enchantmentLevel * 0.5);
        this.logState();
        console.log("🥱\tWaking up...");
        this.setState("SICK");
      }
    },
    SICK: {
      speak: function (person) {
        this.logState();
        this.logQuote(person, "I feel sick. I need medicine.");
      },
      consume: function (potion, person) {
        this.logState();
        this.logConsumption(potion)
        if (potion.type == "magical") {
          this.logQuote(person, "Ah! Here we go again!");
          this.enchantmentLevel += Math.floor(Math.random() * 21) + 10;
          this.setState("POWERFULL");
        } else {
          this.logQuote(person, `Never again ${person.name}! That was awful!`);
          this.enchantmentLevel -= Math.floor(this.enchantmentLevel * 0.5);
          this.setState("RELAXED");
        }
      }
    }
  },

  dispatch(actionName, ...payload) {
    const action = this.transitions[this.state][actionName];

    if (action) {
      action.apply(machine, ...payload);
    } else {
      console.error(`invalid action ${actionName} for state ${this.state}`);
    }
  },

  setState(newState) {
    //validate that newState actually exists
    this.state = newState;
  },

  logQuote(person, message) {
    console.log(`💬\t${person.name}: ${message}`);
  },
  logState() {
    console.log(`%cstatus:${this.state} | enchantment:${this.enchantmentLevel}`, "color: gray");
  },
  logConsumption(potion) {
    console.log(`${potion.emoji} \t%cconsuming ${potion.type} potion`, `color: ${potion.color}`);
  }
};

const Geralt = Object.create(machine, {
  name: {
    writable: false,
    enumerable: true,
    value: "Geralt"
  }
});

const potion = {
  type: "magical",
  color: "#FDD932",
  emoji: "✨"
};

const medicine = {
  type: "medical",
  color: "#2cf246",
  emoji: "🍃"
};

function consumeAndSpeak(potionType) {
  Geralt.dispatch("consume", [potionType, Geralt]);
  Geralt.dispatch("speak", [Geralt]);
}

Geralt.dispatch("speak", [Geralt]);
consumeAndSpeak(potion);
consumeAndSpeak(potion);
consumeAndSpeak(potion);
Geralt.dispatch("wake", [Geralt]);
consumeAndSpeak(medicine);
Geralt.dispatch("fly", [Geralt]);
consumeAndSpeak(medicine);
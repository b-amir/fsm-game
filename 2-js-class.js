class WitcherMachine {
  constructor(name) {
    this.name = name;
    this.state = "RELAXED"; // initial
    this.enchantmentLevel = 0; // initial
    this.transitions = {
      RELAXED: {
        speak: this.speak.bind(this, "Hmmm hmmm hmm... mmmmmmmmmmmm... hhhhmm.. 🎶"),
        consume: this.consume.bind(this),
      },
      POWERFUL: {
        speak: this.speak.bind(this, "Huh! I feel funny! Like I'm on fire! 💪"),
        consume: this.consume.bind(this),
      },
      BEAST_MODE: {
        speak: this.speak.bind(this, "Holy water cannot help you now, Thousand armies couldn't keep me out! ⚔️"),
        consume: this.consume.bind(this),
        throwup: this.throwup.bind(this),
        passout: this.passout.bind(this),
      },
      PASSED_OUT: {
        speak: this.speak.bind(this, "ZZZZzzzzzzzZZZzzzzzzzZZZzzzzzzz 😴"),
        wake: this.wake.bind(this),
      },
      SICK: {
        speak: this.speak.bind(this, "I feel sick. I need medicine. 🤢"),
        consume: this.consume.bind(this),
      },
    };
  }

  dispatch(actionName, ...payload) {
    const action = this.transitions[this.state][actionName];
    if (action) {
      action.apply(this, payload);
    } else {
      console.error(`Invalid action ${actionName} for state ${this.state}`);
    }
  }

  setState(newState) {
    if (this.transitions[newState]) {
      this.state = newState;
    } else {
      console.error(`Invalid state ${newState}`);
    }
  }

  speak(message) {
    this.logState();
    this.logQuote(message);
  }

  consume(potion) {
    this.logState();
    this.logConsumption(potion);
    if (potion.type == "magical") {
      this.enchantmentLevel += Math.floor(Math.random() * 21) + potion.power; //10 - 30
      if (this.state === "BEAST_MODE") {
        this.enchantmentLevel += 10; // Additional 10 for BEAST_MODE
        if (this.enchantmentLevel > 70) {
          this.dispatch("throwup");
          return;
        }
      } else if (this.state === "POWERFUL") {
        this.logQuote("Ahhhhh! Whats happening to my body? 😵‍💫");
        this.setState("BEAST_MODE");
        return;
      } else {
        this.logQuote("Let's see what happens!");
        this.setState("POWERFUL");
        return;
      }
    } else {
      this.logQuote(this.state === "BEAST_MODE" ? "Bad idea! *vomits* 🤮" : "That was refreshing! 😌");
      if (this.enchantmentLevel > 0) {
        this.enchantmentLevel -= Math.floor(this.enchantmentLevel * 0.5 * potion.power / 10);
      }
      if (this.state === "BEAST_MODE") {
        this.dispatch("passout");
        return;
      } else {
        this.setState("RELAXED");
        return;
      }
    }
  }

  passout() {
    this.logQuote("I'm passing out... 🙃");
    this.setState("PASSED_OUT");
  }

  throwup() {
    this.logQuote("Bad idea! *vomits* 🤮");
    this.dispatch("passout");
  }

  wake() {
    this.enchantmentLevel -= Math.floor(this.enchantmentLevel * 0.5);
    this.logState();
    console.log("🥱\tWaking up...");
    this.setState("SICK");
  }

  logQuote(message) {
    console.log(`💬\t${this.name}: ${message}`);
  }

  logState() {
    console.log(`%cStatus:${this.state} | Enchantment:${this.enchantmentLevel}`, "color: gray");
  }

  logConsumption(potion) {
    console.log(`${potion.emoji} \t%cconsuming ${potion.name}`, `color: ${potion.color}`);
  }
}

const Geralt = new WitcherMachine("Geralt");

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
  power: 5,
  color: "#2cf246",
  emoji: "🍃",
};

function drinkAndFeedback(potionName) {
  Geralt.dispatch("consume", potionName);
  Geralt.dispatch("speak");
}

function action(actionName) {
  Geralt.dispatch(actionName);
}

action("speak");
drinkAndFeedback(mysticMoonshine);
drinkAndFeedback(dragonfireBrew);
drinkAndFeedback(dragonfireBrew);
action("wake");
drinkAndFeedback(revitalizingTonic);
action("fly");
drinkAndFeedback(revitalizingTonic);

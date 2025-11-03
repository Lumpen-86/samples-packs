const sampleBanks = [
  [
    ["kick", "snare", "hat", "clap", "perc", "bass", "chord", "fx1"],
    ["vox1", "vox2", "stab1", "stab2", "pad1", "pad2", "fx2", "fx3"],
    ["loop1", "loop2", "loop3", "loop4", "loop5", "loop6", "loop7", "loop8"],
    ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"],
    ["beat1", "beat2", "beat3", "beat4", "beat5", "beat6", "beat7", "beat8"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
  ],
  [
    ["kick2", "snare2", "hat2", "clap2", "perc2", "bass2", "chord2", "fxA"],
    ["voxA", "voxB", "stabA", "stabB", "padA", "padB", "fxB", "fxC"],
    ["loopA", "loopB", "loopC", "loopD", "loopE", "loopF", "loopG", "loopH"],
    ["sA", "sB", "sC", "sD", "sE", "sF", "sG", "sH"],
    ["beatA", "beatB", "beatC", "beatD", "beatE", "beatF", "beatG", "beatH"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
  ],
];

let currentBank = 0;
let midiOut, midiIn;

// --- Fonction principale ---
async function initLaunchpadStrudel() {
  if (!navigator.requestMIDIAccess) {
    console.error("WebMIDI non supporté dans ce navigateur.");
    return;
  }

  const access = await navigator.requestMIDIAccess();
  midiIn = [...access.inputs.values()].find(i =>
    i.name.toLowerCase().includes("launchpad")
  );
  midiOut = [...access.outputs.values()].find(o =>
    o.name.toLowerCase().includes("launchpad")
  );

  if (!midiIn || !midiOut) {
    console.error("Aucun Launchpad détecté.");
    return;
  }

  console.log("✅ Connecté à :", midiIn.name);

  // --- Fonctions utilitaires ---
  const lightPad = (note, color = 60, duration = 150) => {
    midiOut.send([0x90, note, color]);
    if (duration > 0) setTimeout(() => midiOut.send([0x80, note, 0]), duration);
  };

  const lightAllPads = (color) => {
    for (let n = 0; n < 64; n++) midiOut.send([0x90, n, color]);
  };

  const showBank = () => {
    lightAllPads(0);
    const color = 20 + currentBank * 15; // code couleur par banque
    for (let n = 0; n < 8; n++) midiOut.send([0x90, 104 - n, color]); // barre droite
    midiOut.send([0x90, 7, 15]); // rouge = STOP
    console.log(`🎛️ Banque ${currentBank + 1}/${sampleBanks.length}`);
  };

  const playOneShot = (sample) => {
    // Version one-shot
    if (typeof playSample === "function") {
      playSample(sample); // 🔥 joue une seule fois sans pattern
    } else if (typeof evalInStrudel === "function") {
      evalInStrudel(`s("${sample}")`);
    } else {
      console.warn("⚠️ Impossible de jouer le sample.");
    }
  };

  const sendToStrudel = (cmd) => {
    if (typeof evalInStrudel === "function") evalInStrudel(cmd);
    else console.warn("⚠️ evalInStrudel() non dispo — vérifie Strudel Web.");
  };

  // --- Gestion des événements MIDI ---
  midiIn.onmidimessage = (msg) => {
    const [status, note, velocity] = msg.data;
    const pressed = velocity > 0;
    if (status !== 144 || !pressed) return;

    // Bouton banque suivante
    if (note === 104) {
      currentBank = (currentBank + 1) % sampleBanks.length;
      showBank();
      lightPad(note, 30, 200);
      return;
    }
    // Bouton banque précédente
    if (note === 105) {
      currentBank = (currentBank - 1 + sampleBanks.length) % sampleBanks.length;
      showBank();
      lightPad(note, 30, 200);
      return;
    }

    // Pad STOP global (coin haut droit)
    if (note === 7) {
      sendToStrudel(`silence()`);
      lightPad(note, 15, 400); // rouge vif
      console.log("🛑 Tous les sons stoppés !");
      return;
    }

    // Pads de la grille
    const x = note % 8;
    const y = 7 - Math.floor(note / 8);
    const sample = sampleBanks[currentBank]?.[y]?.[x];
    if (sample) {
      lightPad(note, 90);
      playOneShot(sample);
    }
  };

  showBank();
}

initLaunchpadStrudel();

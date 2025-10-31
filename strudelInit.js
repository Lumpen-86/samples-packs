// === Thème "ArchBTW" ===
setTheme({
  background: "#0b0c10",      // fond noir bleuté
  foreground: "#c5c6c7",      // texte gris clair
  accent: "#1793d1",          // bleu Arch Linux
  fontFamily: "JetBrains Mono",
  fontSize: "14px",
  border: "#1f2833",
  highlight: "#222831",
  cursor: "#1793d1",
  selection: "#1f2833",
  syntax: {
    keyword: "#8e44ad",       // violet pour les fonctions et mots-clés
    variable: "#66ffcc",      // vert menthe pour les variables
    number: "#a29bfe",        // violet clair pour les nombres
    string: "#00ff99",        // vert néon pour les chaînes
    comment: "#5c6370",       // gris bleuté
    operator: "#bb86fc",      // violet plus doux pour les opérateurs
    punctuation: "#26c6da",   // turquoise pour parenthèses, crochets
  },
  patternColors: {
    default: "#8e44ad",   // violet par défaut
    sound: "#00ff99",     // vert fluo pour les sons
    control: "#26c6da",   // bleu clair pour les contrôles
    structure: "#a29bfe", // violet clair pour les structures
  },
})
// === Import automatique de tes samples ===
await import('https://cdn.jsdelivr.net/gh/Lumpen-86/samples-packs@main/mysamples.js')

// === Optionnel : importer d’autres scripts Strudel custom ===
await import('https://cdn.jsdelivr.net/gh/switchangel/strudel-scripts@main/allscripts.js')

// === Petit message de confirmation ===
console.log("🎶 Strudel init chargé avec succès ! Thème + samples personnalisés actifs.")

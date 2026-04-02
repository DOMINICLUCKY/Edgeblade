// js/characters.js

export const characters = {
  flame: {
    id: "flame",
    name: "Kael Ignivar",
    displayName: "IGNIVAR",
    title: "The Inferno Vanguard",
    shortTitle: "Flame Knight",
    weapon: "Pyroclast Edge",
    ability: "Inferno Surge",
    description: "A warrior born from the eternal flames. Kael harnesses destructive power and eternal rebirth.",
    story: `Ignivar was not born — he was forged within a dying volcano. A living embodiment of fire, he once served the Ashen Monks as their executioner, enforcing their will with merciless precision.

But when the order tried to control the very flames they worshipped, Ignivar turned against them. In a single night of molten fury, he reduced his masters to ash.

Now a wandering warrior of burning honor, his body of obsidian and molten blood radiates unstoppable heat. His blade feeds on battle, growing hotter with every strike.

When pushed to his limit, Ignivar unleashes Inferno Surge, erupting into a storm of solar fire that consumes everything in its path.`,
    model: "./assets/characters/flaming_knight.glb",
    image: "./assets/characters/flame.jpeg",
    fog: "./assets/backgrounds/flamefog.png",
    color: 0xff4500,
    lightColor: 0xff6347,
    glowColor: "#ff6347",
    roleColor: "#ff4500"
  },
  shadow: {
    id: "shadow",
    name: "Morryx Shadowveil",
    displayName: "MORVYN SHADEVEIL",
    title: "The Silent Eclipse",
    shortTitle: "Shadow Knight",
    weapon: "Voidfang Blade",
    ability: "Abyss Shift",
    description: "Master of stealth and darkness. Morryx commands the shadows with silent lethality.",
    story: `Morvyn was once a legendary warrior — until a forbidden ritual cast him into the void beyond reality.

What returned was no longer human.

Reforged by living darkness, Morvyn exists between dimensions, a silent predator hunting threats that others cannot even perceive.

His blade does not cut — it erases.

He moves through shadows as if they were pathways, appearing and disappearing at will. Cold, emotionless, unstoppable.

With Abyss Shift, Morvyn dissolves into darkness and emerges from the shadows of his enemy, striking before they can react.`,
    model: "./assets/characters/shadow_knight.glb",
    image: "./assets/characters/shadow.jpeg",
    fog: "./assets/backgrounds/shadowfog.png",
    color: 0x2f4f4f,
    lightColor: 0x4169e1,
    glowColor: "#4169e1",
    roleColor: "#2f4f4f"
  },
  wind: {
    id: "wind",
    name: "Aelith Stormborne",
    displayName: "AELITH STORMBORNE",
    title: "The Wind Sentinel",
    shortTitle: "Wind Warrior",
    weapon: "Gale Twinblades",
    ability: "Tempest Rush",
    description: "Swift as the north wind. Aelith uses speed and tactical precision to outwit enemies.",
    story: `Aelith was trained in the Sky Temple, where speed meant survival. When monstrous harpies destroyed his order, he did not mourn — he adapted.

Binding the spirits of his fallen masters into his flowing scarf, he became something beyond human — a silent force of precision and velocity.

Aelith sees combat as calculation. Every movement, every strike, perfectly optimized. His blades cut before enemies even realize he has moved.

When overwhelmed, he becomes the storm itself.
Tempest Rush turns him into a blur of wind, striking dozens of enemies in a single instant.`,
    model: "./assets/characters/wind_knight.glb",
    image: "./assets/characters/wind.jpeg",
    fog: "./assets/backgrounds/windfog.png",
    color: 0x4db8ff,
    lightColor: 0x87ceeb,
    glowColor: "#4db8ff",
    roleColor: "#00bfff"
  }
};

export const elements = {
  flame: {
    name: "Flame Dominion",
    icon: "🔥",
    traits: ["Power", "Aggression", "Rebirth through destruction"]
  },
  wind: {
    name: "Wind Liberation",
    icon: "🌪️",
    traits: ["Speed", "Precision", "Adaptability"]
  },
  shadow: {
    name: "Shadow Mastery",
    icon: "🌑",
    traits: ["Stealth", "Void Power", "Erasure"]
  }
};

console.log("Characters module ready");

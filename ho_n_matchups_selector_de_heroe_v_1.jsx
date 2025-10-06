import React, { useEffect, useMemo, useRef, useState } from "react";

/** v24 — Added relationships:
 * Electrician↔Swiftblade (BP)
 * King Klout > (Devourer, Pandamonium)
 * Swiftblade > Predator
 * Moraxus > Pollywog Priest
 * Vindicator > Tempest
 * Pharaoh > Rampage (adds to existing)
 * The Chipper > (Thunderbringer, Pyromancer)
 * Bombardier weak vs (Arachna, The Chipper, Accursed, Jereziah)
 * Flux best partners with (Behemoth, Tempest, Soulstealer, Geomancer, Kraken, Solstice, Legionnaire, Hellbringer)
 * Hammerstorm best partners with (Rhapsody, Glacius, Monarch)
 */

const HEROES = [
  "Accursed", "Amun-Ra", "Andromeda", "Arachna", "Armadon", "Behemoth", "Blacksmith", "Bloodhunter", "Bombardier", "Bubbles", "Chronos", "Corrupted Disciple", "Defiler", "Demented Shaman", "Devourer", "Dr. Repulsor", "Drunken Master", "Electrician", "Ellonia", "Empath", "Fayde", "Flint Beastwood", "Flux", "Forsaken Archer", "Gauntlet", "Gemini", "Geomancer", "Glacius", "Grinex", "Gunblade", "Hammerstorm", "Hellbringer", "Jereziah", "Keeper of the Forest", "King Klout", "Kraken", "Legionnaire", "Lodestone", "Magmus", "Magebane", "Maliken", "Martyr", "Midas", "Monarch", "Monkey King", "Moon Queen", "Moraxus", "Myrmidon", "Night Hound", "Nomad", "Nymphora", "Ophelia", "Pandamonium", "Pebbles", "Pestilence", "Pharaoh", "Plague Rider", "Pollywog Priest", "Predator", "Prophet", "Puppet Master", "Pyromancer", "Rampage", "Rhapsody", "Riftwalker", "Sand Wraith", "Scout", "Silhouette", "Sir Benzington", "Slither", "Solstice", "Soul Reaper", "Soulstealer", "Swiftblade", "Tempest", "The Chipper", "The Gladiator", "The Madman", "Thunderbringer", "Torturer", "Tundra", "Valkyrie", "Vindicator", "Voodoo Jester", "War Beast", "Witch Slayer", "Wretched Hag", "Zephyr"
].sort();

const MATCHUPS_BASE = {
  // Existing entries
  "Witch Slayer": {
    synergy: ["Amun-Ra", "Magmus", "Pandamonium"],
    advantage: ["Armadon"],
    disadvantage: ["Swiftblade", "Predator", "Jereziah", "Moraxus", "Pebbles", "Gunblade"]
  },
  "Slither": {
    synergy: ["Demented Shaman", "Amun-Ra", "Swiftblade", "Vindicator", "Arachna"],
    advantage: ["Armadon"],
    disadvantage: ["The Chipper", "Arachna", "Predator", "Swiftblade", "Jereziah", "Accursed", "Pebbles"]
  },
  "Pestilence": {
    synergy: ["Voodoo Jester"],
    advantage: ["Scout", "Night Hound", "Fayde", "Predator"],
    disadvantage: ["Puppet Master"]
  },
  "Pandamonium": {
    synergy: ["Witch Slayer", "Voodoo Jester", "Monarch"],
    advantage: ["Predator"],
    disadvantage: ["Vindicator", "Bubbles", "Fayde"]
  },
  "Arachna": {
    synergy: ["Slither"],
    advantage: ["Flint Beastwood", "Soulstealer"],
    disadvantage: ["Magebane"]
  },
  "Bubbles": {
    synergy: ["Magmus", "Behemoth", "Plague Rider"],
    advantage: ["Pandamonium", "Voodoo Jester", "Monarch", "Hammerstorm", "Rampage", "Myrmidon", "Flint Beastwood", "Andromeda", "Pyromancer"],
    disadvantage: ["Bloodhunter", "Gunblade", "Predator", "Night Hound"]
  },
  "Empath": {
    synergy: ["Predator", "Nomad"],
    advantage: [],
    disadvantage: []
  },
  "Rampage": {
    synergy: [],
    advantage: ["Predator"],
    disadvantage: []
  },
  "Pharaoh": {
    synergy: [],
    advantage: ["Devourer", "Pandamonium", "Rampage"],
    disadvantage: []
  },
  "Magebane": {
    synergy: [],
    advantage: ["Amun-Ra"],
    disadvantage: []
  },
  "Corrupted Disciple": {
    synergy: [],
    advantage: ["Predator"],
    disadvantage: []
  },
  "Glacius": {
    synergy: ["Devourer", "Swiftblade"],
    advantage: [],
    disadvantage: []
  },
  // ===== New entries from user's message =====
  "Electrician": {
    synergy: ["Swiftblade"],
    advantage: [],
    disadvantage: []
  },
  "King Klout": {
    synergy: [],
    advantage: ["Devourer", "Pandamonium"],
    disadvantage: []
  },
  "Swiftblade": {
    synergy: [],
    advantage: ["Predator"],
    disadvantage: []
  },
  "Moraxus": {
    synergy: [],
    advantage: ["Pollywog Priest"],
    disadvantage: []
  },
  "Vindicator": {
    synergy: [],
    advantage: ["Tempest"],
    disadvantage: []
  },
  "The Chipper": {
    synergy: [],
    advantage: ["Thunderbringer", "Pyromancer"],
    disadvantage: []
  },
  "Bombardier": {
    synergy: [],
    advantage: [],
    disadvantage: ["Arachna", "The Chipper", "Accursed", "Jereziah"]
  },
  "Flux": {
    synergy: ["Behemoth", "Tempest", "Soulstealer", "Geomancer", "Kraken", "Solstice", "Legionnaire", "Hellbringer"],
    advantage: [],
    disadvantage: []
  },
  "Hammerstorm": {
    synergy: ["Rhapsody", "Glacius", "Monarch"],
    advantage: [],
    disadvantage: []
  }
};

function deriveMatchups(base) {
  const allHeroes = new Set(HEROES);
  const out = {};
  for (const h of allHeroes) {
    const e = base[h] || {};
    out[h] = {
      synergy: Array.from(new Set(e.synergy || [])),
      advantage: Array.from(new Set(e.advantage || [])),
      disadvantage: Array.from(new Set(e.disadvantage || []))
    };
  }
  for (const a of Object.keys(out)) {
    for (const b of out[a].synergy) {
      if (!allHeroes.has(b)) continue;
      if (!out[b].synergy.includes(a)) out[b].synergy.push(a);
    }
  }
  for (const a of Object.keys(out)) {
    for (const b of out[a].advantage) {
      if (!allHeroes.has(b)) continue;
      if (!out[b].disadvantage.includes(a)) out[b].disadvantage.push(a);
    }
    for (const b of out[a].disadvantage) {
      if (!allHeroes.has(b)) continue;
      if (!out[b].advantage.includes(a)) out[b].advantage.push(a);
    }
  }
  for (const h of Object.keys(out)) {
    const clean = (arr) => Array.from(new Set(arr.filter(x => x && x !== h))).sort();
    out[h].synergy = clean(out[h].synergy);
    out[h].advantage = clean(out[h].advantage);
    out[h].disadvantage = clean(out[h].disadvantage);
  }
  return out;
}

const MATCHUPS = deriveMatchups(MATCHUPS_BASE);

const HERO_IMAGES = {
  "Witch Slayer": "https://i.imgur.com/fvR09eK.png",
  "Armadon": "https://i.imgur.com/5yT5NaM.png",
  "Amun-Ra": "https://i.imgur.com/OOnpuTv.png"
};

const IMAGE_BASE = "./assets/hon";
const IMAGE_EXTS = ["webp", "png", "jpg"];

function Avatar({ name, size = 24 }) {
  const [extIndex, setExtIndex] = useState(0);
  const url = HERO_IMAGES[name] || `${IMAGE_BASE}/${name.replace(/\s+/g, "_")}.${IMAGE_EXTS[extIndex]}`;
  const initials = name.split(" ").map(p => p[0]).join("").slice(0,2).toUpperCase();
  const dim = `${size}px`;
  const tryNext = () => setExtIndex((i) => (i < IMAGE_EXTS.length - 1 ? i + 1 : i));

  return (
    <div style={{ width: dim, height: dim }} className="inline-flex items-center justify-center rounded-lg bg-slate-700 text-slate-100 overflow-hidden flex-shrink-0">
      {extIndex < IMAGE_EXTS.length ? (
        <img src={url} alt={name} decoding="async" onError={tryNext} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span style={{ fontSize: size > 32 ? 14 : 12 }} className="font-semibold">{initials}</span>
      )}
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [selected, setSelected] = useState(null);
  const containerRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = !q ? HEROES : HEROES.filter((h) => h.toLowerCase().includes(q));
    return [...list].sort();
  }, [query]);

  useEffect(() => {
    function onClickOutside(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, []);

  function choose(hero) {
    setSelected(hero);
    setQuery(hero);
    setOpen(false);
    try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch {}
  }

  const data = selected ? MATCHUPS[selected] : null;

  function ResultItem({ hero }) {
    return (
      <button type="button" onClick={() => choose(hero)} className="group w-full text-left flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-slate-700 focus:bg-slate-700 focus:outline-none transition" aria-label={`Open ${hero} matchups`}>
        <Avatar name={hero} />
        <span className="underline decoration-transparent group-hover:decoration-slate-300">{hero}</span>
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold">HoN Matchups</h1>
          <p className="text-slate-400">Hero synergy and matchup finder</p>
        </header>

        <div className="relative" ref={containerRef}>
          <div className="relative flex justify-center">
            <input type="text" placeholder="Search hero…" value={query} onChange={(e) => { setQuery(e.target.value); setOpen(true); }} onFocus={() => { if (selected) { setQuery(""); setSelected(null); } setOpen(true); }} className="w-96 max-w-full rounded-2xl border border-slate-700 bg-slate-800 text-slate-100 placeholder:text-slate-400 pl-4 pr-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400" />
          </div>
          {open && (
            <ul className="absolute z-10 mt-2 max-h-72 w-96 max-w-full left-1/2 -translate-x-1/2 overflow-auto rounded-2xl border border-slate-700 bg-slate-800 p-1 shadow-xl">
              {filtered.map((hero, idx) => (
                <li key={hero} onClick={() => choose(hero)} onMouseEnter={() => setHighlight(idx)} className={`cursor-pointer rounded-xl px-3 py-2 text-sm flex items-center gap-2 ${idx === highlight ? "bg-slate-700" : ""}`}>
                  <Avatar name={hero} />
                  <span>{hero}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected && data && (
          <div className="mt-8 rounded-2xl border border-slate-700 bg-slate-800 p-4 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <Avatar name={selected} size={72} />
              <h2 className="text-2xl font-semibold">{selected}</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="font-semibold">Best Partners</h3>
                <ul className="mt-2 flex flex-col gap-2">
                  {data.synergy.length > 0 ? data.synergy.map((h) => (<li key={h}><ResultItem hero={h} /></li>)) : <li className="text-sm text-slate-400">No data</li>}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Strong Against</h3>
                <ul className="mt-2 flex flex-col gap-2">
                  {data.advantage.length > 0 ? data.advantage.map((h) => (<li key={h}><ResultItem hero={h} /></li>)) : <li className="text-sm text-slate-400">No data</li>}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Weak Against</h3>
                <ul className="mt-2 flex flex-col gap-2">
                  {data.disadvantage.length > 0 ? data.disadvantage.map((h) => (<li key={h}><ResultItem hero={h} /></li>)) : <li className="text-sm text-slate-400">No data</li>}
                </ul>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-10 text-center text-xs text-slate-400">
          <p>Developed by Nicket</p>
          <p>v24 — Added Electrician, King Klout, Swiftblade, Moraxus, Vindicator, Pharaoh, Chipper, Bombardier, Flux, Hammerstorm updates</p>
        </footer>
      </div>
    </div>
  );
}

// ====== Console tests ======
(function runTests() {
  const t = (name, cond) => { if (!cond) throw new Error(name); console.log("✅", name); };
  try {
    // Existing invariants
    t("Synergy symmetry: Witch Slayer ↔ Amun-Ra", MATCHUPS["Witch Slayer"].synergy.includes("Amun-Ra") && MATCHUPS["Amun-Ra"].synergy.includes("Witch Slayer"));
    t("Advantage mirrors: Witch Slayer > Armadon", MATCHUPS["Witch Slayer"].advantage.includes("Armadon") && MATCHUPS["Armadon"].disadvantage.includes("Witch Slayer"));

    // Mirrors from new data
    t("Swiftblade ↔ Electrician best partners", MATCHUPS["Swiftblade"].synergy.includes("Electrician") && MATCHUPS["Electrician"].synergy.includes("Swiftblade"));
    t("King Klout > Devourer (mirror)", MATCHUPS["King Klout"].advantage.includes("Devourer") && MATCHUPS["Devourer"].disadvantage.includes("King Klout"));
    t("King Klout > Pandamonium (mirror)", MATCHUPS["King Klout"].advantage.includes("Pandamonium") && MATCHUPS["Pandamonium"].disadvantage.includes("King Klout"));
    t("Swiftblade > Predator (mirror)", MATCHUPS["Swiftblade"].advantage.includes("Predator") && MATCHUPS["Predator"].disadvantage.includes("Swiftblade"));
    t("Moraxus > Pollywog Priest (mirror)", MATCHUPS["Moraxus"].advantage.includes("Pollywog Priest") && MATCHUPS["Pollywog Priest"].disadvantage.includes("Moraxus"));
    t("Vindicator > Tempest (mirror)", MATCHUPS["Vindicator"].advantage.includes("Tempest") && MATCHUPS["Tempest"].disadvantage.includes("Vindicator"));
    t("Pharaoh > Rampage (mirror)", MATCHUPS["Pharaoh"].advantage.includes("Rampage") && MATCHUPS["Rampage"].disadvantage.includes("Pharaoh"));
    t("The Chipper > Thunderbringer (mirror)", MATCHUPS["The Chipper"].advantage.includes("Thunderbringer") && MATCHUPS["Thunderbringer"].disadvantage.includes("The Chipper"));
    t("The Chipper > Pyromancer (mirror)", MATCHUPS["The Chipper"].advantage.includes("Pyromancer") && MATCHUPS["Pyromancer"].disadvantage.includes("The Chipper"));

    t("Bombardier weak mirrors (Arachna)", MATCHUPS["Arachna"].advantage.includes("Bombardier"));
    t("Bombardier weak mirrors (The Chipper)", MATCHUPS["The Chipper"].advantage.includes("Bombardier"));
    t("Bombardier weak mirrors (Accursed)", MATCHUPS["Accursed"].advantage.includes("Bombardier"));
    t("Bombardier weak mirrors (Jereziah)", MATCHUPS["Jereziah"].advantage.includes("Bombardier"));

    t("Flux best partner set is non-empty", MATCHUPS["Flux"].synergy.length >= 8);
    t("Hammerstorm best partners include Glacius (symmetric)", MATCHUPS["Hammerstorm"].synergy.includes("Glacius") && MATCHUPS["Glacius"].synergy.includes("Hammerstorm"));

    // Safety
    const noSelf = Object.entries(MATCHUPS).every(([h, v]) => !v.synergy.includes(h) && !v.advantage.includes(h) && !v.disadvantage.includes(h));
    t("No self-references across all heroes", noSelf);

    console.log("All tests passed. ✅");
  } catch (e) {
    console.error("❌ Test failed:", e.message);
  }
})();

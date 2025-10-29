import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const pokemonsData = [
  {
    id: 4,
    name: "Charmander",
    type: "fire",
    speed: 60,
    hp: 100,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png",
    attacks: [
      { name: "Ascuas", damage: 18 },
      { name: "Garra", damage: 10 },
      { name: "Cola Fuego", damage: 12 },
    ],
  },
  {
    id: 7,
    name: "Squirtle",
    type: "water",
    speed: 50,
    hp: 100,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png",
    attacks: [
      { name: "Pistola Agua", damage: 18 },
      { name: "Mordisco", damage: 10 },
      { name: "Caparazon", damage: 8 },
    ],
  },
  {
    id: 1,
    name: "Bulbasaur",
    type: "grass",
    speed: 55,
    hp: 100,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    attacks: [
      { name: "Latigazo", damage: 17 },
      { name: "Placaje", damage: 10 },
      { name: "Drenadoras", damage: 12 },
    ],
  },
  {
    id: 25,
    name: "Pikachu",
    type: "electric",
    speed: 90,
    hp: 100,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
    attacks: [
      { name: "Impactrueno", damage: 18 },
      { name: "Placaje", damage: 10 },
      { name: "Rayo", damage: 14 },
    ],
  },
  {
    id: 26,
    name: "Raichu",
    type: "electric",
    speed: 100,
    hp: 100,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/26.png",
    attacks: [
      { name: "Impactrueno", damage: 20 },
      { name: "Placaje", damage: 12 },
      { name: "Rayo", damage: 16 },
    ],
  },
  {
    id: 153,
    name: "Bayleef",
    type: "grass",
    speed: 100,
    hp: 100,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/153.png",
    attacks: [
      { name: "Placaje", damage: 12 },
      { name: "Hoja Afilada", damage: 18 },
      { name: "Derribo", damage: 20 },
    ],
  },
];

const typeEffectiveness = (attackerType, defenderType) => {
  if (attackerType === "fire" && defenderType === "grass") return 2;
  if (attackerType === "water" && defenderType === "fire") return 2;
  if (attackerType === "grass" && defenderType === "water") return 2;
  if (attackerType === "electric" && defenderType === "water") return 2;
  if (attackerType === "fire" && defenderType === "water") return 0.5;
  if (attackerType === "water" && defenderType === "grass") return 0.5;
  if (attackerType === "grass" && defenderType === "fire") return 0.5;
  if (attackerType === "electric" && defenderType === "grass") return 0.5;
  return 1;
};

const hpColorHex = (hp) => {
  if (hp > 60) return "#3A8A3A";
  if (hp > 30) return "#D0A800";
  return "#B22222";
};

export default function App() {
  const [player, setPlayer] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [log, setLog] = useState([]);
  const [battleOver, setBattleOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [floating, setFloating] = useState([]);

  const startBattle = () => {
    const p = pokemonsData[Math.floor(Math.random() * pokemonsData.length)];
    const others = pokemonsData.filter((x) => x.name !== p.name);
    const e = others[Math.floor(Math.random() * others.length)];

    setPlayer({
  ...p,
  backImage: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${p.id}.png`
});

    setEnemy({ ...e });
    setLog([]);
    setBattleOver(false);
    setFloating([]);
  };

  useEffect(() => {
    startBattle();
  }, []);

  const pushFloat = (text, side = "enemy") => {
    const id = Math.random().toString(36).slice(2, 9);
    setFloating((s) => [...s, { id, text, side }]);
    setTimeout(() => {
      setFloating((s) => s.filter((f) => f.id !== id));
    }, 1100);
  };

  const handleAttack = async (attackIndex) => {
    if (!player || !enemy || battleOver || isAnimating) return;

    setIsAnimating(true);
    const playerAtk = player.attacks[attackIndex];
    const enemyAtk = enemy.attacks[Math.floor(Math.random() * enemy.attacks.length)];

    const first = player.speed >= enemy.speed ? "player" : "enemy";
    const events = [];

    const apply = (attacker, defender, attack) => {
      const mult = typeEffectiveness(attacker.type, defender.type);
      const damage = Math.max(1, Math.floor(attack.damage * mult));
      events.push({ attacker, defender, attack, damage });
    };

    if (first === "player") {
      apply(player, enemy, playerAtk);
      if (enemy.hp > 0) apply(enemy, player, enemyAtk);
    } else {
      apply(enemy, player, enemyAtk);
      if (player.hp > 0) apply(player, enemy, playerAtk);
    }

    for (let i = 0; i < events.length; i++) {
      const ev = events[i];
      if (ev.attacker === player) {
        pushFloat(`-${ev.damage}`, "enemy");
        setEnemy((prev) => {
          const newHp = Math.max(prev.hp - ev.damage, 0);
          if (newHp === 0) setBattleOver(true);
          return { ...prev, hp: newHp };
        });
        setLog((l) => [...l, `${player.name} usó ${ev.attack.name}. -${ev.damage}`]);
      } else {
        pushFloat(`-${ev.damage}`, "player");
        setPlayer((prev) => {
          const newHp = Math.max(prev.hp - ev.damage, 0);
          if (newHp === 0) setBattleOver(true);
          return { ...prev, hp: newHp };
        });
        setLog((l) => [...l, `${enemy.name} usó ${ev.attack.name}. -${ev.damage}`]);
      }
      await new Promise((res) => setTimeout(res, 700));
      if (battleOver) break;
    }

    setIsAnimating(false);
  };

  if (!player || !enemy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <div className="p-4 rounded-lg border-2 border-green-200 bg-white shadow">Cargando combate...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-green-900 font-sans">
      <header className="bg-white/90 backdrop-blur-sm border-b border-green-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold">PokéDuelo</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <section
          className="bg-white shadow-lg rounded-2xl border border-green-100 p-4
                     flex flex-col-reverse md:flex-row gap-4 md:gap-6 items-stretch"
        >
          {/* Player */}
          <div className="flex-1 flex flex-col items-center md:items-start gap-3">
            <div className="w-full flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-3 w-full">
                <div className="relative">
                  <img
                    src={player.backImage}
                    alt={player.name}
                    className="w-28 h-28 md:w-36 md:h-36 object-contain"
                  />
                  <div className="absolute inset-0 pointer-events-none flex items-start justify-center">
                    <AnimatePresence>
                      {floating
                        .filter((f) => f.side === "player")
                        .map((f) => (
                          <motion.span
                            key={f.id}
                            initial={{ y: -6, opacity: 1 }}
                            animate={{ y: -40, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.9 }}
                            className="text-sm font-bold text-red-600"
                          >
                            {f.text}
                          </motion.span>
                        ))}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-base">{player.name}</div>
                  <div className="mt-2">
                    <div className="w-full bg-green-50 border border-green-100 rounded-md h-4 overflow-hidden">
                      <div
                        className="h-4 transition-all duration-500"
                        style={{
                          width: `${player.hp}%`,
                          background: `linear-gradient(90deg, ${hpColorHex(player.hp)}, ${hpColorHex(
                            Math.max(player.hp - 10, 0)
                          )})`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Attacks */}
              <div className="flex flex-wrap justify-center mt-4 gap-2">
  {player.attacks.map((atk, i) => (
    <button
      key={i}
      className={`py-2 px-4 font-bold rounded-lg border-2 border-green-700 text-green-700 transition-colors duration-300 ${
        battleOver
          ? 'bg-gray-400 cursor-not-allowed border-gray-400 text-gray-700'
          : 'bg-white hover:bg-green-200'
      }`}
      disabled={battleOver}
      onClick={() => handleAttack(i)}
    >
      {atk.name}
    </button>
  ))}
</div>

            </div>
          </div>

          {/* Enemy */}
          <div className="flex-1 flex flex-col items-center md:items-end gap-3">
            <div className="w-full flex flex-col items-center md:items-end gap-2">
              <div className="flex items-center gap-3 w-full justify-center md:justify-end">
                <div className="flex-1 md:text-right">
                  <div className="font-semibold text-base">{enemy.name}</div>
                  <div className="mt-2">
                    <div className="w-full bg-green-50 border border-green-100 rounded-md h-4 overflow-hidden">
                      <div
                        className="h-4 transition-all duration-500"
                        style={{
                          width: `${enemy.hp}%`,
                          background: `linear-gradient(90deg, ${hpColorHex(enemy.hp)}, ${hpColorHex(
                            Math.max(enemy.hp - 10, 0)
                          )})`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <img
                    src={enemy.image}
                    alt={enemy.name}
                    className="w-28 h-28 md:w-36 md:h-36 object-contain"
                  />
                  <div className="absolute inset-0 pointer-events-none flex items-start justify-center">
                    <AnimatePresence>
                      {floating
                        .filter((f) => f.side === "enemy")
                        .map((f) => (
                          <motion.span
                            key={f.id}
                            initial={{ y: -6, opacity: 1 }}
                            animate={{ y: -40, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.9 }}
                            className="text-sm font-bold text-red-600"
                          >
                            {f.text}
                          </motion.span>
                        ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Battle log simplified */}
        <section className="mt-4 max-w-4xl mx-auto">
          <div className="bg-white border border-green-50 rounded-lg p-3 text-sm text-center shadow-sm">
            <div className="min-h-[2rem]">{log[log.length - 1] || "¡Comienza la batalla!"}</div>
          </div>
        </section>

        {/* Restart */}
        <section className="mt-4 flex justify-center gap-3">
          <button
            className="px-4 py-2 bg-white border border-green-100 rounded-lg shadow text-green-700 font-semibold hover:bg-green-50"
            onClick={startBattle}
          >
            Reiniciar
          </button>
        </section>
      </main>

      {/* Result popup */}
      <AnimatePresence>
        {battleOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl border border-green-50"
            >
              <h2 className="text-xl font-bold mb-2">
                {player.hp === 0 ? "Has perdido" : "¡Victoria!"}
              </h2>
              <p className="text-sm text-green-700/80 mb-4">
                {player.hp === 0 ? `${enemy.name} te derrotó.` : `Has derrotado a ${enemy.name}.`}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={startBattle}
                  className="px-4 py-2 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800"
                >
                  Volver a jugar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-8 py-6 text-center text-xs text-green-600">
        © 2025 — Demo PokéDuelo · JLobato
      </footer>
    </div>
  );
}

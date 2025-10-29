import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function App() {
  const [player, setPlayer] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [battleLog, setBattleLog] = useState([]);
  const [battleOver, setBattleOver] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [attackEffect, setAttackEffect] = useState(null);

  const getRandomPokemonId = () => Math.floor(Math.random() * 151) + 1;

  const getPokemon = async (id) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await res.json();
    return {
      name: data.name,
      type: data.types[0].type.name,
      hp: 100,
      attack: data.stats.find((s) => s.stat.name === "attack").base_stat,
      speed: data.stats.find((s) => s.stat.name === "speed").base_stat,
      front: data.sprites.front_default,
      back: data.sprites.back_default,
    };
  };

  const typeMultiplier = (a, d) => {
    const chart = {
      fire: { grass: 2, water: 0.5 },
      water: { fire: 2, grass: 0.5 },
      grass: { water: 2, fire: 0.5 },
      electric: { water: 2, ground: 0 },
    };
    return chart[a]?.[d] || 1;
  };

  const startBattle = async () => {
    setLoading(true);
    const playerData = await getPokemon(getRandomPokemonId());
    let enemyData = await getPokemon(getRandomPokemonId());
    while (enemyData.name === playerData.name) {
      enemyData = await getPokemon(getRandomPokemonId());
    }
    setPlayer(playerData);
    setEnemy(enemyData);
    setBattleLog([]);
    setBattleOver(false);
    setAttackEffect(null);
    setLoading(false);
  };

  useEffect(() => {
    startBattle();
  }, []);

  const triggerEffect = (type, target) => {
    const colorMap = {
      fire: "bg-red-500",
      water: "bg-blue-400",
      grass: "bg-green-400",
      electric: "bg-yellow-300",
      default: "bg-gray-400",
    };
    const color = colorMap[type] || colorMap.default;
    setAttackEffect({ color, target });
    setTimeout(() => setAttackEffect(null), 600);
  };

  const attack = async () => {
    if (battleOver || isAnimating) return;

    setIsAnimating(true);
    const first = player.speed >= enemy.speed ? "player" : "enemy";
    const turns = first === "player" ? ["player", "enemy"] : ["enemy", "player"];

    for (let turn of turns) {
      if (battleOver) break;

      const attacker = turn === "player" ? player : enemy;
      const defender = turn === "player" ? enemy : player;
      const mult = typeMultiplier(attacker.type, defender.type);
      const damage = Math.floor(attacker.attack * 0.2 * mult);
      const newHp = Math.max(defender.hp - damage, 0);

      triggerEffect(attacker.type, turn === "player" ? "enemy" : "player");

      if (turn === "player") {
        setEnemy((prev) => ({ ...prev, hp: newHp }));
      } else {
        setPlayer((prev) => ({ ...prev, hp: newHp }));
      }

      setBattleLog((l) => [
        ...l,
        `${attacker.name} (${attacker.type}) ataca y causa ${damage} de daño.`,
      ]);

      if (newHp <= 0) {
        setBattleOver(true);
        setBattleLog((l) => [...l, `${attacker.name} gana el combate.`]);
        break;
      }

      await new Promise((res) => setTimeout(res, 1000));
    }

    setIsAnimating(false);
  };

  if (loading || !player || !enemy) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100">
        <div className="p-4 rounded-lg border-2 border-green-200 bg-white shadow">
          Cargando Pokémon...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-green-900 font-sans flex flex-col items-center py-6 relative overflow-hidden">
      <h1 className="text-2xl font-bold mb-6">PokéDuelo</h1>

      {/* CONTENEDOR PRINCIPAL — Cambia el orden en móvil */}
      <div className="flex flex-col-reverse md:flex-row items-center gap-10 relative">
        {/* Pokémon del jugador */}
        <motion.div
          animate={isAnimating ? { x: [0, 20, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <img src={player.back} alt={player.name} className="w-32 h-32" />
          <h2 className="capitalize text-lg font-semibold mt-2">{player.name}</h2>
          <div className="w-32 bg-green-100 rounded-md overflow-hidden mt-2">
            <div
              className="h-3 bg-green-600 transition-all duration-500"
              style={{ width: `${player.hp}%` }}
            />
          </div>
          <p className="text-sm mt-1">HP: {player.hp}</p>
        </motion.div>

        {/* Efecto de ataque */}
        <AnimatePresence>
          {attackEffect && (
            <motion.div
              key="attack"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className={`absolute ${
                attackEffect.target === "enemy"
                  ? "right-32 md:right-64"
                  : "left-32 md:left-64"
              } top-20 md:top-10 w-10 h-10 rounded-full ${attackEffect.color} shadow-lg`}
            />
          )}
        </AnimatePresence>

        {/* VS */}
        <span className="text-3xl font-bold md:order-none">⚡ VS ⚡</span>

        {/* Pokémon enemigo */}
        <motion.div
          animate={isAnimating ? { x: [0, -20, 0] } : {}}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          <img src={enemy.front} alt={enemy.name} className="w-32 h-32" />
          <h2 className="capitalize text-lg font-semibold mt-2">{enemy.name}</h2>
          <div className="w-32 bg-green-100 rounded-md overflow-hidden mt-2">
            <div
              className="h-3 bg-green-600 transition-all duration-500"
              style={{ width: `${enemy.hp}%` }}
            />
          </div>
          <p className="text-sm mt-1">HP: {enemy.hp}</p>
        </motion.div>
      </div>

      {/* Botones */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={attack}
          disabled={battleOver}
          className={`px-4 py-2 rounded-lg border-2 border-green-700 font-semibold transition ${
            battleOver
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-white text-green-700 hover:bg-green-100"
          }`}
        >
          Atacar
        </button>

        <button
          onClick={startBattle}
          className="px-4 py-2 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-800"
        >
          Nuevo combate
        </button>
      </div>

      {/* Registro */}
      <div className="mt-6 bg-white border border-green-100 rounded-lg p-4 shadow w-full max-w-md">
        <h3 className="font-semibold text-center mb-2">Registro de batalla</h3>
        <div className="text-sm h-32 overflow-y-auto">
          {battleLog.map((line, i) => (
            <div key={i}>{line}</div>
          ))}
        </div>
      </div>

      {/* Modal de fin */}
      <AnimatePresence>
        {battleOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-white rounded-2xl p-6 max-w-sm text-center"
            >
              <h2 className="text-xl font-bold mb-2">Fin del combate</h2>
              <p className="text-green-700 mb-4">
                {player.hp === 0 ? "Has perdido..." : "¡Victoria!"}
              </p>
              <button
                onClick={startBattle}
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
              >
                Volver a jugar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

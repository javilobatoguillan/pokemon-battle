import { useState, useEffect } from 'react';

const pokemonsData = [
  {
    name: 'Charmander',
    type: 'fire',
    speed: 60,
    hp: 100,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    attacks: [{ name: 'Ascuas', damage: 15 }, { name: 'Garra', damage: 10 }]
  },
  {
    name: 'Squirtle',
    type: 'water',
    speed: 50,
    hp: 100,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
    attacks: [{ name: 'Pistola Agua', damage: 15 }, { name: 'Mordisco', damage: 10 }]
  },
  {
    name: 'Bulbasaur',
    type: 'grass',
    speed: 55,
    hp: 100,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    attacks: [{ name: 'Latigazo', damage: 15 }, { name: 'Placaje', damage: 10 }]
  },
  {
    name: 'Pikachu',
    type: 'electric',
    speed: 90,
    hp: 100,
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    attacks: [{ name: 'Impactrueno', damage: 15 }, { name: 'Placaje', damage: 10 }]
  }
];

const getPokemonId = (name) => {
  switch(name) {
    case 'Charmander': return 4;
    case 'Squirtle': return 7;
    case 'Bulbasaur': return 1;
    case 'Pikachu': return 25;
    default: return 1;
  }
};

export default function App() {
  const [player, setPlayer] = useState(null);
  const [enemy, setEnemy] = useState(null);
  const [log, setLog] = useState([]);
  const [battleOver, setBattleOver] = useState(false);

  const startBattle = () => {
    const playerPoke = pokemonsData[Math.floor(Math.random() * pokemonsData.length)];
    const enemyOptions = pokemonsData.filter(p => p.name !== playerPoke.name);
    const enemyPoke = enemyOptions[Math.floor(Math.random() * enemyOptions.length)];

    setPlayer({ 
      ...playerPoke, 
      backImage: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${getPokemonId(playerPoke.name)}.png`
    });
    setEnemy({ ...enemyPoke });
    setLog([]);
    setBattleOver(false);
  }

  useEffect(() => {
    startBattle();
  }, []);

  const typeEffectiveness = (attackerType, defenderType) => {
    if(attackerType === 'fire' && defenderType === 'grass') return 2;
    if(attackerType === 'water' && defenderType === 'fire') return 2;
    if(attackerType === 'grass' && defenderType === 'water') return 2;
    if(attackerType === 'fire' && defenderType === 'water') return 0.5;
    if(attackerType === 'water' && defenderType === 'grass') return 0.5;
    if(attackerType === 'grass' && defenderType === 'fire') return 0.5;
    return 1;
  }

  const handleAttack = (attackIndex) => {
    if(!player || !enemy || battleOver) return;

    const playerAttack = player.attacks[attackIndex];
    const enemyAttackIndex = Math.floor(Math.random() * enemy.attacks.length);
    const enemyAttack = enemy.attacks[enemyAttackIndex];

    let first = player.speed >= enemy.speed ? 'player' : 'enemy';
    const newLog = [];

    const applyAttack = (attacker, defender, attack) => {
      const multiplier = typeEffectiveness(attacker.type, defender.type);
      const damage = Math.floor(attack.damage * multiplier);
      if(defender === enemy) setEnemy(prev => {
        const newHp = Math.max(prev.hp - damage, 0);
        if(newHp === 0) setBattleOver(true);
        return { ...prev, hp: newHp };
      });
      else setPlayer(prev => {
        const newHp = Math.max(prev.hp - damage, 0);
        if(newHp === 0) setBattleOver(true);
        return { ...prev, hp: newHp };
      });
      newLog.push(`${attacker.name} usó ${attack.name}! Hizo ${damage} de daño.`);
    }

    if(first === 'player') {
      applyAttack(player, enemy, playerAttack);
      if(enemy.hp > 0) applyAttack(enemy, player, enemyAttack);
    } else {
      applyAttack(enemy, player, enemyAttack);
      if(player.hp > 0) applyAttack(player, enemy, playerAttack);
    }

    setLog(prev => [...prev, ...newLog]);
  }

  if(!player || !enemy) return <div className="p-5">Cargando...</div>;

  return (
    <div className="min-h-screen bg-green-200 flex flex-col font-mono">
      <header className="bg-green-700 text-white text-center p-4 font-bold border-b-4 border-green-900">
        Pokémon Battle - Verde Hoja
      </header>

      <main className="flex-grow flex flex-col items-center justify-center relative">
        {/* Contenedor de batalla */}
        <div className="relative w-full max-w-3xl h-72 bg-green-300 rounded-lg border-4 border-black shadow-lg flex justify-between items-center px-8">
          {/* Pokémon jugador (espalda) */}
          <div className="flex flex-col items-center">
            <img src={player.backImage} alt={player.name} className="w-40 h-40"/>
            <p className="text-black font-bold text-xl shadow-md">{player.name}</p>
            <div className="h-5 w-40 bg-gray-400 rounded border-2 border-black mt-1">
              <div className="h-5 bg-green-500 rounded transition-all duration-500" style={{ width: `${player.hp}%` }}/>
            </div>
          </div>

          {/* Pokémon enemigo */}
          <div className="flex flex-col items-center">
            <img src={enemy.image} alt={enemy.name} className="w-40 h-40"/>
            <p className="text-black font-bold text-xl shadow-md">{enemy.name}</p>
            <div className="h-5 w-40 bg-gray-400 rounded border-2 border-black mt-1">
              <div className="h-5 bg-green-500 rounded transition-all duration-500" style={{ width: `${enemy.hp}%` }}/>
            </div>
          </div>
        </div>

        {/* Cuadro de texto */}
        <div className="w-full max-w-3xl bg-white bg-opacity-90 border-t-4 border-black p-2 rounded-t-lg mt-2 text-sm">
          {log[log.length - 1] || "¡Comienza la batalla!"}
        </div>

        {/* Botones de ataque */}
        <div className="flex flex-wrap justify-center mt-4 gap-2">
          {player.attacks.map((atk, i) => (
            <button
              key={i}
              className={`py-2 px-4 font-bold text-white rounded-lg ${
                battleOver ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
              }`}
              disabled={battleOver}
              onClick={() => handleAttack(i)}
            >
              {atk.name}
            </button>
          ))}
        </div>

        {/* Popup de fin de batalla */}
        {battleOver && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg border-4 border-black flex flex-col items-center shadow-lg">
              <p className="text-2xl font-bold mb-4">
                {player.hp === 0 ? "¡Perdiste!" : "¡Ganaste!"}
              </p>
              <button
                className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg border-2 border-black"
                onClick={startBattle}
              >
                Volver a jugar
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-green-700 text-white p-4 text-center border-t-4 border-green-900">
        © 2025 Javier's Pokémon Battle
      </footer>
    </div>
  );
}

export default function PokemonCard({ pokemon, isPlayer, handleAttack }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg w-52 flex flex-col items-center">
      <h2 className="font-bold text-lg">{pokemon.name}</h2>
      <img src={pokemon.image} alt={pokemon.name} className="w-36 h-36" />
      <p className="mt-2">HP: {pokemon.hp}</p>
      <div className="mt-2 flex flex-col">
        {pokemon.attacks.map((atk, i) => (
          <button
            key={i}
            className={`mt-1 py-1 px-2 rounded-lg font-bold text-white ${
              isPlayer ? 'bg-red-600 hover:bg-red-700 cursor-pointer' : 'bg-gray-400 cursor-default'
            }`}
            disabled={!isPlayer}
            onClick={() => isPlayer && handleAttack(i)}
          >
            {atk.name}
          </button>
        ))}
      </div>
    </div>
  )
}

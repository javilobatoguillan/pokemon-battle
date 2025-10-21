export default function BattleLog({ log }) {
  return (
    <div className="bg-gray-100 p-4 rounded-xl shadow-inner h-40 overflow-y-auto mt-5 w-full max-w-2xl">
      {log.map((entry, i) => (
        <p key={i}>{entry}</p>
      ))}
    </div>
  )
}

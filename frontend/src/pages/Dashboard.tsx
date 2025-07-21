import { useState } from "react";
import { Link } from "react-router-dom";
import { usePolling } from "../hooks/usePolling";
import { useTeamStore } from "../store/use-team-store";
import { Coins, User, RefreshCw } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Dashboard() {
  const team = useTeamStore((s) => s.team);
  const is_ready = useTeamStore((s) => s.is_ready);
  const fetchTeam = useTeamStore((s) => s.fetchTeam);
  const { user } = useAuth();
  const [positionFilter, setPositionFilter] = useState<string>("All");

  usePolling({
    intervalMs: 3000,
    callback: fetchTeam,
    shouldContinue: () => {
      const { is_ready, team } = useTeamStore.getState();
      return !is_ready || !team;
    },
  });

  if (!is_ready || !team) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500 text-lg">
        <RefreshCw className="animate-spin mb-4" size={32} />
        <p>Your team is being created. Please wait...</p>
      </div>
    );
  }

  const transferListed = team.players.filter((p) => p.in_transfer_market).length;

  const filteredPlayers =
    positionFilter === "All"
      ? team.players
      : team.players.filter((p) => p.position === positionFilter);

  const positionOptions = [
    { key: "All", label: "All" },
    { key: "GK", label: "Goalkeeper" },
    { key: "DEF", label: "Defender" },
    { key: "MID", label: "Midfielder" },
    { key: "ATT", label: "Attacker" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome, Coach 👋 {user?.email}</h1>
          <p className="text-gray-600 text-sm">Manage your squad and dominate the fantasy league.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Coins size={16} /> Budget: ${team.budget}
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <User size={16} /> {team.players.length} Players
          </div>
        </div>
      </div>

      {/* Position Filter */}
      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          {positionOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setPositionFilter(key)}
              className={`px-4 py-1 rounded-full border text-sm transition-all ${positionFilter === key
                  ? "bg-green-600 text-white border-green-600"
                  : "bg-white text-green-800 border-green-600 hover:bg-green-50"
                }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredPlayers.map((p) => (
          <div
            key={p.id}
            className={`rounded-xl border p-4 shadow-sm hover:shadow-md transition ${p.in_transfer_market ? "border-yellow-500 bg-yellow-50" : "border-gray-200"
              }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{p.name}</h2>
              {p.in_transfer_market && (
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  For Sale: ${p.asking_price}
                </span>
              )}
            </div>
            <p className="text-gray-600">{p.position}</p>
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-600">
            🟢 <strong>{team.players.length}</strong> players selected (
            {transferListed} listed in market).
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Your team must have between 15 and 25 players to be match-ready.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/market" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            Go to Transfer Market
          </Link>
        </div>
      </div>
    </div>
  );
}

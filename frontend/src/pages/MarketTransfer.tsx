import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useTeamStore } from "../store/use-team-store";
import { useMarketStore } from "../store/use-market-store";
import { toggleSellStatus, buyPlayer } from "../api/transfer";
import { Pagination } from "../components/pagination/Pagination";
import { useDebouncedFilters } from "../hooks/useDebouncedFilters";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export default function Market() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab =
    searchParams.get("tab") === "buy" || searchParams.get("tab") === "sell"
      ? (searchParams.get("tab") as "buy" | "sell")
      : "sell";

  const [tab, setTab] = useState<"sell" | "buy">(initialTab);
  const { team, fetchTeam } = useTeamStore();
  const { transfers, fetchTransfers, pagination } = useMarketStore();

  const [askPrices, setAskPrices] = useState<Record<number, number>>({});

  const [filters, setFilters, rawFilters] = useDebouncedFilters(
    {
      playerName: searchParams.get("playerName") || "",
      teamName: searchParams.get("teamName") || "",
      min: searchParams.get("min") || "",
      max: searchParams.get("max") || "",
      page: searchParams.get("page") || "1",
      tab: initialTab,
    },
    500
  );

  // Sync filters with URL
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== "") {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  }, [filters]);

  const fetchTransfersWithCurrentFilters = useCallback(() => {
    fetchTransfers({
      playerName: filters.playerName,
      teamName: filters.teamName,
      page: Number(filters.page),
      min: filters.min ? Number(filters.min) : undefined,
      max: filters.max ? Number(filters.max) : undefined,
    });
  }, [fetchTransfers, filters]);

  useEffect(() => {
    if (!team) fetchTeam();
    if (tab === "buy") {
      fetchTransfersWithCurrentFilters();
    }
  }, [tab, filters, fetchTransfersWithCurrentFilters, team]);

  useEffect(() => {
    if (filters.tab !== tab) {
      setTab(filters.tab as "sell" | "buy");
    }
  }, [filters.tab]);

  const handleSell = async (playerId: number, isListed: boolean) => {
    const price = askPrices[playerId];

    if (!isListed) {
      if (!price || price <= 0 || isNaN(price)) {
        toast.error("Please enter a valid asking price greater than 0.");
        return;
      }
      await toggleSellStatus(playerId, true, price);
      toast.success("Player listed for sale.");
    } else {
      await toggleSellStatus(playerId, false);
      setAskPrices((prev) => {
        const updated = { ...prev };
        delete updated[playerId];
        return updated;
      });
      toast.success("Player unlisted successfully.");
    }

    fetchTeam();
  };


  const handleBuy = async (teamPlayerId: number) => {
    await buyPlayer(teamPlayerId);
    fetchTeam();
    fetchTransfersWithCurrentFilters();
    toast.success("Successfully bought the player.");
  };

  const handleTabChange = (newTab: "sell" | "buy") => {
    setTab(newTab);
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set("tab", newTab);
      updated.set("page", "1");
      return updated;
    });
    setFilters((prev) => ({
      ...prev,
      tab: newTab,
      page: "1",
    }));
  };

  const isTeamFull = (team?.players ?? []).length >= 25;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        {["sell", "buy"].map((t) => (
          <button
            key={t}
            className={`px-5 py-2 rounded-lg font-medium transition ${tab === t
              ? "bg-green-600 text-white"
              : "bg-green-100 text-gray-700 hover:bg-gray-200"
              }`}
            onClick={() => handleTabChange(t as "sell" | "buy")}
          >
            {t === "sell" ? "Sell Players" : "Buy Players"}
          </button>
        ))}
      </div>

      {/* SELL TAB */}
      {tab === "sell" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team?.players?.map((player) => (
            <div key={player.id} className="border p-4 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-1">
                {player.name}{" "}
                <span className="text-sm text-gray-500">
                  ({player.position})
                </span>
              </h2>
              <input
                type="number"
                required={!player.asking_price}
                placeholder="Asking Price"
                className="mt-2 p-2 border rounded w-full"
                value={askPrices[player.id] || player.asking_price || ""}
                onChange={(e) =>
                  setAskPrices((prev) => ({
                    ...prev,
                    [player.id]: parseFloat(e.target.value),
                  }))
                }
              />
              <button
                className={`mt-3 w-full text-white py-2 rounded ${player.in_transfer_market
                  ? "bg-yellow-200 text-yellow-900 border border-yellow-300 hover:bg-yellow-300"
                  : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                onClick={() => handleSell(player.id, player.in_transfer_market)}
              >
                {player.in_transfer_market ? "Unlist" : "List for Sale"}
              </button>

            </div>
          ))}
        </div>
      )}

      {/* BUY TAB */}
      {tab === "buy" && (
        <>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 bg-[#f9f9f9] p-4 rounded-xl shadow-sm dark:bg-neutral-800">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Player Name</label>
              <input
                type="text"
                placeholder="e.g. Ronaldo"
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3cad68]"
                value={rawFilters.playerName}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    playerName: e.target.value,
                    page: "1",
                  }))
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Team Name</label>
              <input
                type="text"
                placeholder="e.g. Calo United"
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3cad68]"
                value={rawFilters.teamName}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    teamName: e.target.value,
                    page: "1",
                  }))
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Min Price</label>
              <input
                type="number"
                placeholder="0"
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3cad68]"
                value={rawFilters.min}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    min: e.target.value,
                    page: "1",
                  }))
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Max Price</label>
              <input
                type="number"
                placeholder="100000"
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3cad68]"
                value={rawFilters.max}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    max: e.target.value,
                    page: "1",
                  }))
                }
              />
            </div>
          </div>
          {/* Team full warning */}
          {isTeamFull && (
            <div className="flex items-center gap-2 bg-yellow-100 text-yellow-900 px-4 py-3 mb-4 rounded-lg text-sm">
              <AlertTriangle size={18} />
              You already have 25 players. You must sell a player before buying more.
            </div>
          )}

          {/* Transfer list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {transfers?.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg transition-all bg-white flex flex-col justify-between h-full"
              >
                <div className="space-y-2">
                  <div className="text-xl font-bold text-gray-800">
                    {p.player?.name}
                    <span className="ml-2 text-sm font-medium text-gray-500">
                      ({p.player?.position})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-gray-500">Asking Price:</span>
                    <span className="font-semibold">${p.asking_price}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      95% Price: ${Math.floor(p.asking_price * 0.95)}
                    </span>
                    <span className="text-xs text-gray-400">(Discounted)</span>
                  </div>
                </div>

                <button
                  className={`mt-5 w-full py-2 rounded-xl text-sm font-medium transition ${isTeamFull
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  onClick={() => handleBuy(p.id)}
                  disabled={isTeamFull}
                  title={
                    isTeamFull
                      ? "You can't buy more players. Team is full."
                      : "Buy this player"
                  }
                >
                  Buy Player
                </button>
              </div>

            ))}
          </div>
          {pagination.total === 0 ? (
            <div className="text-center text-gray-500 py-4">No data available</div>
          ) : (
            pagination.totalPages > 1 && (
              <Pagination
                pageCount={pagination.totalPages}
                currentPage={parseInt(filters.page)}
                onPageChange={(page) =>
                  setFilters((prev) => ({ ...prev, page: page.toString() }))
                }
              />
            )
          )}

        </>
      )}
    </div>
  );
}
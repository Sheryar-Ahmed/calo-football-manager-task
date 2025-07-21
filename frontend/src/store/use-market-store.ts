import { create } from "zustand";
import { filterTransferMarket } from "../api/transfer";

type Player = { id: string; name: string; position: string; };
type MarketPlayer = {
  id: number;
  player: Player;
  asking_price: number;
  listedBy: string;
};

type PaginationData = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type MarketStore = {
  pagination: PaginationData;
  transfers: MarketPlayer[];
  fetchTransfers: (filters?: any) => Promise<void>;
};

export const useMarketStore = create<MarketStore>((set) => ({
  transfers: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  fetchTransfers: async (filters = {}) => {
    const { data } = await filterTransferMarket(filters);
    set({
      transfers: data?.data || [],
      pagination: data?.pagination || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    });
  },
  setTransfers: (transfers: MarketPlayer[]) => set({ transfers }), // <-- add this
}));


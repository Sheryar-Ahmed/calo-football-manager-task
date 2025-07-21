import { create } from 'zustand';
import { teamStatus, userTeam } from '../api/team';

type Player = {
  id: number;
  name: string;
  position: string;
  team_name: string;
  in_transfer_market: boolean;
  asking_price: number | null;
};

type Team = {
  id: number;
  name: string;
  budget: number,
  player_count: number;
  is_ready: boolean;
  players: Player[];
};

type TeamState = {
  team: Team | null;
  is_ready: boolean;
  fetchTeam: () => Promise<void>;
};

export const useTeamStore = create<TeamState>((set) => ({
  team: null,
  is_ready: false,

  fetchTeam: async () => {
    try {
      const { data: statusData } = await teamStatus();

      if (statusData.is_ready) {
        const { data } = await userTeam();
        set({
          team: data.team,
          is_ready: data.team?.is_ready ?? false,
        });
      } else {
        set({
          team: null,
          is_ready: false,
        });
      }
    } catch (error) {
      console.error("❌ Error fetching team:", error);
      set({
        team: null,
        is_ready: false,
      });
    }
  },
}));

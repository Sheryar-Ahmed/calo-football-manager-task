import db from "../models";
import { addToTeamQueue, isUserQueued } from "../queues/team-queue";
import fs from "fs";
import path from "path";
import { Op } from "sequelize";

const playersDataPath = path.resolve(__dirname, "../data/players_data.json");
const playersData = JSON.parse(fs.readFileSync(playersDataPath, "utf-8"));

let currentTeamIndex = 0;

export async function createInitialTeam(userId: number) {
  try {
    const existingTeam = await db.Team.findOne({ where: { user_id: userId } });
    if (existingTeam) {
      console.log(`⚠️ Team already exists for user ${userId}`);
      return;
    }

    let assigned = false;

    while (!assigned && currentTeamIndex < playersData.length) {
      const rawTeam = playersData[currentTeamIndex];
      const players = rawTeam.players;

      if (players.length !== 20) {
        console.warn(`⚠️ Skipping team ${currentTeamIndex + 1} due to invalid player count.`);
        currentTeamIndex++;
        continue;
      }

      const playerNames = players.map((p: any) => p.name);

      // Check if any player with same name exists
      const existing = await db.Player.findAll({
        where: {
          name: {
            [Op.in]: playerNames,
          },
        },
      });

      if (existing.length > 0) {
        console.warn(`⏭️ Skipping team ${currentTeamIndex + 1} due to duplicate players.`);
        currentTeamIndex++;
        continue;
      }

      // No duplicates, safe to proceed
      const teamName = `User${userId}_Team`;

      const team = await db.Team.create({
        user_id: userId,
        name: teamName,
        is_ready: false,
        player_count: 20,
      });

      const createdPlayers = [];

      for (const player of players) {
        const created = await db.Player.create({
          name: player.name,
          position: normalizePosition(player.position),
          team_name: teamName,
        });
        createdPlayers.push(created);
      }

      const teamPlayerLinks = createdPlayers.map((p) => ({
        team_id: team.id,
        player_id: p.id,
      }));

      await db.TeamPlayer.bulkCreate(teamPlayerLinks);

      await team.update({
        is_ready: true,
        player_count: createdPlayers.length,
      });

      console.log(`✅ Assigned team ${currentTeamIndex + 1} to user ${userId}`);
      assigned = true;
      currentTeamIndex++;
    }

    if (!assigned) {
      throw new Error("🚨 No valid unique teams left in players_data.json.");
    }
  } catch (err) {
    console.error("❌ Error in createInitialTeam:", err);
  }
}

function normalizePosition(
  pos: "Goalkeeper" | "Defender" | "Midfielder" | "Attacker"
): "GK" | "DEF" | "MID" | "ATT" {
  const map = {
    Goalkeeper: "GK",
    Defender: "DEF",
    Midfielder: "MID",
    Attacker: "ATT",
  } as const;

  return map[pos];
}


const teamStatus = async (userId: number | undefined) => {
  try {
    if (!userId) {
      return {
        is_ready: false,
        reason: "No user ID provided.",
      };
    }

    const team = await db.Team.findOne({ where: { user_id: userId } });

    if (!team || !team.is_ready) {
      const reason = !team
        ? "No team found for this user."
        : "Team is not ready.";

      if (!isUserQueued(userId)) {
        console.log(`📥 Queueing createInitialTeam job for user ${userId}`);
        addToTeamQueue({ userId });
      } else {
        console.log(`⏳ User ${userId} is already queued for team creation.`);
      }

      return {
        is_ready: false,
        reason,
      };
    }

    return {
      is_ready: true,
      reason: "Team is ready to play.",
    };
  } catch (error) {
    console.error("❌ Error in teamStatus:", error);
    throw error;
  }
};


const userTeam = async (userId: number | undefined) => {
  try {
    if (!userId) throw new Error("User ID is required.");

    const team = await db.Team.findOne({
      where: { user_id: userId },
      include: [
        {
          model: db.TeamPlayer,
          as: "team_players",
          include: [
            {
              model: db.Player,
              as: "player",
            },
          ],
        },
      ],
    });

    if (!team) {
      return {
        team: null,
        message: "No team found for this user.",
      };
    }

    const players = team.team_players.map((tp: any) => {
      const p = tp.player;
      return {
        id: p.id,
        name: p.name,
        position: p.position,
        team_name: p.team_name,
        in_transfer_market: tp.in_transfer_market,
        asking_price: tp.asking_price,
      };
    });

    return {
      team: {
        id: team.id,
        name: team.name,
        budget: team.budget,
        player_count: team.player_count,
        is_ready: team.is_ready,
        players,
      },
    };
  } catch (error) {
    throw error;
  }
};

const TeamService = {
  teamStatus,
  userTeam,
}

export default TeamService;

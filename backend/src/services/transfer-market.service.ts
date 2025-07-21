import { Op, Transaction, col, fn, where as sequelizeWhere } from 'sequelize';
import db from '../models';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';
import { Filters } from './types/transfer-market';
type TeamPlayerInstance = InstanceType<typeof db.TeamPlayer>;

const listTeamPlayersForSell = async (userId: number | undefined) => {
    const team = await db.Team.findOne({
        where: { user_id: userId },
        include: [
            {
                model: db.TeamPlayer,
                as: 'team_players',
                include: [{ model: db.Player, as: 'player' }],
            },
        ],
    });

    if (!team) throw new NotFoundError('Team not found');
    return team.team_players;
};

const toggleSellStatus = async (
    userId: number | undefined,
    teamPlayerId: number,
    askingPrice: number,
    inTransferMarket: boolean
) => {
    const player = await db.TeamPlayer.findByPk(teamPlayerId, {
        include: [{ model: db.Team, as: 'team' }],
    });

    if (!player || player.team.user_id !== userId) {
        throw new NotFoundError('Player not found');
    }

    if (inTransferMarket && (!askingPrice || askingPrice < 1)) {
        throw new ValidationError('Invalid asking price');
    }

    await player.update({
        in_transfer_market: inTransferMarket,
        asking_price: inTransferMarket ? askingPrice : null,
    });

    return player;
};

const buyPlayer = async (buyerId: number | undefined, teamPlayerId: number) => {
  if (!buyerId) throw new ValidationError("BuyerId required");

  const buyerTeam = await db.Team.findOne({
    where: { user_id: buyerId },
    include: [
      {
        model: db.TeamPlayer,
        as: 'team_players',
      },
    ],
  });

  if (!buyerTeam) throw new NotFoundError('Buyer team not found');

  if (buyerTeam.team_players.length >= 25) {
    throw new ConflictError('Cannot exceed 25 players');
  }

  const teamPlayer = await db.TeamPlayer.findByPk(teamPlayerId, {
    include: [
      {
        model: db.Team,
        as: 'team',
      },
    ],
  });

  if (!teamPlayer || !teamPlayer.in_transfer_market) {
    throw new NotFoundError('Player not available for transfer');
  }

  if (teamPlayer.team.user_id === buyerId) {
    throw new ConflictError("You can't buy your own player");
  }

  const sellerTeam = await db.Team.findByPk(teamPlayer.team_id, {
    include: [
      {
        model: db.TeamPlayer,
        as: 'team_players',
      },
    ],
  });

  if (!sellerTeam) {
    throw new NotFoundError("Seller's team not found");
  }

  if (sellerTeam.team_players.length <= 15) {
    throw new ConflictError("Seller's team must have at least 15 players");
  }

  const transferFee = parseFloat(teamPlayer.asking_price) * 0.95;

  if (parseFloat(buyerTeam.budget) < transferFee) {
    throw new ConflictError('Not enough budget');
  }

  // ✅ Perform transaction with player count updates
  await db.sequelize.transaction(async (t: Transaction) => {
    await teamPlayer.update(
      {
        team_id: buyerTeam.id,
        in_transfer_market: false,
        asking_price: null,
      },
      { transaction: t }
    );

    await buyerTeam.update(
      {
        budget: parseFloat(buyerTeam.budget) - transferFee,
        player_count: buyerTeam.player_count + 1, // ✅ Increment count
      },
      { transaction: t }
    );

    await sellerTeam.update(
      {
        budget: parseFloat(sellerTeam.budget) + transferFee,
        player_count: sellerTeam.player_count - 1, // ✅ Decrement count
      },
      { transaction: t }
    );
  });

  return { success: true };
};


export const filterTransferMarket = async (
    filters: Filters,
    userId?: number
) => {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;

    const whereClause: any = {
        in_transfer_market: true,
    };

    if (filters.min || filters.max) {
        whereClause.asking_price = {};
        if (filters.min) whereClause.asking_price[Op.gte] = filters.min;
        if (filters.max) whereClause.asking_price[Op.lte] = filters.max;
    }

    const playerInclude: any = {
        model: db.Player,
        as: 'player',
        attributes: ['id', 'name', 'position'],
    };

    if (filters.playerName) {
        playerInclude.where = {
            name: {
                [Op.like]: `%${filters.playerName.toLowerCase()}%`,
            },
        };
    }

    const teamInclude: any = {
        model: db.Team,
        as: 'team',
        attributes: ['id', 'name', 'user_id', 'player_count'],
        where: {}, // add this to filter by userId
    };

    if (filters.teamName) {
        teamInclude.where.name = {
            [Op.like]: `%${filters.teamName.toLowerCase()}%`,
        };
    }

    // Filter out current user's players in the DB query itself
    if (userId !== undefined) {
        teamInclude.where.user_id = {
            [Op.ne]: userId,
        };
    }

    teamInclude.where.player_count = {
        [Op.gte]: 16
    }

    // Execute query
    const { rows, count } = await db.TeamPlayer.findAndCountAll({
        where: whereClause,
        include: [playerInclude, teamInclude],
        limit,
        offset,
        order: [['asking_price', 'ASC']],
    });

    return {
        data: rows,
        pagination: {
            page,
            limit,
            total: count,
            totalPages: Math.ceil(count / limit),
        },
    };
};



const TransferMarketService = {
    listTeamPlayersForSell,
    toggleSellStatus,
    buyPlayer,
    filterTransferMarket,
};

export default TransferMarketService;

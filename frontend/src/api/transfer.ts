import axiosInstance, { endpoints } from '../utils/axios';
import { withToast } from '../utils/toastify';

// List team players currently for sale
export const getPlayersForSell = async () => {
  try {
    const response = await axiosInstance.get(endpoints.transfer.players);
    return response.data;
  } catch (error) {
    console.error('Error fetching players for sell:', error);
    throw error;
  }
};

// Toggle a player’s transfer market status
export const toggleSellStatus = async (
  teamPlayerId: number,
  inTransferMarket: boolean,
  askingPrice?: number
) => {
  const response = await withToast(axiosInstance.post(endpoints.transfer.sell, {
    teamPlayerId,
    inTransferMarket,
    askingPrice,
  }), 'Failed to Update Status of Player');
  return response.data;
};

// Buy a player
export const buyPlayer = async (teamPlayerId: number) => {
  const response = await withToast(axiosInstance.post(endpoints.transfer.buy, {
    teamPlayerId,
  }), 'Failed to Buy New Player.');
  return response.data;
};

// Filter players from the transfer market
export const filterTransferMarket = async ({
  playerName,
  teamName,
  min,
  max,
  page,
}: {
  playerName?: string;
  teamName?: string;
  min?: number;
  max?: number;
  page: number;
}) => {
  try {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (playerName) params.append('playerName', playerName);
    if (teamName) params.append('teamName', teamName);
    if (min !== undefined) params.append('min', min.toString());
    if (max !== undefined) params.append('max', max.toString());

    const response = await axiosInstance.get(`${endpoints.transfer.market}?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error filtering transfer market:', error);
    throw error;
  }
};

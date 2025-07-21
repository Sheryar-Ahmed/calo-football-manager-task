import axiosInstance, { endpoints } from '../utils/axios';

// team status chceking
export const teamStatus = async () => {
    try {
        const response = await axiosInstance.get(endpoints.team.status);
        return response.data;
    } catch (error) {
        console.error('Error team status checking:', error);
        throw error;
    }
};

// user team
export const userTeam = async () => {
    try {
        const response = await axiosInstance.get(endpoints.team.userTeam);
        return response.data;
    } catch (error) {
        console.error('Error team status checking:', error);
        throw error;
    }
}
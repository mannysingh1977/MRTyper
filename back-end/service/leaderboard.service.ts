import { Leaderboard } from '../model/leaderboard';
import leaderboardDb from '../repository/leaderboard.db';

const getAllLeaderboards = async (): Promise<Leaderboard[]> => {
    return await leaderboardDb.getAllLeaderboards();
};

const getLeaderboardByType = async (type: number): Promise<Leaderboard> => {
    const leaderboard = await leaderboardDb.getLeaderboardByType({ type });
    if (!leaderboard) throw new Error(`Leaderboard doesn't exist with type ${type}.`);
    return leaderboard;
};

export default {
    getAllLeaderboards,
    getLeaderboardByType,
};

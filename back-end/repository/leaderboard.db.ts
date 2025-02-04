import { Leaderboard } from '../model/leaderboard';
import database from '../util/database';

const getAllLeaderboards = async (): Promise<Leaderboard[]> => {
    try {
        const leaderboardsPrisma = await database.leaderboard.findMany({
            include: {
                scores: {
                    orderBy: {
                        wpm: 'desc',
                    },
                    distinct: ['userId'],
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!leaderboardsPrisma) {
            return [];
        }

        const leaderboards = leaderboardsPrisma.map((leaderboardPrisma) => {
            const limitedScores = leaderboardPrisma.scores.slice(0, leaderboardPrisma.maxScores);
            return Leaderboard.from({
                ...leaderboardPrisma,
                scores: limitedScores,
            });
        });

        return leaderboards;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getLeaderboardByType = async ({ type }: { type: number }): Promise<Leaderboard | null> => {
    try {
        const leaderboardPrisma = await database.leaderboard.findFirst({
            where: { type },
            include: {
                scores: {
                    orderBy: {
                        wpm: 'desc',
                    },
                    distinct: ['userId'],
                    include: {
                        user: true,
                    },
                },
            },
        });

        if (!leaderboardPrisma) {
            return null;
        }

        const limitedScores = leaderboardPrisma.scores.slice(0, leaderboardPrisma.maxScores);

        return Leaderboard.from({
            ...leaderboardPrisma,
            scores: limitedScores,
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllLeaderboards,
    getLeaderboardByType,
};

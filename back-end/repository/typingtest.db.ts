import { TypingTest } from '../model/typingTest';
import database from '../util/database';

const getAllTypingTests = async (): Promise<TypingTest[]> => {
    try {
        const typingTestsPrisma = await database.typingTest.findMany({
            include: { user: true },
        });
        return typingTestsPrisma.map((typingTestPrisma) => TypingTest.from(typingTestPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getTypingTestsByUsername = async (username: string): Promise<TypingTest[]> => {
    try {
        const typingTestsPrisma = await database.typingTest.findMany({
            where: {
                user: {
                    username,
                },
            },
            include: { user: true },
        });
        return typingTestsPrisma.map((typingTestPrisma) => TypingTest.from(typingTestPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const deleteTypingTestsByUserId = async (userId: number): Promise<void> => {
    try {
        await database.typingTest.deleteMany({
            where: {
                userId,
            },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getTypingTestsByUser = async (userId: number): Promise<TypingTest[]> => {
    try {
        const typingTestsPrisma = await database.typingTest.findMany({
            where: { userId },
            include: { user: true },
        });
        return typingTestsPrisma.map((typingTestPrisma) => TypingTest.from(typingTestPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getTypingTestsByUserAndType = async (userId: number, type: string): Promise<TypingTest[]> => {
    try {
        const typingTestsPrisma = await database.typingTest.findMany({
            where: { userId, type },
            include: { user: true },
        });
        return typingTestsPrisma.map((typingTestPrisma) => TypingTest.from(typingTestPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createTypingTest = async (typingTest: TypingTest): Promise<TypingTest> => {
    try {
        const typingTestPrisma = await database.typingTest.create({
            data: {
                wpm: typingTest.getWpm(),
                accuracy: typingTest.getAccuracy(),
                time: typingTest.getTime(),
                type: typingTest.getType(),
                userId: typingTest.getUser().getId()!,
                ...(typingTest.getGameId() !== undefined && {
                    gameId: typingTest.getGameId()
                }),
                ...(typingTest.getLeaderboardId() !== undefined && {
                    leaderboardId: typingTest.getLeaderboardId()
                })
            },
            include: { user: true }
        });
        return TypingTest.from(typingTestPrisma);
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllTypingTests,
    getTypingTestsByUsername,
    getTypingTestsByUser,
    getTypingTestsByUserAndType,
    deleteTypingTestsByUserId,
    createTypingTest,
};

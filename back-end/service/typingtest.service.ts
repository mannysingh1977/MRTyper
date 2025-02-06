import { UnauthorizedError } from 'express-jwt';
import { TypingTest } from '../model/typingTest';
import { Game } from '../model/game';
import { User } from '../model/user';
import typingtestDb from '../repository/typingtest.db';
import userDB from '../repository/user.db';
import gameDb from '../repository/game.db';

const getTypingTest = async ({
                                 username,
                                 role,
                                 selectedUser,
                             }: {
    username: string;
    role: string;
    selectedUser?: string;
}): Promise<TypingTest[]> => {
    if (role === 'admin' || role === 'moderator') {
        if (selectedUser) {
            return typingtestDb.getTypingTestsByUsername(selectedUser);
        }
        return typingtestDb.getAllTypingTests();
    } else if (role === 'player') {
        return typingtestDb.getTypingTestsByUsername(username);
    } else {
        throw new UnauthorizedError('credentials_required', {
            message: 'Wrong credentials, You are not authorized to access this resource.',
        });
    }
};

const getAllTypingTests = async (): Promise<TypingTest[]> => {
    return typingtestDb.getAllTypingTests();
};

const getTypingTestsByUser = async (userId: number): Promise<TypingTest[]> => {
    const user = await userDB.getUserById(userId);
    if (!user) {
        throw new Error(`User with ID ${userId} does not exist.`);
    }

    return typingtestDb.getTypingTestsByUser(userId);
};

const getTypingTestsByUserAndType = async (userId: number, type: string): Promise<TypingTest[]> => {
    const user = await userDB.getUserById(userId);
    if (!user) {
        throw new Error(`User with ID ${userId} does not exist.`);
    }

    if (type !== 'singleplayer' && type !== 'multiplayer') {
        throw new Error('Invalid type. Type must be either singleplayer or multiplayer.');
    }

    return typingtestDb.getTypingTestsByUserAndType(userId, type);
};


interface CreateTypingTestParams {
    wpm: number;
    accuracy: number;
    time: number;
    type: string;
    username: string;
}

const createTypingTest = async ({
                                    wpm,
                                    accuracy,
                                    time,
                                    type,
                                    username
                                }: CreateTypingTestParams): Promise<TypingTest> => {
    // Get user by username
    const user = await userDB.getUserByUsername({username});
    if (!user) {
        throw new Error(`User ${username} does not exist.`);
    }

    if (type !== 'singleplayer' && type !== 'multiplayer') {
        throw new Error('Type must be either "singleplayer" or "multiplayer"');
    }

    // Create new game
    const game = new Game({
        startDate: new Date(Date.now() - (time * 1000)),
        endDate: new Date(),
        users: [user]
    });

    let leaderboardID = 0;
    if(time == 15){
        leaderboardID = 1;
    } else if(time == 30){
        leaderboardID = 2;
    } else if(time == 60){
        leaderboardID = 3;
    }

    const savedGame = await gameDb.createGame(game);

    // Create typing test
    const typingTest = new TypingTest({
        wpm,
        accuracy,
        time,
        type,
        user,
        gameId: savedGame.getId(),
        leaderboardId: leaderboardID
    });



    return typingtestDb.createTypingTest(typingTest);
};

export default {
    getAllTypingTests,
    getTypingTest,
    getTypingTestsByUser,
    getTypingTestsByUserAndType,
    createTypingTest
};

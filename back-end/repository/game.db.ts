import { Game } from '../model/game';
import database from '../util/database';

const getAllGamesWithUsers = async (): Promise<Game[]> => {
    try {
        const gamesPrisma = await database.game.findMany({
            include: {
                users: true,
            },
        });
        return gamesPrisma.map((gamePrisma) => Game.from(gamePrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getGameByIdWithUsers = async (id: number): Promise<Game | null> => {
    try {
        const gamePrisma = await database.game.findUnique({
            where: { id },
            include: {
                users: true,
            },
        });

        return gamePrisma ? Game.from(gamePrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const removeGamesByUserId = async (userId: number): Promise<void> => {
    try {
        const games = await database.game.findMany({
            where: {
                users: {
                    some: {
                        id: userId,
                    },
                },
            },
        });

        for (const game of games) {
            await database.game.delete({
                where: { id: game.id },
            });
        }
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createGame = async (game: Game): Promise<Game> => {
    const createdGame = await database.game.create({
        data: {
            startDate: game.getStartDate(),
            endDate: game.getEndDate(),
            users: {
                connect: game.getUsers().map(user => ({id: user.getId()}))
            },
        },
        include: {
            users: true
        }
    });
    return Game.from(createdGame);
};

export default {
    getAllGamesWithUsers,
    getGameByIdWithUsers,
    removeGamesByUserId,
    createGame,
};

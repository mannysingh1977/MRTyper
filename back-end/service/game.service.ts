import { Game } from '../model/game';
import gameDb from '../repository/game.db';

const getAllGamesWithUsers = async (): Promise<Game[]> => {
    return gameDb.getAllGamesWithUsers();
};

const getGameByIdWithUsers = async (id: number): Promise<Game | null> => {
    const game = await gameDb.getGameByIdWithUsers(id);
    if (!game) {
        throw new Error(`Game with ID ${id} does not exist.`);
    }

    return game;
};

export default {
    getAllGamesWithUsers,
    getGameByIdWithUsers,
};

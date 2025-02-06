import express, { Request, Response, NextFunction } from 'express';
import gameService from '../service/game.service';

const gameRouter = express.Router();

gameRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const games = await gameService.getAllGamesWithUsers();
        res.status(200).json(games);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    }
});

gameRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const game = await gameService.getGameByIdWithUsers(Number(req.params.id));
        if (!game) {
            return res.status(404).json({
                status: 'error',
                errorMessage: `Game with ID ${req.params.id} not found.`,
            });
        }
        res.status(200).json(game);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    }
});

export { gameRouter };

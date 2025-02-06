import express, { Request, Response, NextFunction } from 'express';
import leaderboardService from '../service/leaderboard.service';

const leaderboardRouter = express.Router();

leaderboardRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const leaderboards = await leaderboardService.getAllLeaderboards();
        res.status(200).json(leaderboards);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    }
});

leaderboardRouter.get('/:type', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const leaderboard = await leaderboardService.getLeaderboardByType(Number(req.params.type));
        if (!leaderboard) {
            return res.status(404).json({
                status: 'error',
                errorMessage: `Leaderboard with type ${req.params.type} not found.`,
            });
        }
        res.status(200).json(leaderboard);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    }
});

export { leaderboardRouter };

import express, { NextFunction, Request, Response } from 'express';
import typingtestService from '../service/typingtest.service';

const typingtestRouter = express.Router();

typingtestRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: string } };
        const { username, role } = request.auth;
        const { selectedUser } = req.query;
        const typingTests = await typingtestService.getTypingTest({ username, role, selectedUser: selectedUser as string, });
        res.status(200).json(typingTests);
    } catch (error) {
        next(error);
    }
});

typingtestRouter.get('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const typingTests = await typingtestService.getTypingTestsByUser(Number(req.params.id));
        res.status(200).json(typingTests);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    }
});

typingtestRouter.get('/user/:id/:type', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const typingTests = await typingtestService.getTypingTestsByUserAndType(
            Number(req.params.id),
            req.params.type
        );
        res.status(200).json(typingTests);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    }
});

typingtestRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: string } };
        const { username } = request.auth;
        const { wpm, accuracy, time, type } = req.body;

        const typingTest = await typingtestService.createTypingTest({
            wpm,
            accuracy,
            time,
            type,
            username
        });

        res.status(201).json(typingTest);
    } catch (error) {
        next(error);
    }
});

export { typingtestRouter };

import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { UserInput } from '../types';

const userRouter = express.Router();

userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    }
});

userRouter.get('/players', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const players = await userService.getAllPlayers();
        res.status(200).json(players);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    }
});

userRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserById(Number(req.params.id));
        if (!user) {
            return res.status(404).json({
                status: 'error',
                errorMessage: `User with ID ${req.params.id} not found.`,
            });
        }
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    }
});

userRouter.get('/:username', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await userService.getUserByUsername({ username: req.params.username });
        res.status(200).json(user);
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ status: 'error', errorMessage: error.message });
        }
    }
});

userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        const response = await userService.authenticate(userInput);
        res.status(200).json({ message: 'Authentication succesful', ...response });
    } catch (error) {
        next(error);
    }
});

userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput = <UserInput>req.body;
        await userService.createUser(userInput);
        const authenticate = await userService.authenticate(userInput);
        res.status(200).json({ message: 'Authentication succesful', ...authenticate });
    } catch (error) {
        next(error);
    }
});

userRouter.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id, 10);
    try {
        await userService.deleteUser(userId);
        res.status(200).json({ message: 'User succesfully deleted' });
    } catch (error) {
        next(error);
    }
});

userRouter.put('/:id/username', async (req: Request, res: Response, next: NextFunction) => {
    const userId = parseInt(req.params.id, 10);
    const { username } = req.body;

    try {
        await userService.updateUsername(userId, username);
        res.status(200).send({ message: 'Username updated successfully' });
    } catch (error) {
        if (error instanceof Error && error.message.includes('does not exist')) {
            res.status(404).send({ error: error.message });
        } else if (error instanceof Error && error.message.includes('is already taken')) {
            res.status(409).send({ error: error.message });
        } else {
            next(error);
        }
    }
});

export { userRouter };

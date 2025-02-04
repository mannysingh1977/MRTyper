import { User } from './user';
import { Game as GamePrisma, User as UserPrisma } from '@prisma/client';

export class Game {
    readonly id?: number;
    readonly startDate: Date;
    readonly endDate: Date;
    readonly users: User[];

    constructor(game: { id?: number; startDate: Date; endDate: Date; users: User[] }) {
        this.validate(game);

        this.id = game.id;
        this.startDate = game.startDate;
        this.endDate = game.endDate;
        this.users = game.users;
    }

    getId(): number | undefined {
        return this.id;
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getUsers(): User[] {
        return this.users;
    }

    validate(game: { startDate: Date; endDate: Date; users: User[] }) {
        if (!game.startDate) {
            throw new Error('Start date is required');
        }
        if (!game.endDate) {
            throw new Error('End date is required');
        }
        if (game.startDate > game.endDate) {
            throw new Error('Start date cannot be after end date');
        }
        if (!game.users || game.users.length === 0) {
            throw new Error('At least one player is required');
        }
    }

    equals(game: Game): boolean {
        return (
            this.startDate === game.getStartDate() &&
            this.endDate === game.getEndDate() &&
            this.users.length === game.getUsers().length &&
            this.users.every((user, index) => user.equals(game.getUsers()[index]))
        );
    }

    static from({ id, startDate, endDate, users }: GamePrisma & { users: UserPrisma[] }) {
        return new Game({
            id,
            startDate,
            endDate,
            users: users.map((user) => User.from(user)),
        });
    }
}

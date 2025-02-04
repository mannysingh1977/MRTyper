import {
    Leaderboard as LeaderboardPrisma,
    TypingTest as TypingTestPrisma,
    User as UserPrisma,
} from '@prisma/client';
import { TypingTest } from './typingTest';

export class Leaderboard {
    readonly id?: number;
    readonly type: number;
    readonly maxScores: number;
    readonly scores: TypingTest[];

    constructor(leaderboard: {
        id?: number;
        type: number;
        maxScores: number;
        scores: TypingTest[];
    }) {
        this.validate(leaderboard);

        this.id = leaderboard.id;
        this.type = leaderboard.type;
        this.maxScores = leaderboard.maxScores;
        this.scores = leaderboard.scores;
    }

    getId(): number | undefined {
        return this.id;
    }

    getType(): number {
        return this.type;
    }

    getMaxScores(): number {
        return this.maxScores;
    }

    getScores(): TypingTest[] {
        return this.scores;
    }

    validate(leaderboard: { scores: TypingTest[]; maxScores: number; type: number }) {
        if (!leaderboard.scores || leaderboard.scores.length === 0) {
            throw new Error('Scores must contain at least one typing test');
        }
        if (!leaderboard.maxScores || leaderboard.maxScores <= 0) {
            throw new Error('Max players must be a positive integer');
        }
        if (leaderboard.type === undefined || leaderboard.type === null) {
            throw new Error('Type is required');
        }
        if (![15, 30, 60].includes(leaderboard.type)) {
            throw new Error('Type must be either 15, 30, or 60');
        }
    }

    equals(leaderboard: Leaderboard): boolean {
        return (
            this.id === leaderboard.getId() &&
            this.maxScores === leaderboard.getMaxScores() &&
            this.type === leaderboard.getType() &&
            this.scores.length === leaderboard.getScores().length
        );
    }

    static from({
                    id,
                    type,
                    maxScores,
                    scores,
                }: LeaderboardPrisma & { scores: (TypingTestPrisma & { user: UserPrisma })[] }): Leaderboard {
        return new Leaderboard({
            id,
            type,
            maxScores,
            scores: scores.map((score) => TypingTest.from(score)),
        });
    }
}

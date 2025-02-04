import { TypingTest as TypingTestPrisma, User as UserPrisma } from '@prisma/client';
import { User } from './user';
export class TypingTest {
    readonly id?: number;
    readonly wpm: number;
    readonly accuracy: number;
    readonly time: number;
    readonly type: string;
    readonly user: User;
    readonly gameId?: number;
    readonly leaderboardId?: number;

    constructor(typingTest: {
        id?: number;
        wpm: number;
        accuracy: number;
        time: number;
        type: string;
        user: User;
        gameId?: number;
        leaderboardId?: number;
    }) {
        this.validate(typingTest);

        this.id = typingTest.id;
        this.wpm = typingTest.wpm;
        this.accuracy = typingTest.accuracy;
        this.time = typingTest.time;
        this.type = typingTest.type;
        this.user = typingTest.user;
        this.gameId = typingTest.gameId;
        this.leaderboardId = typingTest.leaderboardId;
    }

    getId(): number | undefined {
        return this.id;
    }

    getWpm(): number {
        return this.wpm;
    }

    getAccuracy(): number {
        return this.accuracy;
    }

    getTime(): number {
        return this.time;
    }

    getType(): string {
        return this.type;
    }

    getUser(): User {
        return this.user;
    }

    getGameId(): number | undefined {
        return this.gameId;
    }

    getLeaderboardId(): number | undefined {
        return this.leaderboardId;
    }

    validate(typingTest: {
        wpm: number;
        accuracy: number;
        time: number;
        type: string;
        user: User;
        gameId?: number;
        leaderboardId?: number;
    }) {
        if (typingTest.wpm === undefined || typingTest.wpm === null) {
            throw new Error('WPM is required');
        }
        if (typingTest.wpm < 0) {
            throw new Error('WPM must be a positive value');
        }
        if (typingTest.accuracy === undefined || typingTest.accuracy === null) {
            throw new Error('Accuracy is required');
        }
        if (typingTest.accuracy < 0 || typingTest.accuracy > 100) {
            throw new Error('Accuracy must be a number between 0 and 100');
        }
        if (typingTest.time === undefined || typingTest.time === null) {
            throw new Error('Time is required');
        }
        if (![15, 30, 60].includes(typingTest.time)) {
            throw new Error('Time must be either 15, 30, or 60');
        }
        if (!typingTest.type?.trim()) {
            throw new Error('Type is required');
        }
        if (typingTest.type !== 'singleplayer' && typingTest.type !== 'multiplayer') {
            throw new Error('Type must be either "singleplayer" or "multiplayer"');
        }

    }

    equals(typingTest: TypingTest): boolean {
        return (
            this.id === typingTest.getId() &&
            this.wpm === typingTest.getWpm() &&
            this.accuracy === typingTest.getAccuracy() &&
            this.time === typingTest.getTime() &&
            this.type === typingTest.getType() &&
            this.user.id === typingTest.getUser().id &&
            this.gameId === typingTest.getGameId() &&
            this.leaderboardId === typingTest.getLeaderboardId()
        );
    }

    static from({
                    id,
                    wpm,
                    accuracy,
                    time,
                    type,
                    user,
                    gameId,
                    leaderboardId,
                }: TypingTestPrisma & { user: UserPrisma }): TypingTest {
        return new TypingTest({
            id,
            wpm,
            accuracy,
            time,
            type,
            user: User.from(user),
            gameId: gameId ?? undefined,
            leaderboardId: leaderboardId ?? undefined,
        });
    }

    toPrisma() {
        return {
            wpm: this.wpm,
            accuracy: this.accuracy,
            time: this.time,
            type: this.type,
            user: this.user,
            gameId: this.gameId,
            leaderboardId: this.leaderboardId,
        };
    }
}

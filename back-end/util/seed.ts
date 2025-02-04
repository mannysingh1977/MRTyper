import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.typingTest.deleteMany();
    await prisma.user.deleteMany();
    await prisma.game.deleteMany();
    await prisma.leaderboard.deleteMany();

    const users = [];
    const usernames = [
        'johndoe',
        'janetoe',
        'michaelking',
        'lukasvandilken',
        'alicekaitlin',
        'bobdebuilder',
    ];
    const emails = [
        'john.doe@ucll.be',
        'jane.toe@ucll.be',
        'michael.king@ucll.be',
        'lukas.vandilken@ucll.be',
        'alice.kaitlin@ucll.be',
        'bob.debuilder@ucll.be',
    ];
    const passwords = [
        'johndoe123',
        'janetoe123',
        'michaelking123',
        'lukasvandilken123',
        'alicekaitlin123',
        'bobdebuilder123',
    ];

    for (let i = 0; i < usernames.length; i++) {
        const user = await prisma.user.create({
            data: {
                username: usernames[i],
                email: emails[i],
                password: await bcrypt.hash(passwords[i], 12),
                role: 'player',
            },
        });
        users.push(user);
    }

    const admin = await prisma.user.create({
        data: {
            username: 'lindawalker',
            email: 'linda.walker@ucll.be',
            password: await bcrypt.hash('lindawalker123', 12),
            role: 'admin',
        },
    });

    const moderator = await prisma.user.create({
        data: {
            username: 'karljackson',
            email: 'karl.jackson@mrtyper.be',
            password: await bcrypt.hash('karljackson123', 12),
            role: 'moderator',
        },
    });

    const leaderboard15 = await prisma.leaderboard.create({
        data: {
            maxScores: 5,
            type: 15,
        },
    });

    const leaderboard30 = await prisma.leaderboard.create({
        data: {
            maxScores: 5,
            type: 30,
        },
    });

    const leaderboard60 = await prisma.leaderboard.create({
        data: {
            maxScores: 5,
            type: 60,
        },
    });

    for (let i = 0; i < users.length; i++) {
        const user = users[i];

        for (let j = 0; j < 5; j++) {
            const wpm = Math.floor(Math.random() * 100) + 50;
            const accuracy = Math.floor(Math.random() * 20) + 80;

            const game = await prisma.game.create({
                data: {
                    startDate: new Date(),
                    endDate: new Date(),
                    users: {
                        connect: { id: user.id },
                    },
                },
            });

            await prisma.typingTest.create({
                data: {
                    wpm,
                    accuracy,
                    time: 15,
                    type: 'singleplayer',
                    user: {
                        connect: { id: user.id },
                    },
                    game: {
                        connect: { id: game.id },
                    },
                    leaderboard: {
                        connect: { id: leaderboard15.id },
                    },
                },
            });
        }

        for (let j = 0; j < 3; j++) {
            const wpm = Math.floor(Math.random() * 100) + 50;
            const accuracy = Math.floor(Math.random() * 20) + 80;

            const game = await prisma.game.create({
                data: {
                    startDate: new Date(),
                    endDate: new Date(),
                    users: {
                        connect: { id: user.id },
                    },
                },
            });

            await prisma.typingTest.create({
                data: {
                    wpm,
                    accuracy,
                    time: 30,
                    type: 'singleplayer',
                    user: {
                        connect: { id: user.id },
                    },
                    game: {
                        connect: { id: game.id },
                    },
                    leaderboard: {
                        connect: { id: leaderboard30.id },
                    },
                },
            });
        }

        for (let j = 0; j < 2; j++) {
            const wpm = Math.floor(Math.random() * 100) + 50;
            const accuracy = Math.floor(Math.random() * 20) + 80;

            const game = await prisma.game.create({
                data: {
                    startDate: new Date(),
                    endDate: new Date(),
                    users: {
                        connect: { id: user.id },
                    },
                },
            });

            await prisma.typingTest.create({
                data: {
                    wpm,
                    accuracy,
                    time: 60,
                    type: 'singleplayer',
                    user: {
                        connect: { id: user.id },
                    },
                    game: {
                        connect: { id: game.id },
                    },
                    leaderboard: {
                        connect: { id: leaderboard60.id },
                    },
                },
            });
        }
    }

    const games = [];
    const gameTimes = [
        { start: new Date(2024, 10, 2, 8, 30, 0), end: new Date(2024, 10, 2, 8, 31, 0) },
        { start: new Date(2024, 6, 2, 1, 30, 0), end: new Date(2024, 6, 2, 1, 31, 0) },
        { start: new Date(2024, 1, 23, 16, 27, 0), end: new Date(2024, 1, 23, 16, 28, 0) },
    ];

    for (let i = 0; i < 3; i++) {
        const game = await prisma.game.create({
            data: {
                startDate: gameTimes[i].start,
                endDate: gameTimes[i].end,
                users: {
                    connect: [{ id: users[i * 2].id }, { id: users[i * 2 + 1].id }],
                },
            },
        });
        games.push(game);
    }

    const multiplayer1 = await prisma.typingTest.create({
        data: {
            wpm: 145,
            accuracy: 99,
            time: 15,
            type: 'multiplayer',
            user: {
                connect: { id: users[0].id },
            },
            game: {
                connect: { id: games[0].id },
            },
        },
    });

    const multiplayer2 = await prisma.typingTest.create({
        data: {
            wpm: 100,
            accuracy: 95,
            time: 15,
            type: 'multiplayer',
            user: {
                connect: { id: users[1].id },
            },
            game: {
                connect: { id: games[0].id },
            },
        },
    });

    const multiplayer3 = await prisma.typingTest.create({
        data: {
            wpm: 133,
            accuracy: 97,
            time: 30,
            type: 'multiplayer',
            user: {
                connect: { id: users[2].id },
            },
            game: {
                connect: { id: games[1].id },
            },
        },
    });

    const multiplayer4 = await prisma.typingTest.create({
        data: {
            wpm: 143,
            accuracy: 98,
            time: 30,
            type: 'multiplayer',
            user: {
                connect: { id: users[3].id },
            },
            game: {
                connect: { id: games[1].id },
            },
        },
    });

    const multiplayer5 = await prisma.typingTest.create({
        data: {
            wpm: 145,
            accuracy: 99,
            time: 60,
            type: 'multiplayer',
            user: {
                connect: { id: users[4].id },
            },
            game: {
                connect: { id: games[2].id },
            },
        },
    });

    const multiplayer6 = await prisma.typingTest.create({
        data: {
            wpm: 143,
            accuracy: 98,
            time: 60,
            type: 'multiplayer',
            user: {
                connect: { id: users[5].id },
            },
            game: {
                connect: { id: games[2].id },
            },
        },
    });
};

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();

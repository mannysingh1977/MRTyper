import { User as UserPrisma } from '@prisma/client';

export class User {
    readonly id?: number;
    readonly username: string;
    readonly email: string;
    readonly password: string;
    readonly creationDate: Date;
    readonly role: string;

    constructor(user: {
        id?: number;
        username: string;
        email: string;
        password: string;
        creationDate: Date;
        role: string;
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.creationDate = user.creationDate;
        this.role = user.role;
    }

    getId(): number | undefined {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getCreationDate(): Date {
        return this.creationDate;
    }

    getRole(): string {
        return this.role;
    }

    validate(user: {
        username: string;
        email: string;
        password: string;
        creationDate: Date;
        role: string;
    }) {
        if (!user.username?.trim()) {
            throw new Error('Username is required');
        }

        if (user.username.length < 3 || user.username.length > 50) {
            throw new Error('The username must be between 3 and 50 characters.');
        }

        if (!user.email?.trim()) {
            throw new Error('Email is required');
        }

        const specificEmailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (!specificEmailRegex.test(user.email)) {
            throw new Error('The email format is invalid.');
        }

        if (!user.password?.trim()) {
            throw new Error('Password is required');
        }

        if (user.password.length < 8) {
            throw new Error('The password must be at least 5 characters long.');
        }

        const currentDate = new Date();
        if (user.creationDate > currentDate) {
            throw new Error('Creation date cannot be in the future.');
        }

        if (!user.role?.trim()) {
            throw new Error('Role is required');
        }

        if (!['player', 'admin', 'moderator'].includes(user.role)) {
            throw new Error('The role is not valid. Allowed roles are: player, admin, moderator.');
        }
    }

    equals(user: User): boolean {
        return (
            this.username === user.getUsername() &&
            this.email === user.getEmail() &&
            this.password === user.getPassword() &&
            this.creationDate === user.getCreationDate() &&
            this.role === user.getRole()
        );
    }

    static from({ id, username, email, password, creationDate, role }: UserPrisma): User {
        return new User({
            id,
            username,
            email,
            password,
            creationDate,
            role,
        });
    }
}

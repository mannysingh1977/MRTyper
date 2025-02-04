import { User } from '../model/user';
import database from '../util/database';
import { Role } from '../types';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany();
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getAllPlayers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await database.user.findMany({
            where: {
                role: 'player',
            },
        });
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserById = async (id: number): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findUnique({
            where: { id },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByUsername = async ({ username }: { username: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { username },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByEmail = async ({ email }: { email: string }): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { email },
        });

        return userPrisma ? User.from(userPrisma) : null;
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const createUser = async ({
      username,
      email,
      password,
      creationDate,
      role,
  } : {username: string, email: string, password: string, creationDate: Date, role: Role}): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: { username, email, password, creationDate, role },
        });

        return User.from(userPrisma);
    } catch (error) {
        console.log(error);
        throw new Error('Database error. See error log for details.');
    }
};

const deleteUser = async (userId: number): Promise<void> => {
    try {
        await database.user.delete({
            where: { id: userId },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const updateUsername = async (userId: number, newUsername: string): Promise<void> => {
    try {
        await database.user.update({
            where: { id: userId },
            data: { username: newUsername },
        });
    } catch (error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    getUserByUsername,
    getUserByEmail,
    deleteUser,
    updateUsername,
    getAllPlayers,
};

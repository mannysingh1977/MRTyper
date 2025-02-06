import { User } from '../model/user';
import userDB from '../repository/user.db';
import { AuthenticationResponse, UserInput } from '../types';
import bcrypt from 'bcrypt';
import { generateJwtToken } from '../util/jwt';
import typingtestDb from '../repository/typingtest.db';
import gameDb from '../repository/game.db';

const getAllUsers = async (): Promise<User[]> => {
    return userDB.getAllUsers();
};

const getAllPlayers = async (): Promise<User[]> => {
    return userDB.getAllPlayers();
};

const getUserById = async (id: number): Promise<User | null> => {
    const user = await userDB.getUserById(id);
    if (!user) {
        throw new Error(`User with ID ${id} does not exist.`);
    }
    return user;
};

const getUserByUsername = async ({ username }: { username: string }): Promise<User> => {
    const user = await userDB.getUserByUsername({ username });
    if (!user) {
        throw new Error(`User with username: ${username} does not exist.`);
    }
    return user;
};

const authenticate = async ({ username, password }: UserInput): Promise<AuthenticationResponse> => {
    if (!username || !password) {
        throw new Error('Username and password are required.');
    }

    const user = await userDB.getUserByUsername({ username });

    if (!user) {
        throw new Error(`User with username: ${username} does not exist.`);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        throw new Error('Incorrect password.');
    }

    return {
        token: generateJwtToken({ username, role: user.getRole() }),
        username,
        role: user.getRole(),
    };
};

const createUser = async ({
      username,
      password,
      email,
      creationDate,
      role,
  }: UserInput): Promise<User> => {
    if (!username || !password || !email || !creationDate || !role) {
        throw new Error('Username, password, email, creationDate and role are required.');
    }

    const existing = await userDB.getUserByUsername({ username });
    const existingEmail = await userDB.getUserByEmail({ email });

    if (existing) {
        throw new Error(`User with username ${username} is already registered.`);
    }

    if (existingEmail) {
        throw new Error(`User with email ${email} is already registered.`);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({ username, email, password: hashedPassword, creationDate, role });

    return await userDB.createUser(user);
};

const deleteUser = async (userId: number): Promise<void> => {
    const user = await userDB.getUserById(userId);
    if (!user) {
        throw new Error(`User with ID ${userId} does not exist.`);
    }

    await typingtestDb.deleteTypingTestsByUserId(userId);
    await gameDb.removeGamesByUserId(userId);
    await userDB.deleteUser(userId);
};

const updateUsername = async (userId: number, newUsername: string): Promise<void> => {
    const user = await userDB.getUserById(userId);
    if (!user) {
        throw new Error(`User with ID ${userId} does not exist.`);
    }

    if (user.username === newUsername) {
        throw new Error(`New username ${newUsername} cannot be the same as the current username.`);
    }

    const existingUser = await userDB.getUserByUsername({ username: newUsername });
    if (existingUser) {
        throw new Error(`Username ${newUsername} is already taken.`);
    }

    const updatedUser = new User({ ...user, username: newUsername });
    updatedUser.validate(updatedUser);

    await userDB.updateUsername(userId, newUsername);
};

export default {
    getAllUsers,
    getUserById,
    createUser,
    getUserByUsername,
    authenticate,
    deleteUser,
    updateUsername,
    getAllPlayers,
};

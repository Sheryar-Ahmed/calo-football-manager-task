import db from '../models'; // singleton db instance
import { addToTeamQueue } from '../queues/team-queue';
import { ConflictError, NotFoundError, ValidationError } from '../utils/errors';
import { hashPassword, comparePassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

const loginOrRegister = async (email: string, password: string) => {
  try {
    const existingUser = await db.User.findOne({
      where: { email }, include: [
        {
          model: db.Team,
          as: 'team'
        }
      ]
    });

    if (existingUser) {
      const valid = await comparePassword(password, existingUser.password);
      if (!valid) throw new ConflictError('Invalid credentials');

      const token = generateToken({ userId: existingUser.id });
      return { user: existingUser, token };
    }

    // Create new user and team
    const hashedPassword = await hashPassword(password);
    const newUser = await db.User.create({ email, password: hashedPassword });

    addToTeamQueue({ userId: newUser.id }); // background job runner

    const token = generateToken({ userId: newUser.id });
    return { user: { ...newUser.toJSON() }, token };

  } catch (error) {
    throw error;
  }
}

const profile = async (userId: number | undefined) => {
  if (!userId) {
    throw new ValidationError("UserId is required");
  }
  const user = await db.User.findByPk(userId, {
    attributes: { exclude: ['password'] },
    // include: [{ model: db.Team, as: 'team' }]
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

const AuthService = {
  loginOrRegister,
  profile,
}

export default AuthService;
import bcrypt from 'bcrypt';

export const hashPassword = async (plain: string) => await bcrypt.hash(plain, 10);
export const comparePassword = async (plain: string, hash: string) => await bcrypt.compare(plain, hash);

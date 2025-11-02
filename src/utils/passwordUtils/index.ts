import bcrypt from 'bcrypt';
const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
  try {
    if (!password) {
      throw new Error('Password is required');
    }

    const hash = await bcrypt.hash(password, saltRounds);

    if (!hash) {
      throw new Error('Failed to generate password hash');
    }

    return hash;
  } catch {
    throw new Error(`Password hashing failed`);
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    if (!password) {
      throw new Error('Password is required');
    }

    if (!hashedPassword) {
      throw new Error('Hashed password is required');
    }

    if (typeof password !== 'string' || typeof hashedPassword !== 'string') {
      throw new Error('Password and hash must be strings');
    }

    return await bcrypt.compare(password, hashedPassword);
  } catch {
    throw new Error(`Password comparison failed`);
  }
};

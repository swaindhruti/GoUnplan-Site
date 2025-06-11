import bcrypt from "bcrypt";
const saltRounds = 10;

export const passwordHash = async (password: string): Promise<string> => {
  try {
    if (!password) {
      throw new Error("Password is required");
    }

    const hash = await bcrypt.hash(password, saltRounds);

    if (!hash) {
      throw new Error("Failed to generate password hash");
    }

    return hash;
  } catch (error) {
    console.log(error);
    throw new Error(`Password hashing failed`);
  }
};

export const passwordCompare = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    if (!password) {
      throw new Error("Password is required");
    }

    if (!hashedPassword) {
      throw new Error("Hashed password is required");
    }

    if (typeof password !== "string" || typeof hashedPassword !== "string") {
      throw new Error("Password and hash must be strings");
    }

    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log(error);
    throw new Error(`Password comparison failed`);
  }
};

import "dotenv/config";
import bcrypt from "bcrypt";
const hashPassWord = (pass) => {
  try {
    const saltRounds = +process.env.SALT_ROUNDS || 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(pass, salt);
    return hash;
  } catch (error) {}
};
const comparePassword = async (password, hashPass) => {
  try {
    const match = bcrypt.compare(password, hashPass);
    return match;
  } catch (error) {}
};
export { hashPassWord, comparePassword };

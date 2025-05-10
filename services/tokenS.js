import { Tokens } from "../models/Token.js";
import { v4 as uuid } from "uuid";

export class TokenService {
  createToken = async (userId) => {
    let token = uuid();
    await new Tokens({
      token: token,
      userId: userId,
    }).save();
    return token;
  };
}

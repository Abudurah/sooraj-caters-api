import { Tokens } from "../models/Token.js";
import { Users } from "../models/Users.js";
import { TokenService } from "../services/tokenS.js";
import { passError } from "../utils/errorHandler.js";

export const login = async (req, res, next) => {
  const tokenS = new TokenService();
  try {
    var { userName, password } = req.body || {};

    if (!userName) throw [422, "Please provide a userName or Email"];

    const user = await Users.findOne({
      $or: [
        { userName: userName?.toLowerCase() },
        { email: userName?.toLowerCase() },
      ],
    });

    if (!user) throw [404, "User not found !"];
    else if (user.userRole === "FGHW" && !user.isAdminAuthorized)
      throw [
        401,
        "Your account havn't been authorized, You can login only after admin authorizes the account !",
      ];

    const isPassword = await user.comparePassword(password?.toLowerCase());
    if (!isPassword) throw [422, "Incorrect email or password"];

    const token = await tokenS.createToken(user.id);

    var { password, mailPassword, ...userDetails } = user._doc;

    res.status(200).json({
      userDetails: userDetails,
      userToken: token,
      message: "Successfully logged in",
      success: true,
    });
  } catch (err) {
    next(passError(err));
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req?.headers?.authorization;
    console.log(token);
    if (!token) throw [401, "You are not logged in !"];

    const deletedToken = Tokens.findOneAndDelete({ token });

    if (!deletedToken) throw [401, "Invalid token !"];

    res.status(200).json({ success: true, message: "Successfully logged out" });
  } catch (err) {
    next(passError(err[0] || 500).createError(err));
  }
};

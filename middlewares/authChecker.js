import { Tokens } from "../models/Token.js";

export const checkAuth = async (req, res, callback) => {
  try {
    const token = await Tokens.findOne({
      token: req?.headers?.authorization,
    }).populate("userId");
    if (!token)
      throw {
        status: 401,
        message: "Your connection has expired.Try login again!",
      };
    req.isSuperAdmin = /(superAdmin)/.test(token.userId.userRole);
    req.isAdmin = /(admin|superAdmin)/.test(token.userId.userRole);
    req.user = token.userId;
    callback();
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).json({
      success: false,
      message: [err.message || "Something went wrong! Please try again later."],
    });
  }
};

export const checkAdmin = async (req, res, next) => {
  try {
    await checkAuth(req, res, () => {
      if (!req?.isAdmin)
        throw {
          status: 401,
          message: "You are not authorized to do this action!",
        };
      else next();
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).json({
      success: false,
      message: [err.message || "Something went wrong! Please try again later."],
    });
  }
};

export const checkSuperAdmin = async (req, res, next) => {
  try {
    await checkAuth(req, res, () => {
      if (!req?.isSuperAdmin)
        throw {
          status: 401,
          message: "You are not authorized to do this action!",
        };
      else next();
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500).json({
      success: false,
      message: [err.message || "Something went wrong! Please try again later."],
    });
  }
};

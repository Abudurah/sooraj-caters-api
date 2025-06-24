import { Users } from "../models/Users.js";
import { passError } from "../utils/errorHandler.js";
import webpush from "web-push";

export const signup = async (req, res, next) => {
  try {
    var { email, userName, password, phone } = req.body || {};

    const user = new Users({
      email: email?.toLowerCase(),
      userName: userName?.toLowerCase(),
      password: password?.toLowerCase(),
      phone,
      userRole: "FGHW",
      parentId: "FIRKGGLMNS",
    });

    const error = user.validateSync();
    if (error) throw error;
    else await user.save();

    var { password, ...others } = user?._doc || {};
    res.status(200).json({
      success: true,
      message: "Signup successfull. You can now login.",
      data: others,
    });
  } catch (err) {
    next(passError(err));
  }
};

export const getLogedInUserDetails = async (req, res, next) => {
  try {
    const { user } = req;

    if (!user) throw [404, "No details found, please logout and login again."];

    const { emailSmtp, emailPort, emailPassword, _id, userName, email, phone } =
      user._doc;

    return res.status(200).json({
      success: true,
      data: {
        emailSmtp,
        emailPort,
        _id,
        userName,
        email,
        phone,
        emailPassword,
      },
    });
  } catch (err) {
    next(passError(err));
  }
};

export const editUser = async (req, res, next) => {
  try {
    const {
      userName,
      email,
      phone,
      password,
      emailPassword,
      emailPort,
      emailSmtp,
    } = req.body;

    await Users.findByIdAndUpdate(req.user.id, {
      $set: {
        email: email?.toLowerCase(),
        userName: userName?.toLowerCase(),
        password: password?.toLowerCase(),
        phone,
        emailPassword,
        emailPort,
        emailSmtp,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile edited.",
    });
  } catch (err) {
    next(passError(err));
  }
};

export const subscribePushNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { subscribe } = req.body;

    await Users.findByIdAndUpdate(userId, {
      $set: { pushSubscription: subscribe },
    });

    const payload = JSON.stringify({
      title: "Subscription Successful!",
      body: "You will now receive notifications for your menus.",
    });

    await webpush.sendNotification(subscribe, payload);

    res
      .status(200)
      .json({ success: true, message: "Push notification subscribed." });
  } catch (err) {
    next(passError(err));
  }
};

export const unsubscribePushNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await Users.findByIdAndUpdate(userId, {
      $unset: { pushSubscription: 1 },
    });

    res
      .status(200)
      .json({ success: true, message: "Push notification unsubscribed." });
  } catch (err) {
    next(passError(err));
  }
};

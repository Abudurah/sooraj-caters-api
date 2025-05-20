import { Users } from "../models/Users.js";
import { passError } from "../utils/errorHandler.js";
import webpush from "web-push";

export const signup = async (req, res, next) => {
  try {
    var { email, userName, password, phone } = req.body || {};

    const user = new Users({
      email,
      userName,
      password,
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

export const editUser = async (req, res, next) => {
  try {
    const { userName, email, phone, password } = req.body;

    await Users.findByIdAndUpdate(req.user.id, {
      $set: {
        userName,
        email,
        phone,
        password,
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

import { Users } from "../../models/Users.js";
import { passError } from "../../utils/errorHandler.js";

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

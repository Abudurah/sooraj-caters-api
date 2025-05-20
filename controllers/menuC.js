import { Menu } from "../models/Menu.js";
import { checkPermission } from "../utils/checkPermission.js";
import { passError } from "../utils/errorHandler.js";
import {
  cancelMenuNotification,
  scheduleMenuNotification,
} from "../utils/notificationScheduler.js";

export const createMenu = async (req, res, next) => {
  try {
    var {
      menuName,
      menuDescription,
      clientName,
      venue,
      menuDate,
      price,
      lastPageDescription,
    } = req.body || {};

    const menu = new Menu({
      parentId: req.user.id,
      menuName,
      menuDescription,
      clientName,
      venue,
      menuDate,
      price,
      lastPageDescription,
    });

    const error = menu.validateSync();
    if (error) throw error;
    else await menu.save();

    await scheduleMenuNotification(menu);

    res.status(200).json({
      success: true,
      message: "Successfully created Menu",
      data: menu,
    });
  } catch (err) {
    next(passError(err));
  }
};

export const editMenu = async (req, res, next) => {
  try {
    var {
      menuName,
      menuDescription,
      clientName,
      venue,
      menuDate,
      price,
      lastPageDescription,
      pageOptions,
      details,
    } = req.body || {};

    const options = {
      menuName,
      menuDescription,
      clientName,
      venue,
      menuDate,
      price,
      lastPageDescription,
      pageOptions,
      details,
    };

    const { id } = req.params || {};

    if (pageOptions) {
      if (!Array.isArray(pageOptions)) {
        throw [422, "Page options list must be an array of options."];
      }
      if (pageOptions?.length == 0)
        throw [422, "Atleast one option is needed to create the list"];
    }

    if (details) {
      if (!Array.isArray(details)) {
        throw [422, "Page options list must be an array of options."];
      }
    }

    const menu = await checkPermission(Menu, id, req.user.id);

    if (!menu) throw [404, "The selected menu is not editable."];

    if (menuDate) {
      await scheduleMenuNotification(menu);
      options.notified = false;
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      {
        $set: options,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "successfully edited the menu",
      data: updatedMenu,
    });
  } catch (err) {
    next(passError(err));
  }
};

export const listMenu = async (req, res, next) => {
  try {
    let menuParams = req.query;
    const menu = await Menu.find({
      parentId: req.user.id,
      ...menuParams,
    })
      .populate("details", "detailList detailName")
      .then((menu) =>
        menu.map((data) => ({
          ...data._doc,
          details: data.details.map((x) => ({
            _id: x._id,
            detailName: x.detailName,
            details: x.detailList,
          })),
        }))
      );

    res.status(200).json({
      success: true,
      message: "Fetched all the menu list",
      data: menu,
    });
  } catch (err) {
    next(passError(err));
  }
};

export const deleteMenu = async (req, res, next) => {
  try {
    const { id } = req.params || {};

    const menu = await checkPermission(Menu, id, req.user.id);

    if (!menu) throw [404, "The selected menu is not deletable."];

    await Menu.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Menu deleted successfully",
    });
  } catch (err) {
    next(passError(err));
  }
};

import { Menu } from "../../models/Menu.js";
import { checkPermission } from "../../utils/checkPermission.js";
import { passError } from "../../utils/errorHandler.js";

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
      pageOptions,
      details,
    } = req.body || {};

    if (pageOptions) {
      if (typeof pageOptions == "string") {
        throw [422, "Page options list must be an array of options."];
      }
      if (pageOptions?.length == 0)
        throw [422, "Atleast one option is needed to create the list"];
    }

    if (details) {
      if (typeof details == "string") {
        throw [422, "Page options list must be an array of options."];
      }
      if (details?.length == 0)
        throw [422, "Atleast one option is needed to create the list"];
    }

    const menu = new Menu({
      parentId: req.user.id,
      menuName,
      menuDescription,
      clientName,
      venue,
      menuDate,
      price,
      lastPageDescription,
      pageOptions,
      details,
    });

    const error = menu.validateSync();
    if (error) throw error;
    else await menu.save();

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
    const { id } = req.params || {};

    if (pageOptions) {
      if (typeof pageOptions == "string") {
        throw [422, "Page options list must be an array of options."];
      }
      if (pageOptions?.length == 0)
        throw [422, "Atleast one option is needed to create the list"];
    }

    if (details) {
      if (typeof details == "string") {
        throw [422, "Page options list must be an array of options."];
      }
      if (details?.length == 0)
        throw [422, "Atleast one option is needed to create the list"];
    }

    const menu = await checkPermission(Menu, id, req.user.id);

    if (!menu) throw [404, "The selected menu is not editable."];

    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      {
        $set: {
          menuName,
          menuDescription,
          clientName,
          venue,
          menuDate,
          price,
          lastPageDescription,
          pageOptions,
          details,
        },
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
    console.log(menuParams);
    const menu = await Menu.find({
      parentId: req.user.id,
      ...menuParams,
    })
      .populate("details", "detailList detailName")
      .then((menu) =>
        menu.map((data) => ({
          ...data._doc,
          details: data.details.map((x) => ({
            id: x._id,
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

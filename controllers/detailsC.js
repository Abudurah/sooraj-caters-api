import { Details } from "../models/Details.js";
import { checkPermission } from "../utils/checkPermission.js";
import { passError } from "../utils/errorHandler.js";

export const createDetails = async (req, res, next) => {
  try {
    var { detailList, detailName } = req.body || {};

    if (typeof detailList == "string") {
      throw [422, "Detail list must be an array of details."];
    }
    if (detailList?.length == 0 || !detailList)
      throw [422, "Atleast one detail is needed to create the list"];

    const details = new Details({
      parentId: req.user.id,
      detailName,
      detailList,
    });

    const error = details.validateSync();
    if (error) throw error;
    else await details.save();

    res.status(200).json({
      success: true,
      message: "Created detail list",
      data: details,
    });
  } catch (err) {
    next(passError(err));
  }
};

export const editDetails = async (req, res, next) => {
  try {
    var { detailList, detailName } = req.body || {};
    const { id } = req.params || {};

    if (typeof detailList == "string") {
      throw [422, "Detail list must be an array of details."];
    }
    if (detailList?.length == 0 || !detailList)
      throw [422, "Atleast one detail is needed to create the list"];

    const details = await checkPermission(Details, id, req.user.id);

    if (!details) throw [404, "The selected details is not editable."];

    const updatedDetails = await Details.findByIdAndUpdate(
      id,
      {
        $set: { detailList, detailName },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Detail list edited",
      data: updatedDetails,
    });
  } catch (err) {
    next(passError(err));
  }
};

export const listDetails = async (req, res, next) => {
  try {
    const { excludeIds } = req.query || {};

    let params = {};

    if (excludeIds?.split(",").length > 0 && excludeIds?.length > 0) {
      params._id = { $nin: excludeIds.split(",") };
    }

    const details = await Details.find({
      parentId: req.user.id,
      ...params,
    }).then((data) =>
      data.map((detail) => {
        return {
          ...detail._doc,
          details: detail.detailList,
          detailList: undefined,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Fetched all the details",
      data: details,
    });
  } catch (err) {
    next(passError(err));
  }
};

export const deleteDetails = async (req, res, next) => {
  try {
    const { id } = req.params || {};

    const details = await checkPermission(Details, id, req.user.id);

    if (!details) throw [404, "The selected details is not deletable."];

    await Details.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Detail list deleted",
    });
  } catch (err) {
    next(passError(err));
  }
};

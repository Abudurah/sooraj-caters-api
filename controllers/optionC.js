import { Options } from "../models/Options.js";
import { checkPermission } from "../utils/checkPermission.js";
import { passError } from "../utils/errorHandler.js";

export const createOptions = async (req, res, next) => {
  try {
    var { name, optionType } = req.body || {};

    const option = new Options({
      parentId: req.user.id,
      name,
      optionType,
    });

    const error = option.validateSync();
    if (error) throw error;
    else await option.save();

    res.status(200).json({
      success: true,
      message: "Options created",
      data: option,
    });
  } catch (err) {
    next(passError(err));
  }
};

export const editOptions = async (req, res, next) => {
  try {
    var { name, optionType } = req.body || {};
    const { id } = req.params || {};

    const option = await checkPermission(Options, id, req.user.id);

    if (!option) throw [404, "The selected option is not editable."];

    const updatedOptions = await Options.findByIdAndUpdate(
      id,
      {
        $set: { name, optionType },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Options edited",
      data: updatedOptions,
    });
  } catch (err) {
    next(passError(err));
  }
};

export const listOptions = async (req, res, next) => {
  try {
    const options = await Options.find({
      parentId: req.user.id,
    });

    res.status(200).json({
      success:true,
      message:'Fetched all the options',
      data:options
    })
  } catch (err) {
    next(passError(err));
  }
};

export const deleteOptions = async (req, res, next) => {
  try {
    const { id } = req.params || {};

    const option = await checkPermission(Options, id, req.user.id);

    if (!option) throw [404, "The selected option is not editable."];

    await Options.findByIdAndDelete(
      id
    );

    res.status(200).json({
      success: true,
      message: "Option deleted"
    });
  } catch (err) {
    next(passError(err));
  }
};
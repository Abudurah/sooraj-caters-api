import mongoose from "mongoose";

const newSchema = mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    optionType: {
      type: String,
      enum: ["H1", "H2", "H3", "H4", "H5", "ITEM", "ALL"],
      default: "ALL",
    },
  },
  { timestamps: true }
);

export const Options = mongoose.model("Options", newSchema);

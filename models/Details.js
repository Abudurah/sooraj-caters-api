import mongoose from "mongoose";

const newSchema = mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    detailName: {
      type: String,
      required:true
    },
    detailList: {
      type: [
        {
          text: {
            type: String,
            required: true,
          },
          type: {
            type: String,
            required: true,
            enum: ["H1", "H2", "H3", "H4", "H5", "ITEM"],
          },
          desc: {
            type: String,
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export const Details = mongoose.model("Details", newSchema);

import mongoose from "mongoose";

const documentSchema = mongoose.Schema(
  {
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["CERTIFICATE", "AGREEMENT", "OTHER"],
      default: "OTHER",
    },
    recipientName: {
      type: String,
      default: "",
    },
    documentDate: {
      type: Date,
    },
    showCompanySignature: {
      type: Boolean,
      default: false,
    },
    showRecipientSignature: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Document = mongoose.model("Document", documentSchema);

import { Document } from "../models/Document.js";
import { checkPermission } from "../utils/checkPermission.js";
import { passError } from "../utils/errorHandler.js";

export const createDocument = async (req, res, next) => {
  try {
    const { title, content, type, recipientName, documentDate, showCompanySignature, showRecipientSignature } = req.body || {};

    const doc = new Document({
      parentId: req.user.id,
      title,
      content,
      type,
      recipientName,
      documentDate,
      showCompanySignature,
      showRecipientSignature,
    });

    const error = doc.validateSync();
    if (error) throw error;
    await doc.save();

    res.status(200).json({ success: true, message: "Document created successfully", data: doc });
  } catch (err) {
    next(passError(err));
  }
};

export const editDocument = async (req, res, next) => {
  try {
    const { id } = req.params || {};
    const { title, content, type, recipientName, documentDate, showCompanySignature, showRecipientSignature } = req.body || {};

    const doc = await checkPermission(Document, id, req.user.id);
    if (!doc) throw [404, "The selected document is not editable."];

    const updated = await Document.findByIdAndUpdate(
      id,
      { $set: { title, content, type, recipientName, documentDate, showCompanySignature, showRecipientSignature } },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Document updated successfully", data: updated });
  } catch (err) {
    next(passError(err));
  }
};

export const listDocuments = async (req, res, next) => {
  try {
    const filter = { parentId: req.user.id };
    if (req.query.type && req.query.type !== "ALL") filter.type = req.query.type;

    const docs = await Document.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, message: "Fetched all documents", data: docs });
  } catch (err) {
    next(passError(err));
  }
};

export const deleteDocument = async (req, res, next) => {
  try {
    const { id } = req.params || {};
    const doc = await checkPermission(Document, id, req.user.id);
    if (!doc) throw [404, "The selected document is not deletable."];

    await Document.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Document deleted successfully" });
  } catch (err) {
    next(passError(err));
  }
};

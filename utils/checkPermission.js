export const checkPermission = async (model, id, parentId, isSuperAdmin) => {
  try {
    let modelParams = { _id: id?.toString(), parentId: parentId };
    if (id?.toString() === parentId?.toString() || isSuperAdmin) {
      modelParams = { _id: id?.toString() };
    }
    const data = await model.findOne(modelParams);

    return data ? data : false;
  } catch (err) {
    return false;
  }
};

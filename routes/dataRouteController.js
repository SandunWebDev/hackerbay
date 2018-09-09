const tempStorage = { data: "" }; // Temporary database like variable to save data we recive in "/data" POST route.
module.exports.tempStorage = tempStorage;

module.exports.dataRouteGET = (req, res) => {
  if (!tempStorage.data) {
    return res.status(400).end();
  }

  return res.status(200).json({ data: tempStorage.data });
};

module.exports.dataRoutePOST = (req, res) => {
  if (req.body.data && typeof req.body.data === "string") {
    tempStorage.data = req.body.data;
    return res.status(200).json({ data: tempStorage.data });
  }
  return res.status(400).end();
};

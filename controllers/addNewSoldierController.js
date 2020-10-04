const Army = require("../models/army");
const defaultURI =
  "https://1000logos.net/wp-content/uploads/2017/06/U_s_army_logo_PNG3.png";

module.exports = {
  async addSoldier(req, res) {
    if (req.file !== undefined) {
      req.body.avatar = "http://localhost:5000/" + req.file.path;
    }
    const {
      name,
      superiorID,
      rank,
      sex,
      startDate,
      phone,
      email,
      superior
    } = req.body;
   let newData = {};

    if (superiorID === "") {
      newData = new Army({
        avatar: req.body.avatar ? req.body.avatar : defaultURI,
        name,
        rank,
        sex,
        startDate,
        phone,
        email,
        superior
      });
    } else {
       newData = new Army({
        avatar: req.body.avatar ? req.body.avatar : defaultURI,
        name,
        rank,
        sex,
        startDate,
        phone,
        email,
        superior,
        superiorID
      });
    }

    try {
      const newSoldier = await newData.save();
      const newSoldierId = newSoldier._id;

      if (newSoldierId) {
        const updateSuperior = await Army.updateOne(
          { _id: superiorID },
          { $push: { subordinate: newSoldierId } }
        );
        return res.json(updateSuperior);
      }
      return res.json(newSoldier);
    } catch (err) {
      throw Error(`Error while Registering new soldier :  ${err}`);
    }
  }
};

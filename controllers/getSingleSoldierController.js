const Army = require("../models/army");

module.exports = {
  async getSolderById(req, res) {
    const { id } = req.params;
    try {
      const soldier = await Army.findById(id).populate("superiorID");
      return res.json(soldier);
    } catch (error) {
      return res.status(400).json({
        message: "Soldier ID does not exist, do you want to register instead?"
      });
    }
  }
};

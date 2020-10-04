const Army = require("../models/army");

module.exports = {
  async getList(req, res) {
    const key = req.query.key;
    const sort = req.query.sort;
    const superiorID = req.query.superiorID;
    const regex = new RegExp("^" + key, "gi");
    const subordinate = req.query.subordinate;
    const limit = parseInt(req.query.limit);
    var serach;
    var sortorder = {};
    var subordinateArray;

    if (!key && !superiorID) {
      serach = {};
    } else if (key) {
      serach = {
        $or: [
          { name: regex },
          { rank: regex },
          { phone: regex },
          { sex: regex },
          { startDate: regex },
          { superior: regex }
        ]
      };
    } else {
      serach = { _id: superiorID };
    }

    if (!subordinate) {
      subordinateArray = {};
    } else {
      //const subordinateArr = subordinate.split(",");
      subordinateArray = {
        superiorID: subordinate
      };
    }

    if (sort) {
      let item = sort.split("_");
      let sortName = item[0];
      let order = () => {
        if (item[1] === "ascending") {
          return 1;
        } else {
          return -1;
        }
      };
      sortorder = { [sortName]: order() };
    }
        console.log(key)
    try {
      const army = await Army.find({ $and: [serach, subordinateArray] })
        .populate("superiorID")
        .sort(sortorder)
        .limit(limit);
      return res.json(army);
    } catch (error) {
      return res.status(400).json({ message: "can not find the army list" });
    }
  }
};

const Army = require("../models/army");

module.exports = {
  async removeSoldier(req, res) {
    const soldierID = req.params.id;

    try {
      const soldier = await Army.findById(soldierID);

      const subordinate = soldier.subordinate;
      if (soldier.superiorID) {
        var superiorID = soldier.superiorID._id;
      }
      Army.findByIdAndRemove({ _id: soldierID }).then(() => {
        if (superiorID && subordinate.length > 0) {
          console.log(`case 1 enter`);
          const queries = [
            Army.updateMany(
              { superiorID: soldierID },
              { $set: { superiorID: superiorID } }
            ),
            Army.updateOne(
              { _id: superiorID },
              { $pull: { subordinate: soldierID } }
            ),
            Army.updateOne(
              { _id: superiorID },
              { $push: { subordinate: { $each: subordinate } } }
            )
          ];
          Promise.all(queries)
            .then(results => {
              return res.status(200).json("did all queries in remove");
            })
            .catch(err => {
              res
                .status(500)
                .json("failed to process all queries for remove", err);
            });
        } else if (subordinate.length > 0) {
          console.log(`case 2 only subordinate enter`);
          Army.updateMany(
            { superiorID: soldierID },
            { $unset: { superiorID: 1, superior: 1 } }
          )
            .then(result => {
              return res.status(200).json("update case 2");
            })
            .catch(err => {
              res.status(500).json("failed to update case 2");
            });
        } else if (superiorID) {
          Army.updateOne(
            { _id: superiorID },
            { $pull: { subordinate: soldierID } }
          )
            .then(result => {
              return res.status.json("update only superior existed");
            })
            .catch(err => {
              res.status(500).json("failed to update when only superior");
            });
        } else {
          res.status(200).json("soldier has been removed");
        }
    
      });
    } catch (err) {
      throw Error(`Error while Registering new soldier : ${err}`);
    }
  }
};

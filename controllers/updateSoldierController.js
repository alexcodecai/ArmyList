const Army = require("../models/army");

function isCycle(id, supID) {
  if (id === supID) {
    console.log("base case");
    return true;
  }
  const result = Army.findById(id).then(soldier => {
    console.log("infor", soldier);
    console.log("array1", soldier.subordinate);
    if (soldier.subordinate) {
      console.log("array", soldier.subordinate);
      for (let i = 0; i < soldier.subordinate.length; i++) {
        console.log("index", i);
        if (supID === soldier.subordinate[i]) {
          
          console.log("if=====", supID,'--------', soldier.subordinate[i]);
          return true;
        } else {
          console.log("else=====");
          isCycle(soldier.subordinate[i], supID);
        }
      }
    } else {
      return false;
    }
  });
  //
}

module.exports = {
  async updateById(req, res) {
    // console.log("reqbody", req.body);
    let id = req.params.id;
    // let exSuperiorID = req.body.exSuperiorID;
    let soldierID = req.body.soldierID;
    let superior = req.body.superior;
    let superiorID = req.body.superiorID;
    let exname = req.body.exname;

    if (req.file !== undefined) {
      req.body.avatar = "http://localhost:5000/" + req.file.path;
    }

    console.log("-----------------", isCycle(id, superiorID));
    if (!isCycle(id, superiorID)) {
      try {
        const soldierInfo = await Army.findById(id);
        const exSuperiorID = soldierInfo.superiorID;
        if (exSuperiorID !== superiorID && superiorID !== undefined) {
          const updateExSuperior = await Army.updateOne(
            { _id: exSuperiorID },
            { $pull: { subordinate: id } }
          );
          const updateNewSuperior = await Army.updateOne(
            { _id: superiorID },
            { $addToSet: { subordinate: soldierID } }
          );
          // console.log("1", updateExSuperior, "2", updateNewSuperior);
        }
        // console.log("................", id);
        const updateSoldier = await Army.findByIdAndUpdate(id, req.body);
        return res.json(updateSoldier);
      } catch (err) {
        throw Error(`Error while Registering new soldier : ${err}`);
      }
    } else {
      res.status(500).json({ message: "cant update " });
    }
  }
};

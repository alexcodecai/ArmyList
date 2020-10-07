const Army = require("../models/army");

// const find = id => {

//   Army.findById(id).then(soldier=>{
//     if (soldier.superior === undefined) {
//       console.log('soldier.superior', soldier.superior, 'id', id)
//       Army.findByIdAndUpdate(id, {superior : id})
//       console.log('soldier.superior', soldier.superior)
//       return id;
//     } else if (soldier.superior !== id) {

//       return find(soldier.superior)
//     }
//     return id;
//   }

//   );
// }

const isVaild = (id, supID) => {
  // console.log('base case')
  // if(id === supID) {
  //   return false;
  // }

  // Army.findById(id).then(soldier => {
  //   console.log("xxxxx");
  //   if (soldier.superiorID === undefined) {
  //     console.log("case1");
  //     return true;
  //   } else if (soldier.superiorID._id === supID) {
  //     console.log("case2");
  //     return false;
  //   } else {
  //     console.log("case3");
  //     isVaild(id, soldier.superiorID._id);
  //   }
  // });
};

// function find(x) {
//   if (map.x === undefined) {
//     map[x] = x;
//     return x;
//   } else {
//     if (map.x !== x) {
//       return find(map[x]);
//     } else {
//       return x;
//     }
//   }
// }

// function union(x, y) {
//   map[y] = x;
// }

// function isCycle(id, supID) {
//   if (id === supID) {
//     console.log("base case");
//     return true;
//   }
//    Army.findById(id).then(soldier => {
//     console.log("infor", soldier);
//     console.log("array1", soldier.subordinate);
//     if (soldier.subordinate) {
//       console.log("array", soldier.subordinate);
//       for (let i = 0; i < soldier.subordinate.length; i++) {
//         console.log("index", i);
//         if (supID === soldier.subordinate[i]) {

//           console.log("if=====", supID,'--------', soldier.subordinate[i]);
//           return true;
//         } else {
//           console.log("else=====");
//           isCycle(soldier.subordinate[i], supID);
//         }
//       }
//     } else {
//       return false;
//     }
//   });
//   //
// }

module.exports = {
  async updateById(req, res) {
    // console.log("reqbody", req.body);
    let id = req.params.id;
    // let exSuperiorID = req.body.exSuperiorID;
    let soldierID = req.body.soldierID;
    //let superior = req.body.superior;
    let superiorID = req.body.superiorID;
    let exname = req.body.exname;
    console.log("superiorID", superiorID);

    if (req.file !== undefined) {
      req.body.avatar = "http://localhost:5000/" + req.file.path;
    }

     if (id === superiorID) {
      return res.status(403).json({message: 'cant update with same name'})
    }
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
      } 
      console.log("................", id);
      console.log(".......", superiorID);
      const updateSoldier = await Army.findByIdAndUpdate(id, req.body);
      return res.json(updateSoldier);
    } catch (err) {
      throw Error(`Error while Registering new soldier : ${err}`);
    }
  }
};



      // if (superiorID === undefined || superiorID === '000000000000000000000000') {
      //   console.log('case1')
      //   req.body.superiorID = '000000000000000000000000'
      //   const updateExSuperiorWhenSuperiorIsEmpty = await Army.updateOne(
      //     { _id: exSuperiorID },
      //     { $pull: { subordinate: id } }

      //   );
      //  } else if (exSuperiorID === undefined && exSuperiorID === '000000000000000000000000') {
      //    console.log('case2')
      //   const updateNewSuperiorWhenThereIsNoExSuperior = await Army.updateOne(
      //     { _id: superiorID },
      //     { $addToSet: { subordinate: soldierID } }
      //   );
      //  } else  {
      //    console.log('case3')
      //   const updateExSuperior = await Army.updateOne(
      //     { _id: exSuperiorID },
      //     { $pull: { subordinate: id } }
      //   );
      //   const updateNewSuperior = await Army.updateOne(
      //     { _id: superiorID },
      //     { $addToSet: { subordinate: soldierID } }
      //   );
      //  }
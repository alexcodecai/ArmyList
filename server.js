const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("./config/keys").mongoURI;
const routes =require('./routes');
const multer = require("multer");
const app = express();
const port = 5000;
app.use(routes);


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

app.use("/uploads", express.static("uploads"));
// bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Army = require("./models/army");

//connect mongodb
mongoose.Promise = global.Promise;
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("mongoDB connected..."))
  .catch(err => console.log("something wrong when connect mongoDB", err));

app.put("/api/army/update/:id", upload.single("avatar"), (req, res) => {
  let id = req.params.id
  let exSuperiorID = req.body.exSuperiorID;
  let soldierID = req.body.soldierID;
  let subordinate = req.body.name;
  let superiorID = req.body.superiorID;
  let exname = req.body.exname;
  if (req.file !== undefined) {
    req.body.avatar = "http://localhost:5000/" + req.file.path;
  }
  console.log(req.body);
  let queries = [
    Army.findByIdAndUpdate(id, req.body),
    Army.updateOne(
      { _id: exSuperiorID },
      { $pull: { subordinate: soldierID } }
    ),
    Army.updateOne(
      { _id: superiorID },
      { $addToSet: { subordinate: soldierID } }
    )
  ];
  Promise.all(queries)
    .then(result => {
      return res.status(200).json('updated')
    })
    // .then(results => {
    //   if (!results[0]) {
    //     return res.status(500).json(`something wrong when update soldier`);
    //   } else if (!results[1]) {
    //     return res.status(500).json(`something wrong when remove exsuperior`);
    //   } else if (!results[2]) {
    //     return res.status(500).json(`something wring when update new superior`);
    //   } else {
    //     return res
    //       .status(200)
    //       .json(
    //         `updated ${subordinate}, removed ${exSuperior} and added ${superior}`
    //       );
    //   }
    // })
    .catch(err =>
      res.status(500).json(err)
    );
});

// app.put("/api/army/deleteone/:id", (req, res) => {
//   console.log("req.body", req.body);
//   console.log("iddddddd", req.body.superior);
//   console.log("subbbbbbb", req.body.subordinate);
//   const soldierID = req.params.id;
//   const superior = req.body.superior;
//   const subordinate = req.body.subordinate;
//   Army.findByIdAndRemove({ _id: soldierID })
//     .then(() => {
//       if (superior && subordinate.length > 0) {
//         console.log(`case 1 enter`);
//         let queries = [
//           Army.updateMany(
//             { superiorID: soldierID },
//             { $set: { superiorID: superior._id } }
//           ),
//           Army.updateOne(
//             { _id: superior._id },
//             { $pull: { subordinate: soldierID } }
//           ),
//           Army.updateOne(
//             { _id: superior._id },
//             { $push: { subordinate: { $each: subordinate } } }
//           )
//         ];
//         Promise.all(queries)
//           .then(results => {
//             return res.status(200).json("did all queries in remove");
//           })
//           .catch(err => {
//             res
//               .status(500)
//               .json("failed to process all queries for remove", err);
//           });
//       } else if (subordinate.length > 0) {
//         console.log(`case 2 only subordinate enter`);
//         Army.updateMany({ superiorID: soldierID }, { $unset: { superiorID: 1, superior: 1 } })
//           .then(result => {
//             return res.status(200).json("update case 2");
//           })
//           .catch(err => {
//             res.status(500).json("failed to update case 2");
//           });
//       } else if (superior) {
//         Army.updateOne({_id: superior._id}, {$pull : {subordinate : soldierID}})
//         .then(result => {
//           return res.status.json("update only superior existed")
//         })
//         .catch(err => {
//           res.status(500).json('failed to update when only superior')
//         })
//       }
//        else {
//          res.status(200).json('soldier has been removed')
//        }
//     })
//     .catch(err => {
//       res.status(500).json(err);
//     });
// });

// app.put("/api/army/deleteone/:id", (req, res) => {
//   const id = req.params.id;
//   const superior = req.body.superior;
//   const name = req.body.name;
//   const subordinate = req.body.subordinate;
//   let queries = [
//     Army.updateMany(
//       { name: { $in: subordinate } },
//       { $set: { superior: " " } }
//     ),
//     Army.updateOne({ name: superior }, { $pull: { subordinate: name } }),

//     Army.findByIdAndRemove({ _id: id })
//   ];

//   Promise.all(queries)
//     .then(results => {
//       if (!results[0]) {
//         return res.status(500).send(`something wrong when remove`);
//       } else if (!results[1]) {
//         return res.status(500).json(`something wrong when update`);
//       } else if (!results[2]) {
//         return res.status(500).json("did not perform delete superior");
//       } else {
//         return res.status(200).json(`deleted`);
//       }
//     })
//     .catch(err =>
//       res.status(500).json(` something wrong getting querires`, err)
//     );
// });

app.listen(port, () => console.log(`server started on port ${port}`));

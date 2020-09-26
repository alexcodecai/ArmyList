const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("./config/keys").mongoURI;
const multer = require("multer");

const app = express();
const port = 5000;

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
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(() => console.log("mongoDB connected..."))
  .catch(err => console.log("something wrong when connect mongoDB", err));

app.get("/api/army/:search", (req, res) => {
  //console.log("======", req.query);
  const key = req.query.key;
  const sort = req.query.sort;
  const regex = new RegExp("^" + key, "gi");
  if (key === "" && sort === "") {
    Army.find({})
      .then(user => {
        res.status(200).json(user);
      })
      .catch(err => res.status(500).json(err));
  } else if (sort === "") {
    serach(res, key);
  } else if (key === "") {
    sorting(res, sort);
  } else {
    let item = sort.split("_");
    let param = item[0];
    let order = () => {
      if (item[1] === "ascending") {
        return 1;
      } else {
        return -1;
      }
    };
    Army.find({
      $or: [
        { name: regex },
        { rank: regex },
        { phone: regex },
        { sex: regex },
        { startDate: regex },
        { superior: regex }
      ]
    })
      .sort({ [param]: order() })
      .then(users => res.status(200).json(users))
      .catch(err =>
        res.status(500).json(`something wrong when serach the users`, err)
      );
  }
});

app.get("/api/army/superior/:id", (req, res) => {
  let id = req.params.id;
  Army.find({ name: id })
    .then(Army => res.status(200).json(Army))
    .catch(err =>
      res.status(500).json(`something wring when get superior`, err)
    );
});

app.get("/api/army/subordinate/:id", (req, res) => {
  let id = req.params.id;
  Army.find({ name: id })
    .then(Army => res.status(200).json(Army))
    .catch(err =>
      res.status(500).json(`something wring when get superior`, err)
    );
});

app.post("/api/army", upload.single("avatar"), (req, res) => {
  console.log(req.file);
  console.log("---------", req.body);
  let superior = req.body.superior;
  let subordinate = req.body.name;
  let newData = new Army({
    avatar: req.file.path,
    name: req.body.name,
    rank: req.body.rank,
    sex: req.body.sex,
    startDate: req.body.startDate,
    phone: req.body.phone,
    email: req.body.email,
    superior: req.body.superior
  });
  newData.save().then(
    Army.updateOne({ name: superior }, { $push: { subordinate: subordinate } })
      .then(res.status(200).json(`New data ${newData} inserted and update`))
      .catch(err =>
        res.status(500).json(`something wrong when add and update a solider`)
      )
  );
});

// app.put("/api/army/update/:id", upload.single("avatar"), (req, res)=> {
//   const id = req.params.id;
//   const superior = req.body.superior
//    if (req.file !== undefined){
//      req.body.avatar = req.file.path
//    }
//    Army.findById({_id: id })
//    .then( army => {
//      const name = army.name;
//      const exSup = army.superior;
//      console.log(name, '+++', exSup)
//      Army.findOneAndUpdate({name: exSup}, { $pull : { subordinate : name}})
//      .then(Army.findByIdAndUpdate( {name: superior }, { $push : { subordinate: name}}))
//    })
//    Army.updateOne(req.body)
//    .then(army => res.status(200).json(`updated`))
//    .catch(err => res.status(500).json(err))
// })

// app.put("/api/army/update/:id", upload.single("avatar"), (req, res) => {
//   let exSuperior = req.body.exSuperior;
//   let subordinate = req.body.name;
//   let superior = req.body.superior;
//   if (req.file !== undefined) {
//     req.body.avatar = req.file.path;
//   }
//   console.log("resbody", req.body);
//   console.log("super", req.file);
//   console.log("exSuper", exSuperior);
//   Army.findByIdAndUpdate(req.params.id, req.body)
//     .then(army => {
//       console.log("name", exSuperior);
//       Army.updateOne(
//         { name: exSuperior },
//         { $pull: { subordinate: subordinate } }
//       );
//     })
//     .then(army => {
//       console.log("name2", superior);
//       Army.updateOne(
//         { name: superior },
//         { $push: { subordinate: subordinate } }
//       );
//     })
//     .then(Army => res.json(`updated`))
//     .catch(err => res.status(500).json(`something wrong when update`, err));
// });

app.put("/api/army/update/:id", upload.single("avatar"), (req, res) => {
  if (req.file !== undefined) {
    req.body.avatar = req.file.path;
  }
  Army.findByIdAndUpdate(req.params.id, req.body)
    .then(user => res.json(user))
    .catch(err => res.status(500).json(`something wrong when update`, err));
});

app.put("/api/army", (req, res) => {
  let exSuperior = req.body.exSuperior;
  let subordinate = req.body.name;
  let superior = req.body.superior;
  console.log("resbody", res.body);
  console.log("name", superior);
  console.log("subordinate", subordinate);
  console.log("exSuperior", exSuperior);
  Army.updateOne(
    { name: exSuperior },
    { $pull: { subordinate: subordinate } }
  ).then(
    Army.updateOne({ name: superior }, { $push: { subordinate: subordinate } })
      .then(res.status(200).json(`updated!!!`))
      .catch(err =>
        res.status(500).json(`something wrong when add and update a solider`)
      )
  );
});

const serach = (res, serachInput) => {
  const regex = new RegExp("^" + serachInput, "gi");
  Army.find({
    $or: [
      { name: regex },
      { rank: regex },
      { phone: regex },
      { sex: regex },
      { startDate: regex },
      { superior: regex }
    ]
  })
    // Army.aggregate([
    //   {
    //     $match: {
    //       $or: [
    //         { name: serachInput },
    //         { rank: serachInput },
    //         { phone: serachInput },
    //         { sex: serachInput },
    //         { startDate: serachInput },
    //         { superior: serachInput }
    //       ]
    //     }
    //   }
    // ])
    .then(users => res.status(200).json(users))
    .catch(err =>
      res.status(500).json(`something wring when serach the users`, err)
    );
};

const sorting = (res, sort) => {
  let item = sort.split("_");
  let param = item[0];
  let order = () => {
    if (item[1] === "ascending") {
      return 1;
    } else {
      return -1;
    }
  };
  Army.aggregate([
    {
      $sort: { [param]: order() }
    }
  ])
    .then(users => res.status(200).json(users))
    .catch(err =>
      res.status(500).json(`something wring when sorting the users`, err)
    );
};

app.listen(port, () => console.log(`server started on port ${port}`));

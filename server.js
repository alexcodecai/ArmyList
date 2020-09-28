const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("./config/keys").mongoURI;
const multer = require("multer");
const defaultURI =
  "https://1000logos.net/wp-content/uploads/2017/06/U_s_army_logo_PNG3.png";
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
  console.log("======", req.query.subordinate);
  const key = req.query.key;
  const sort = req.query.sort;
  const superior = req.query.superior;
  const regex = new RegExp("^" + key, "gi");
  const subordinate = req.query.subordinate;
  let serach = {};
  let sortorder = {};
  let subordinateArray = {};

  if (key) {
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
  } else if (superior) {
    serach = { name: superior };
  }

  if (subordinate) {
    const subordinateArr = subordinate.split(",");
    console.log("subordinateArr", subordinateArr);
    subordinateArray = {
      name: { $in: subordinateArr }
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
  Army.find({ $and: [serach, subordinateArray] })
    .sort(sortorder)
    .then(users => res.status(200).json(users))
    .catch(err =>
      res.status(500).json(`something went worng when get Armies`, err)
    );
});

app.get("/api/single/:id", (req, res) => {
  let id = req.params.id;
  Army.find({ _id: id })
    .then(army => res.status(200).json(army))
    .catch(err =>
      res.status(500).json(`something wring when serach single soldier`, err)
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
  if (req.file !== undefined) {
    req.body.avatar = req.file.path;
  }
  let newData = new Army({
    avatar: req.body.avatar ? req.body.avatar : defaultURI,
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

app.put("/api/army/update/:id", upload.single("avatar"), (req, res) => {
  console.log("fristPut", req.body);
  let exSuperior = req.body.exSuperior;
  let subordinate = req.body.name;
  let superior = req.body.superior;
  let exname = req.body.exname
  if (req.file !== undefined) {
    req.body.avatar = req.file.path;
  }
  let queries = [
    Army.findByIdAndUpdate(req.params.id, req.body),
    Army.updateOne(
      { name: exSuperior },
      { $pull: { subordinate: exname } }
    ),
    Army.updateOne({ name: superior }, { $addToSet : { subordinate: subordinate } })
  ];
  Promise.all(queries)
    .then(results => {
      if (!results[0]) {
        return res.status(500).json(`something wrong when update soldier`);
      } else if (!results[1]) {
        return res.status(500).json(`something wrong when remove exsuperior`);
      } else if (!results[2]) {
        return res.status(500).json(`something wring when update new superior`);
      } else {
        return res
          .status(200)
          .json(
            `updated ${subordinate}, removed ${exSuperior} and added ${superior}`
          );
      }
    })
    .catch(err =>
      res.status(500).json(`something wrong when update queries`, err)
    );
});

app.delete("/api/army/deleteone/:id", (req, res) => {
  const id = req.params.id;
  console.log("reqbody", req.body)
  const superior = req.body.superior;
  const name = req.body.name;
  let queries = [
    Army.findByIdAndRemove({ name: name}),
    Army.updateOne({ name: superior }, { $pull: { subordinate: name } })
  ];
  Promise.all(queries)
    .then(results => {
      if (!results[0]) {
        return res.status(500).send(`something wrong when remove`);
      } else if (!results[1]) {
        return res.status(500).json(`something wrong when update`);
      } else {
        return res.status(200).json(" removed and updated");
      }
    })
    .catch(err =>
      res.status(500).json(` something wrong getting querires`, err)
    );
});

app.listen(port, () => console.log(`server started on port ${port}`));

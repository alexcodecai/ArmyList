const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require("./config/keys").mongoURI;
const multer = require('multer');

const app = express();
const port = 5000;

const storage = multer.diskStorage({
  destination : function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
    cb(null, new Date().toISOString() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  }else {
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize : 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

app.use('/uploads', express.static('uploads'));
// bodyparser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const Army = require("./models/army");

//connect mongodb
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("mongoDB connected..."))
  .catch(err => console.log("something wrong when connect mongoDB", err));



app.get("/api/army/:search", (req, res) => {
  //console.log("======", req.query);
  const key = req.query.key;
  const sort = req.query.sort;
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
    Army.aggregate([
      {
        $match: {
          $or: [
            { name: key },
            { rank: key },
            { phone: key },
            { sex: key },
            { startDate: key },
            { superior: key }
          ]
        }
      },
      {
        $sort: { [param]: order() }
      }
    ])
      .then(users => res.status(200).json(users))
      .catch(err =>
        res.status(500).json(`something wrong when serach the users`, err)
      );
  }
});

app.get("/api/army/:id", (req, res) => {
  let id = req.params.id;
  Army.find({ _id: id })
  .then(Army=>res.status(200).json(Army))
  .catch(err =>res.status(500).json(`something wring when get superior`, err))
});


app.post("/api/army", upload.single('avatar'), (req, res) => {
  console.log(req.file)
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
  newData.save()
  .then(
    Army.updateOne({ name: superior }, { $push: { subordinate: subordinate } })
      .then(res.status(200).json(`New data ${newData} inserted and update`))
      .catch(err =>
        res.status(500).json(`something wrong when add and update a solider`)
      )
  );
});

const serach = (res, serachInput) => {
  Army.aggregate([
    {
      $match: {
        $or: [
          { name: serachInput },
          { rank: serachInput },
          { phone: serachInput },
          { sex: serachInput },
          { startDate: serachInput },
          { superior: serachInput }
        ]
      }
    }
  ])
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

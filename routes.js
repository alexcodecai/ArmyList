const express = require("express");
const multer = require("multer");
const routes = express.Router();

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

const getSingleSoldierController = require("./controllers/getSingleSoldierController");
const getArmyListController = require("./controllers/getArmyListController");
const addNewSoldierController = require("./controllers/addNewSoldierController");
const deleteSoldierController = require("./controllers/deleteSoldierController");
const updateSoldierController = require("./controllers/updateSoldierController")

//get single soldier
routes.get("/status", (req, res) => {
  res.send({ status: 200 });
});

// get
routes.get("/api/single/:id", getSingleSoldierController.getSolderById);
routes.get("/api/army/:search", getArmyListController.getList);

//post
routes.post(
  "/api/army",
  upload.single("avatar"),
  addNewSoldierController.addSoldier
);

//update
routes.put("/api/army/update/:id",upload.single("avatar"), updateSoldierController.updateById)

//delete
routes.put("/api/army/deleteone/:id", deleteSoldierController.removeSoldier);


module.exports = routes;

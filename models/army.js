const mongoose = require("mongoose");
const Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;
const ArmySchema = new Schema({
  avatar:{type: String, default:"https://1000logos.net/wp-content/uploads/2017/06/U_s_army_logo_PNG3.png"},
  name: String,
  rank: String,
  sex: String,
  startDate: String,
  phone: String,
  email: String,
  superiorID: {type: mongoose.Schema.Types.ObjectId, ref: "Army"},
  superior: {type :String},
  subordinate: Array,
});

module.exports = Army = mongoose.model("Army", ArmySchema);

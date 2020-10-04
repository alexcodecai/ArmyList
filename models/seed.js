const faker = require("faker");
const Army = require("./army");
const db = require("../config/keys").mongoURI;
const mongo = require("mongoose");
mongo
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected...."))
  .catch(err => console.log(err));

function random_item(items) {
  return items[Math.floor(Math.random() * items.length)];
}

let Rank = [
  "General",
  "Colonel",
  "Major",
  "Captain",
  "Lieutenant",
  "Warrant Officer",
  "Sergeant",
  "Corporal"
];
// let sex = array[Math.ceil(Math.random() * array.length)];
const seedArmyData = () => {
  for (let i = 0; i < 20; i++) {
    const avatar = faker.internet.avatar();
    const name = faker.internet.userName();
    const rank = random_item(Rank);
    const date = faker.date.between('1985-01-01', '2020-01-05').toISOString().split('T')[0];
    const phone = faker.phone.phoneNumberFormat();
    const email = faker.internet.email();
    Army.create(
      {
        avatar:avatar,
        name: name,
        rank: rank,
        sex: "F",
        startDate: date,
        phone:phone,
        email:email,
      },
      (err, success) => {
        if (err) {
          console.log(err);
        } else {
          console.log(success);
        }
      }
    );
  }
};


seedArmyData();
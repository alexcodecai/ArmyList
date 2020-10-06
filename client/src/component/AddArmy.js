import React, { useEffect, useState } from "react";
import "./AddArmy.css";
import { getArmies } from "../redux/action/army";
import { addArmy } from "../redux/action/addArmy";
import { connect } from "react-redux";

const Rank = [
  "General",
  "Colonel",
  "Major",
  "Captain",
  "Lieutenant",
  "Warrant Officer",
  "Sergeant",
  "Corporal"
];

function AddArmy({ history, armies, getArmies, addArmy }) {
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [sex, setSex] = useState("");
  const [startDate, setStartDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [superior, setSuperior] = useState("");
  const [superiorID, setSuperiorID] = useState("");
  const [image, setImage] = useState(
    "https://1000logos.net/wp-content/uploads/2017/06/U_s_army_logo_PNG3.png"
  );
  const [file, setFile] = useState("");

  const [nameValid, setNameValid] = useState(false);
  const [rankValid, setRankValid] = useState(false);
  const [startDateValid, setStartDateValid] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [sumbitValid, setSubmitValid] = useState(false);

  useEffect(() => {
    getArmies(condition);
  }, []);

  const handleName = e => {
    setName(e.target.value);
    let condition = /^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/.test(
      e.target.value
    );
    setNameValid(condition ? true : false);
    setSubmitValid(
      condition && rankValid && startDateValid && phoneValid && emailValid
        ? true
        : false
    );
  };

  const handleRank = e => {
    setRank(e.target.value);
    if (e.target.value !== "") {
      condition = true;
    } else {
      condition = false;
    }
    setRankValid(condition ? true : false);
    setSubmitValid(
      name && condition && startDateValid && phoneValid && emailValid
        ? true
        : false
    );
  };

  const handleSex = e => {
    setSex(e.target.value);
  };

  const handleDate = e => {
    setStartDate(e.target.value);
    let condition = /^\d{4}-\d{2}-\d{2}$/.test(e.target.value);
    setStartDateValid(condition ? true : false);
    setSubmitValid(
      nameValid && rankValid && condition && phoneValid && emailValid
        ? true
        : false
    );
  };

  const handlePhone = e => {
    setPhoneNumber(e.target.value);
    let condition = /^(?:\(\d{3}\)|\d{3}-)\d{3}-\d{4}$/.test(e.target.value);
    setPhoneValid(condition ? true : false);
    setSubmitValid(
      nameValid && rankValid && startDateValid && condition && emailValid
        ? true
        : false
    );
  };

  const handleEmail = e => {
    setEmail(e.target.value);
    let condition = /[\w\-_]+@[\w\-_]+\.\w{2,10}/.test(e.target.value);
    setEmailValid(condition ? true : false);
    setSubmitValid(
      nameValid && rankValid && startDateValid && phoneValid && condition
        ? true
        : false
    );
  };

  const handleSuperior = e => {
    console.log("e.target", e.target.value);
    let value = e.target.value.split("+");
    console.log("e.target.name", value);
    setSuperiorID(value[0]);
    setSuperior(value[1]);
    console.log("superiro", superior);
    console.log("after", superiorID);
  };

  const handleUploadPic = e => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    console.log(payload);
    addArmy(payload);
    setName("");
    setRank("");
    setSex("");
    setStartDate("");
    setEmail("");
    setPhoneNumber("");
    setSuperior("");
    setSuperiorID("");
    history.push("/");
  };

  const payload = new FormData();
  payload.append("name", name);
  payload.append("rank", rank);
  payload.append("sex", sex);
  payload.append("startDate", startDate);
  payload.append("phone", phoneNumber);
  payload.append("email", email);
  payload.append("superior", superior);
  payload.append("superiorID", superiorID);
  payload.append("avatar", file);

  let condition = {
    sort: "",
    key: "",
    superior: "",
    subordinate: []
  };
  // console.log("image", image);
  // console.log("name", condition);

  return (
    <div className="addArmy">
      <div className="topfield">
        <div className="topleft">
          <img
            src="https://images-na.ssl-images-amazon.com/images/I/71%2BMrzDspoL._AC_SL1001_.jpg"
            width="200"
            height="200"
            alt="avatar"
          />
          <div className="header">
            <h1>New Soldier</h1>
          </div>
        </div>
      </div>
      <div className="body">
        <div className="left">
          <img src={image} width="700" height="700" alt="headpic" />
          <label>image:</label>
          <input type="file" onChange={handleUploadPic}></input>
        </div>

        <div className="right">
          <form onSubmit={handleSubmit}>
            <div className="addContainer">
              <h1>Add New Soldier</h1>
              <p>Please fill in this form to join the Army</p>
              <div id="error_message"></div>
              <label>
                <b>name :</b>
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                id="firstname"
                onChange={handleName}
                required
              />
              {!nameValid && (
                <p style={{ color: "red" }}>Please enter valid name.</p>
              )}
              <label>
                <b>Rank :</b>
              </label>
              <select className="rank" id="rank" onChange={handleRank}>
                <option value="null"></option>
                {Rank.map(rank => (
                  <option rank={rank} key={rank}>
                    {rank}
                  </option>
                ))}
              </select>
              <br></br>
              {!rankValid && (
                <p style={{ color: "red" }}>Please select a Rank.</p>
              )}
              <label>
                <b>Sex </b>
              </label>
              <div>
                <input
                  type="radio"
                  value="M"
                  name="gender"
                  checked={sex === "M"}
                  onChange={handleSex}
                />{" "}
                Male
                <input
                  type="radio"
                  value="F"
                  name="gender"
                  checked={sex === "F"}
                  onChange={handleSex}
                />{" "}
                Female
              </div>
              <br></br>
              <label>
                <b>Start Date :</b>
              </label>
              <input
                type="date"
                placeholder="Enter Date "
                name="date"
                id="date"
                onChange={handleDate}
                defaultValue={startDate}
                required
              />
              {!startDateValid && (
                <p style={{ color: "red" }}>
                  Please enter date as YYYY-MM--DD format.
                </p>
              )}
              <br></br>
              {/* <label>
                <b>Sex: </b>
              </label>
              <select className="sex" id="sex" onChange={handleSex}>
                <option value="null"></option>
                <option value="F">F</option>
                <option value="M">M</option>
              </select>
              <br></br>
              <label>
                <b>Start Date :</b>
              </label>
              <input
                type="text"
                placeholder="Enter Date "
                name="date"
                id="date"
                onChange={handleDate}
                required
              />
              {!startDateValid && <p style={{color: "red"}}>Please enter date as YYYY-MM--DD format.</p>} */}
              <label>Offical Phone :</label>
              <input
                type="text"
                placeholder="Enter Phome Number "
                name="phone"
                id="phone"
                onChange={handlePhone}
                required
              />
              {!phoneValid && (
                <p style={{ color: "red" }}>
                  Please enter phoneNumber as xxxx-xxx-xxx format.
                </p>
              )}
              <label>Email :</label>
              <input
                type="text"
                placeholder="Enter Email "
                name="email"
                id="email"
                onChange={handleEmail}
                required
              />
              {!emailValid && (
                <p style={{ color: "red" }}>Please enter valid email.</p>
              )}
              <label>Superior :</label>
              <select className="rank" id="rank" onChange={handleSuperior}>
                <option value="null"></option>
                {armies.data.map(army => (
                  <option
                    army={army}
                    key={army._id}
                    value={army._id + "+" + army.name}
                  >
                    {army.name}
                  </option>
                ))}
              </select>
              <br></br>

              <button
                type="submit"
                className="registerbtn"
                disabled={!sumbitValid}
              >
                Register New Soldier
              </button>
              <button className="registerbtn" onClick={() => history.push("/")}>
                Cancel Registering
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = state => {
  return {
    armies: state.armies
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getArmies: condition => {
      dispatch(getArmies(condition));
    },
    addArmy: payload => {
      dispatch(addArmy(payload));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddArmy);

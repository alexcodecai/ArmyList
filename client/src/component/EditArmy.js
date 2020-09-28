import React, { useEffect, useState } from "react";
import "./EditArmy.css";
import { getArmies } from "../redux/action/army";
import { getSingleArmy } from "../redux/action/getSingleArmy";
import { connect } from "react-redux";
import { editArmy } from "../redux/action/editArmy";

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

function EditArmy({
  history,
  armies,
  getArmies,
  getSingleArmy,
  army,
  match,
  editArmy
}) {
  const [name, setName] = useState("");
  const [rank, setRank] = useState("");
  const [sex, setSex] = useState("");
  const [startDate, setStartDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [superior, setSuperior] = useState("");
  const [image, setImage] = useState("");
  const [file, setFile] = useState("");
  const [exSuperior, setExSuperior] = useState("");
  const [exname, setExname] = useState("");

  const [nameValid, setNameValid] = useState(false);
  const [rankValid, setRankValid] = useState(false);
  const [startDateValid, setStartDateValid] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [emailValid, setEmailValid] = useState(false);
  const [sumbitValid, setSubmitValid] = useState(false);

  useEffect(() => {
    getArmies(condition);
  }, []);

  useEffect(() => {
    getSingleArmy(match.params.id);
  }, []);

  useEffect(() => {
    if (army[0] !== undefined) {
      setExSuperior(army[0].superior)
      setExname(army[0].name)
      setName(army[0].name);
      setRank(army[0].rank);
      setSex(army[0].sex);
      setStartDate(army[0].startDate);
      setPhoneNumber(army[0].phone);
      setEmail(army[0].email);
      setSuperior(army[0].superior);
      setImage(army[0].avatar);
      //  if (army[0].avatar.chatAt(0) === 'u'){
      //    setImage(`http://localhost:5000` + army[0].avatar)
      //  } else {
      //    setImage(army[0].avatar)
      //  }
    }
  }, [army]);

  console.log(army[0]);
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
    setSuperior(e.target.value);
  };

  const handleUploadPic = e => {
    setImage(URL.createObjectURL(e.target.files[0]));
    setFile(e.target.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    editArmy(match.params.id, payload);
    setName("");
    setRank("");
    setSex("");
    setStartDate("");
    setPhoneNumber("");
    setEmail("");
    setSuperior("");
    setImage("");
    setExSuperior("")
  };

  const payload = new FormData();
  payload.append("name", name);
  payload.append("rank", rank);
  payload.append("sex", sex);
  payload.append("startDate", startDate);
  payload.append("phone", phoneNumber);
  payload.append("email", email);
  payload.append("superior", superior);
  payload.append("avatar", file);
  payload.append("exSuperior", exSuperior)
  payload.append('exname', exname)

  let condition = {
    sort: "",
    key: "",
    superior: "",
    subordinate: []
  };
  console.log("rank", image);
  if (army[0] === undefined) {
    return <p>{army.error}</p>;
  }

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
            <h1>Edit Soldier</h1>
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
              <h1>Edit Exist Soldier</h1>
              <p>Please Edit Soldier information</p>
              <div id="error_message"></div>
              <label>
                <b>name :</b>
              </label>
              <input
                type="text"
                placeholder="Enter Name"
                id="name"
                defaultValue={name}
                onChange={handleName}
                required
              />
              {!nameValid && (
                <p style={{ color: "red" }}>Please enter valid name.</p>
              )}
              <label>
                <b>Rank :</b>
              </label>
              <select
                className="rank"
                id="rank"
                onChange={handleRank}
                value={rank}
              >
                {/* <option selected = {rank} defaultValue ={rank}></option> */}
                {Rank.map(ranks => (
                  <option ranks={ranks} key={ranks}>
                    {ranks}
                  </option>
                ))}
              </select>
              <br></br>
              {!rankValid && (
                <p style={{ color: "red" }}>Please select a Rank.</p>
              )}
              <label>
                <b>Sex: </b>
              </label>
              <select className="sex" id="sex" onChange={handleSex} value={sex}>
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
                defaultValue={startDate}
                required
              />
              {!startDateValid && (
                <p style={{ color: "red" }}>
                  Please enter date as YYYY-MM--DD format.
                </p>
              )}
              <label>Offical Phone :</label>
              <input
                type="text"
                placeholder="Enter Phome Number "
                name="phone"
                id="phone"
                onChange={handlePhone}
                defaultValue={phoneNumber}
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
                defaultValue={email}
                required
              />
              {!emailValid && (
                <p style={{ color: "red" }}>Please enter valid email.</p>
              )}
              <label>Superior :</label>
              <select
                className="superior"
                id="superior"
                onChange={handleSuperior}
              >
                <option value={superior}></option>
                {armies.data.map(army => (
                  <option army={army} key={army._id}>
                    {army.name}
                  </option>
                ))}
              </select>
              <br></br>

              <button
                type="submit"
                className="registerbtn"
                //disabled={!sumbitValid}
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
    armies: state.armies,
    army: state.getSingleArmy.data
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getArmies: condition => {
      dispatch(getArmies(condition));
    },
    getSingleArmy: id => {
      dispatch(getSingleArmy(id));
    },
    editArmy: (id, payload) => {
      dispatch(editArmy(id, payload));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditArmy);

import React, { useEffect, useState } from "react";
import "./EditArmy.css";
import { getArmies } from "../redux/action/army";
import { getSingleArmy } from "../redux/action/getSingleArmy";
import { connect } from "react-redux";
import { editArmy } from "../redux/action/editArmy";
import axios from "axios";

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
  editArmy,
  editResult
}) {
  const [name, setName] = useState(null);
  const [rank, setRank] = useState(null);
  const [sex, setSex] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [superior, setSuperior] = useState(null);
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(null);
  const [file, setFile] = useState(null);
  const [exSuperiorID, setExSuperiorID] = useState(null);
  const [superiorID, setSuperiorID] = useState("000000000000000000000000");
  const [soldierID, setsoldierID] = useState(null);
  const [exname, setExname] = useState(null);
  const [superiorName, setSuperiorName] = useState('');

  const [nameValid, setNameValid] = useState(true);
  const [rankValid, setRankValid] = useState(true);
  const [startDateValid, setStartDateValid] = useState(true);
  const [phoneValid, setPhoneValid] = useState(true);
  const [emailValid, setEmailValid] = useState(true);
  const [sumbitValid, setSubmitValid] = useState(true);

  useEffect(() => {
    console.log("is", match.params.id);
    const fecthData = async () => {
      const request = await axios(`/api/single/${match.params.id}`);
      const army = request.data;
      console.log("requset!!!!!!!!!!!", army);

      if (army.superiorID === null || army.superiorID === undefined) {
        setExSuperiorID("");
      } else {
        setExSuperiorID(army.superiorID._id);
        // setExname(army.superiorID.name);
        setSuperiorID(army.superiorID._id);
        setSuperiorName(army.superiorID.name)
      }
      setsoldierID(army._id);
      setName(army.name);
      setRank(army.rank);
      setSex(army.sex);
      setStartDate(army.startDate);
      setPhoneNumber(army.phone);
      setEmail(army.email);
      setSuperior(army.superior);
      setShow(army.avatar);
    };
    fecthData();
  }, [match.params.id]);

  useEffect(() => {
    async function getall() {
      await getArmies(condition);
      console.log("ffffff", condition);
    }
    
    getall();
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
    setSuperiorName(e.target.value);
    setSuperiorID(e.target.children[e.target.selectedIndex].id);
    // let value = e.target.value.split("+");
    // setSuperiorID(value[0]);
    // setSuperior(value[0]);
  
  };

  const handleUploadPic = e => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
    // console.log("e.tager.file", e.target.files[0]);

    setFile(e.target.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    editArmy(match.params.id, payload, history, () => {
      setName("");
      setRank("");
      setSex("");
      setStartDate("");
      setPhoneNumber("");
      setEmail("");
      setSuperior("");
      setSuperiorID("");
      setExSuperiorID("");
    });

    // history.push("/");
  };

  // const handleCancel = e => {
  //   e.preventDefault();
  //   history.push("/");
  // };

  const payload = new FormData();
  payload.append("name", name);
  payload.append("rank", rank);
  payload.append("sex", sex);
  payload.append("startDate", startDate);
  payload.append("phone", phoneNumber);
  payload.append("email", email);
  payload.append("superior", superior);
  if (file === null) {
    payload.append("avatar", show);
  } else {
    payload.append("avatar", file);
  }
  payload.append("exname", exname);
  payload.append("exSuperiorID", exSuperiorID);
  payload.append("soldierID", soldierID);
  payload.append("superiorID", superiorID);

  let condition = {
    sort: "",
    key: "",
    superiorID: "",
    subordinate: [],
    limit: ""
  };
  //console.log("rank", army[0]);
  if (name === undefined) {
    return <p>loading</p>;
  } else
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
            <img
              src={image ? image : show}
              width="700"
              height="700"
              alt="headpic"
            />
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
                <label>Superior : </label>
                <select
                  className="superior"
                  id="superior"
                  onChange={handleSuperior}
                  value = {superiorName}
                >
                  <option value=""></option>
                  {armies.data.map(army => (
                    <option key={army._id} id={army._id} value={army.name}>{army.name}</option>
                    // <option
                    //   army={army}
                    //   key={army._id}
                    //   value={army._id + "+" + army.name}
                    // >
                    //   {army.name}
                    // </option>
                  ))}
                </select>
                <br></br>
                {/* {editResult.error && 'cant update'}  */}
                <button
                  type="submit"
                  className="registerbtn"
                  //disabled={!sumbitValid}
                >
                  Save Change
                </button>
                <button className="cancel" onClick={() => history.push("/")}>
                  Cancel
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
    army: state.getSingleArmy.data[0],
    editResult: state.editArmy
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
    editArmy: (id, payload, history) => {
      dispatch(editArmy(id, payload, history));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditArmy);

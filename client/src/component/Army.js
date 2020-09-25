import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getArmies } from "../redux/action/army";
import {getSuperior} from "../redux/action/getSuperior"
import ArmyEntry from "./ArmyEntry";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { Link } from "react-router-dom";
import "./army.css";

const debounceCreator = () => {
  let ref;
  return (func, timeout, val) => {
    clearTimeout(ref);
    ref = setTimeout(() => func(val), timeout);
  };
};
const getSearchHelper = debounceCreator();


function Army({ getArmies, armies, getSuperior}) {
  const [sort, setSort] = useState("");
  const [key, setKey] = useState("");
  //const [id, setId] = useState("");

  const currentUsers = armies.data.slice(0, 10);
  //const currentArmies = armies.data.concat(Array.from({length : 10}))

  let condition = {
    sort: sort,
    key: key.trim(),
  };

  useEffect(() => {
    getArmies(condition);
  }, []);

  useEffect(() => {
    getSearchHelper(getArmies, 800, condition);
  }, [sort, key]);

  const handleSearch = e => {
    setKey(e.target.value);
  };

  const handlesort = (e, sort) => {
    console.log("sorarmiest", armies);
    e.preventDefault();
    setSort(sort);
    getArmies(condition);
  };

  const handleReset = e => {
    setKey('');
    setSort('');
    getArmies(condition);
  }

  const showSuperior = (e, id) => {
    e.preventDefault();
   getSuperior(id)
  }

  if (armies.error !== "") {
    return <p>{armies.error}</p>;
  }
  return (
    <div>
      <h1>Search Users</h1>
      <div className="top-content">
        <div className ='search-input'>
          <form onSubmit={e => e.preventDefault()}>
            <input
              type="text"
              placeholder="Search Anything "
              value={key}
              onChange={handleSearch}
              required
            ></input>
          </form>
          {armies.data.length === 0 && (
            <p style={{ color: "red" }}>No such a user exist in our database</p>
          )}
        </div>
        <div className = "top-right">
          <button onClick ={handleReset}>Reset</button>
          <button> <Link to="/AddArmy">Add New Soilder </Link></button>
        </div>
      </div>
      <table className="content-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th style={{ cursor: "pointer", color: "lightblue" }}>
              Name
              <ArrowDropUpIcon
                onClick={e => {
                  handlesort(e, "name");
                }}
              />
              <ArrowDropDownIcon
                onClick={e => {
                  handlesort(e, "name_ascending");
                }}
              />
            </th>
            <th style={{ cursor: "pointer", color: "lightblue" }}>
              Sex
              <ArrowDropUpIcon
                onClick={e => {
                  handlesort(e, "sex");
                }}
              />
              <ArrowDropDownIcon
                onClick={e => {
                  handlesort(e, "sex_ascending");
                }}
              />
            </th>
            <th style={{ cursor: "pointer", color: "lightblue" }}>
              Rank
              <ArrowDropUpIcon
                onClick={e => {
                  handlesort(e, "rank");
                }}
              />
              <ArrowDropDownIcon
                onClick={e => {
                  handlesort(e, "rank_ascending");
                }}
              />
            </th>
            <th style={{ cursor: "pointer", color: "lightblue" }}>
              Start Date
              <ArrowDropUpIcon
                onClick={e => {
                  handlesort(e, "startDate");
                }}
              />
              <ArrowDropDownIcon
                onClick={e => {
                  handlesort(e, "startDate_ascending");
                }}
              />
            </th>
            <th>Phone</th>
            <th>Email</th>
            <th>Superior</th>
            <th># of D.S</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {armies.data.map(army => (
            <ArmyEntry army={army} key={army._id} showSuperior ={showSuperior} />
          ))}
        </tbody>
      </table>
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
    getSuperior: (id) => {
      dispatch(getSuperior(id))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Army);

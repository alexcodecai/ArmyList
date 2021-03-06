import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getArmies } from "../redux/action/army";
import { deleteArmy } from "../redux/action/deleteArmy";
import ArmyEntry from "./ArmyEntry";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import "./army.css";

let logo ="https://cdn11.bigcommerce.com/s-vuyqpjgt91/images/stencil/1280x1280/products/287/667/ArmySealDecal__27803.1553886818.jpg?c=2"
const debounceCreator = () => {
  let ref;
  return (func, timeout, val) => {
    clearTimeout(ref);
    ref = setTimeout(() => func(val), timeout);
  };
};
const getSearchHelper = debounceCreator();

function Army({ getArmies, armies, deleteArmy }) {
  const [sort, setSort] = useState("");
  const [key, setKey] = useState("");
  const [superiorID, setSuperiorID] = useState("");
  const [subordinate, setSubordinate] = useState([]);

  const [id, setId] = useState("")

  const [limit, setLimit] = useState(15);
  const [current, setCurrent] = useState(15);
  const [hasMore, setHasMore] = useState(true);


  let condition = {
    sort: sort,
    key: key.trim(),
    superiorID: superiorID,
    subordinate: subordinate,
    limit: limit
  };

  useEffect(() => {
    getArmies(condition);
  }, []);

  useEffect(() => {
    getSearchHelper(getArmies, 800, condition);
  }, [sort, key, superiorID, subordinate, limit, id]);

  const fetchData = () => {
    setLimit(limit + 15);
    getArmies(condition);
    setCurrent(current + limit);
    setHasMore(current < 300);
  };

  const handleSearch = e => {
    setKey(e.target.value);
  };

  const handlesort = (e, sort) => {
    e.preventDefault();
    setSort(sort);
    getArmies(condition);
  };

  const handleReset = e => {
    setKey("");
    setSort("");
    setSuperiorID("");
    setLimit(15);
    setCurrent(15);
    setSubordinate([]);
    getArmies(condition);
  };

  const showSuperior = (e, id) => {
    e.preventDefault();
    //console.log('id' , id)
    setSuperiorID(id);
    setSubordinate("");
    getArmies(condition);
  };

  const showSubordinate = (e, subordinate) => {
    e.preventDefault();
    console.log('id', subordinate)
    setSubordinate(subordinate);
    setSuperiorID("");
    getArmies(condition);
  };

  const removeArmy = (id) => {
    setId(id);
    deleteArmy(id);
   // getArmies(condition);
  };

  //console.log('``````````````````````', armies)

  // if (armies.error !== "") {
  //   return (<p>loading</p>);
  // }
  return (
    <div className="main">
      <h1>Army Registry</h1>
      <img
        src={logo}
        width="210"
        height="150"
        alt="avatar"
      />

      <div className="top-content">
        <div className="search-input">
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

        <div className="top-right">
          <button onClick={handleReset}>Reset</button>
          <button>
            {" "}
            <Link to="/AddArmy">Add New Soilder </Link>
          </button>
        </div>
      </div>
      <InfiniteScroll
        dataLength={current}
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
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
              <ArmyEntry
                army={army}
                key={army._id}
                showSuperior={showSuperior}
                showSubordinate={showSubordinate}
                removeArmy={removeArmy}
                //superior = {army.superiorID.name}
              />
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
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
    deleteArmy: (id) => {
      dispatch(deleteArmy(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Army);

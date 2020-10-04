import axios from "axios";

function requestStart() {
  return {
    type: "REQUEST_Armies_START"
  };
}

function requestSuccess(armies) {
  return {
    type: "REQUEST_Armies_SUCCESS",
    armies
  };
}

function requestFail(error) {
  return {
    type: "REQUEST_Armies_FAIL",
    error
  };
}

export function getArmies(condition) {
  let sort = condition.sort;
  let key = condition.key;
  let superiorID = condition.superiorID;
  let subordinate = condition.subordinate;
  let limit = condition.limit;
  return dispatch => {
    dispatch(requestStart());
    axios
      .get(
        `/api/army/search?key=${key}&sort=${sort}&superiorID=${superiorID}&subordinate=${subordinate}&limit=${limit}`
      )
      .then(response => {
        dispatch(requestSuccess(response.data));
      })
      .catch(err => {
        dispatch(requestFail(err));
      });
  };
}

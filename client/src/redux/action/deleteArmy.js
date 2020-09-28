import axios from "axios";

function requestStart() {
  return {
    type: "REQUEST_USERS_START"
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
    type: "REQUEST_USERS_FAIL",
    error
  };
}

export function deleteArmy(condition, id, name, boss) {
  let sort = condition.sort;
  let key = condition.key
  let superior = condition.superior
  let subordinate = condition.subordinate
  console.log('redux', id, name, boss)
  return dispatch => {
    dispatch(requestStart());
    axios
      .delete(`/api/army/deleteone/${id}`, name, boss)
      .then(
        axios.get(`/api/army/search?key=${key}&sort=${sort}&superior=${superior}&subordinate=${subordinate}`)
        .then((response) => {
          dispatch(requestSuccess(response.data))
        })
      )
      .catch(error => {
        dispatch(requestFail(error));
      });
  };
}

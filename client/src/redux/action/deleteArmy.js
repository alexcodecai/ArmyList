import axios from "axios";

function requestStart() {
  return {
    type: "REQUEST_USERS_START"
  };
}
// function requestSuccess(armies) {
//   return {
//     type: "REQUEST_Armies_SUCCESS",
//     armies
//   };
// }

function requestFail(error) {
  return {
    type: "REQUEST_USERS_FAIL",
    error
  };
}

export function deleteArmy(id, superior, subordinate, name) {
  // let sort = condition.sort;
  // let key = condition.key;
  // let superior = condition.superior;
  // let subordinate = condition.subordinate;
  // let removeSubordinate = name
  console.log('redux', id,"superior", superior,"subordnate",  subordinate,"name", name)
  let payload = {
    superior: superior,
    subordinate: subordinate,
    name: name
  }
  return dispatch => {
    dispatch(requestStart());
    console.log('payload', payload)
    axios
      .put(`/api/army/deleteone/${id}`, payload)
      // .then(
      //   axios.get(`/api/army/search?key=${key}&sort=${sort}&superior=${superior}&subordinate=${subordinate}`)
      //   .then((response) => {
      //     dispatch(requestSuccess(response.data))
      //   })
      // )
      .catch(error => {
        dispatch(requestFail(error));
      });
  };
}

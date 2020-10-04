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

export function deleteArmy(id) {
 
  return dispatch => {
    dispatch(requestStart());
    axios
      .put(`/api/army/deleteone/${id}`)
      .catch(error => {
        dispatch(requestFail(error));
      });
  };
}

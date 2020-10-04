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

export function editArmy(id, payload, history) {
  console.log("history", history)
  return dispatch => {
    dispatch(requestStart());
    axios
      .put(`/api/army/update/${id}`, payload)
      .then(response => {
       console.log('hahahah')
      })
      .catch(error => {
        dispatch(requestFail(error));
      });
  };
}

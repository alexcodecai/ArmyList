const initState = { isLoading: false, error: "", data: [] };

const getSuperior = (state = initState, action) => {
  switch (action.type) {
    case "REQUEST_Armies_START":
      return {
        ...state,
        isLoading: true
      };
    case "REQUEST_Armies_SUCCESS":
      return {
        ...state,
        isLoading: false,
        data: action.armies
      };
    case "REQUEST_Armies_FAIL":
      return {
        ...state,
        isLoading: false,
        error: action.error
      };
    default:
      return state;
  }
};

export default getSuperior;

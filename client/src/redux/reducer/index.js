import { combineReducers } from "redux";
import armies from "./armies"
import getSuperior from './getSuperior'

const reducers = combineReducers({
  armies,
  getSuperior
});

export default reducers;

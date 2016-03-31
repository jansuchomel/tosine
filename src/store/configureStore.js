import { createStore, combineReducers } from 'redux'
import * as reducers from '../reducers/RootReducer';

const rootReducer = combineReducers(reducers);

export default function configureStore(initialState) {
  return createStore(rootReducer);
}

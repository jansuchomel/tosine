import { createStore, combineReducers } from 'redux'
import rootReducer from '../reducers/RootReducer';

export default function configureStore(initialState) {
  return createStore(rootReducer);
}

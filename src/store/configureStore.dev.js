import { createStore, combineReducers, compose } from 'redux';
import rootReducer from '../reducers/RootReducer';
import DevTools from '../containers/DevTools';

const enhancer = compose(
  DevTools.instrument()
);

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, enhancer);
}

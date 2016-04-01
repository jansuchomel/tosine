import { combineReducers } from 'redux';

import PlayerReducer from './PlayerReducer';
import TrackReducer from './TrackReducer';

export default combineReducers({ player: PlayerReducer, track: TrackReducer });

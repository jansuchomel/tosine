import { combineReducers } from 'redux';

import PlayerReducer from './PlayerReducer';
import TrackReducer from './TrackReducer';
import PlaylistReducer from './PlaylistReducer';
import LibraryReducer from './LibraryReducer';

export default combineReducers({
  player: PlayerReducer,
  track: TrackReducer,
  playlist: PlaylistReducer,
  library: LibraryReducer
});

import { combineReducers } from 'redux';

import PlayerReducer from './PlayerReducer';
import TrackReducer from './TrackReducer';
import PlaylistReducer from './PlaylistReducer';
import LibraryReducer from './LibraryReducer';
import TracklistReducer from './TracklistReducer';


export default combineReducers({
  player: PlayerReducer,
  track: TrackReducer,
  playlist: PlaylistReducer,
  library: LibraryReducer,
  tracklist: TracklistReducer
});

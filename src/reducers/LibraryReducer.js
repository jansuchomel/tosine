import { Map } from 'immutable';

const defaultState = Map({})

export default function(state = defaultState, action) {
    switch (action.type) {
        case "LIBRARIES_GOT":
            return state.withMutations(mutatedState => {
                for (let library of action.libraries) {
                        if (library.type == "directory") {
                        mutatedState.set(library.name, Map({
                            name: library.name,
                            uri: library.uri,
                            artists: Map({})
                        }));
                    }
                }
            });
        case "LIBRARY_EXPANDED":
            return state.withMutations(mutatedState => {
                for (let artist of action.artists) {
                    if (artist.name.trim() == "") continue;
                    mutatedState.setIn([action.library, "artists", artist.name], Map({uri: artist.uri, albums: Map({}), name: artist.name}));
                }
            });
        case "ARTIST_EXPANDED":
            return state.withMutations(mutatedState => {
                for (let album of action.albums) {
                    mutatedState.setIn([action.library, "artists", action.artist, "albums", album.name], Map({uri: album.uri, tracks: Map({}), name:album.name}));
                }});
        case "ALBUM_EXPANDED":
            return state.withMutations(mutatedState => {
                for (let track of action.tracks) {
                    mutatedState.setIn([action.library, "artists", action.artist, "albums", action.album, "tracks", track.name],
                    Map(track));
                }});
        case "TRACK_EXPANDED":
            return state.setIn([action.library, "artists", action.artist, "albums", action.album, "tracks", action.track],
                Map(action.details));
        default:
            return state;
    }
}

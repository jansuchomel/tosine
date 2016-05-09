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
                            artists: Map({}),
                            visible: true
                        }));
                    }
                }
            });
        case "LIBRARY_EXPANDED":
            let library = state.getIn([action.library, "artists"]);
            return state.setIn([action.library, "artists"], library.withMutations(mutatedLibrary => {
                for (let artist of action.artists) {
                    if (artist.name.trim() == "") continue; // empty google music artist workaround
                    mutatedLibrary.set(artist.name, Map({uri: artist.uri, albums: Map({}), name: artist.name, visible: true}));
                }
            }).sortBy(artist => artist.get("name"))
        );
        case "ARTIST_EXPANDED":
            return state.withMutations(mutatedState => {
                for (let album of action.albums) {
                    mutatedState.setIn([action.library, "artists", action.artist, "albums", album.name], Map({uri: album.uri, tracks: Map({}), name:album.name, visible: true}));
                }});
        case "ALBUM_EXPANDED":
            return state.withMutations(mutatedState => {
                for (let track of action.tracks) {
                    mutatedState.setIn([action.library, "artists", action.artist, "albums", action.album, "tracks", track.name],
                    Map(track).set("visible", true).set("track_no", -1));
                }});
        case "TRACK_EXPANDED":
            return state.setIn(
                [action.library, "artists", action.artist, "albums", action.album, "tracks"],
                state.getIn(
                    [action.library, "artists", action.artist, "albums", action.album, "tracks"])
                .set(
                    action.track, Map(action.details).set("visible", true))
                .sortBy(track => track.get("track_no")));
        default:
            return state;
    }
}

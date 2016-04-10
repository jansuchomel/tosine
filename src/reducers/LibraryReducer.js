import { Map } from 'immutable';

const defaultState = Map({})

export default function(state = defaultState, action) {
    switch (action.type) {
        case "LIBRARY_UPDATED":
            return state.withMutations(function (mutatedState) {
                for (let artist of action.artists) {
                    let uris = [];
                    if (mutatedState.get(artist.name) != undefined) {
                        uris = mutatedState.getIn([artist.name, "uris"]);
                    }
                    uris.push(artist.uri);
                    mutatedState.set(artist.name, Map({uris: uris, albums: Map({})}));
                }
            });
        case "ARTIST_EXPANDED":
            let oldArtist = state.get(action.artist);
            if (oldArtist == null) oldArtist = Map({});
            let newAlbums = (oldArtist.has("albums"))
                ? oldArtist.get("albums").withMutations(mutatedAlbums => {
                    for (let album of action.albums) {
                        let oldAlbum = mutatedAlbums.get(album.name);
                        let newAlbum = null;
                        if (oldAlbum != null) {
                            let oldUris = oldAlbum.get("uris");
                            oldUris.push(album.uri);
                            newAlbum = oldAlbum.set("uris", oldUris);
                        }
                        else {
                            oldAlbum = Map(album);
                            newAlbum = oldAlbum.set("uris", [album.uri]);
                        }
                        mutatedAlbums.set(album.name, newAlbum.delete("uri").set("tracks", Map({})));
                    }})
                : action.albums.reduce((acc, album) => {
                    return acc.set(album.name, album)
                }, Map({}));
            return state.set(action.artist, oldArtist.set("albums", newAlbums));
        case "ALBUM_EXPANDED":
            let oldAlbum = state.getIn([action.artist, "albums", action.album]);
            if (oldAlbum == null) oldAlbum = Map({});
            let newTracks = (oldAlbum.has("tracks"))
                ? oldAlbum.get("tracks").withMutations(mutatedTracks => {
                    for (let track of action.tracks) {
                        let oldTrack = mutatedTracks.get(track.name);
                        let newTrack = null;
                        if (oldTrack != null) {
                            let oldUris = oldTrack.get("uris");
                            oldUris.push(track.uri);
                            newTrack = oldTrack.set("uris", oldUris);
                        }
                        else {
                            oldTrack = Map(track);
                            newTrack = oldTrack.set("uris", [track.uri]);
                        }
                        mutatedTracks.set(track.name, newTrack.delete("uri"));
                    }})
                : action.tracks.reduce((acc, track) => {
                    return acc.set(track.name, track)
                }, Map({}));
            return state.setIn([action.artist, "albums", action.album], oldAlbum.set("tracks", newTracks));
        default:
            return state;
    }
}

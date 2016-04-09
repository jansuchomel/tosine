import { Map } from 'immutable';

const defaultState = Map({})

export default function(state = defaultState, action) {
    switch (action.type) {
        case "LIBRARY_UPDATED":
            return state.withMutations(function (mutatedState) {
                for (let artist of action.artists) {
                    let uris = [];
                    if (mutatedState.get(artist.name) != undefined) {
                        uris = mutatedState.get(artist.name).uris;
                    }
                    uris.push(artist.uri);
                    mutatedState.set(artist.name, {uris: uris});
                }
            });
        case "LIBRARY_EXPANDED":
            let previousValue = state.get(action.artist);
            previousValue['albums'] = action.albums;
            return state.set(action.artist, { albums: action.albums, uris: previousValue.uris } );
        default:
            return state;
    }
}

import { Map } from 'immutable';

const defaultState = Map({})

export default function(state = defaultState, action) {
    switch (action.type) {
        case "LIBRARY_UPDATED":
            return state.withMutations(function (mutatedState) {
                for (let artist of action.artists) {
                    let uris = [];
                    uris.push(artist.uri);
                    mutatedState.set(artist.name, uris);
                }
            });
        default:
            return state;
    }
}

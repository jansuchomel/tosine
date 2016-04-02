let defaultState = { tracks: [], index: 0 };

export default function(state = defaultState, action) {
    switch (action.type) {
        case "TRACKLIST_CHANGED":
            return { ...state, tracks: action.tracks };
        case "INDEX_CHANGED":
            return { ...state, index: action.index };
        default:
            return state;
    }
}

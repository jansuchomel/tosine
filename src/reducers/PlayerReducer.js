let defaultState = {
    artist: "",
    title: "",
    album: "",
    duration: "",
    state: "stop"
};

export default function(state = defaultState, action) {
    switch (action.type) {
        case "SONG_CHANGED":
            return {...state }
        case "STATE_CHANGED":
            return { ...state }
        default:
            return state;
    }
}

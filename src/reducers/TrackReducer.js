let defaultState = {
    title: "",
    duration: 0,
    artists: [],
    album: {name: ""}
};

export default function(state = defaultState, action) {
    switch (action.type) {
        case "SONG_CHANGED":
            return {...state, title: action.title, duration: action.duration,
                    artists: action.artists, album: action.album}
        default:
            return state;
    }
}

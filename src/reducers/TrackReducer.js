let defaultState = {
    title: "",
    duration: 0,
    artists: [],
    album: {name: ""}
};

export default function(state = defaultState, action) {
    switch (action.type) {
        case "SONG_CHANGED":
            if (action.title == undefined) action.title = "";
            if (action.duration == undefined) action.duration = 0;
            if (action.artists == undefined) action.artists = [];
            if (action.album == undefined) action.album = {name: ""};
            return {...state, title: action.title, duration: action.duration,
                    artists: action.artists, album: action.album}
        default:
            return state;
    }
}

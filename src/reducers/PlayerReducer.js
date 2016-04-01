let defaultState = {
    state: "stopped"
};

export default function(state = defaultState, action) {
    switch (action.type) {
        case "STATE_CHANGED":
            return {...state, state: action.state}
        default:
            return state;
    }
}

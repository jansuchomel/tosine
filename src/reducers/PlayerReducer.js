let defaultState = {
    state: "stopped",
    position: 0
};

export default function(state = defaultState, action) {
    switch (action.type) {
        case "STATE_CHANGED":
            return {...state, state: action.state}
        case "POSITION_CHANGED":
            return {...state, position: action.position}            
        default:
            return state;
    }
}

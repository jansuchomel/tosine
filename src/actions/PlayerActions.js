export function stateChanged(params) {
    return {type: "STATE_CHANGED", state: params.state };
}

export function positionChanged(params) {
    return {type: "POSITION_CHANGED", position: params.position };
}

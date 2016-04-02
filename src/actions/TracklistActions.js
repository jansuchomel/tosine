export function trackSelected(params) {
    return { type: "TRACK_SELECTED", track: params.track };
}

export function trackListChanged(params) {
    return {type: "TRACKLIST_CHANGED", tracks: params.tracks };
}

export function indexChanged(params) {
    return {type: "INDEX_CHANGED", index: params.index };
}

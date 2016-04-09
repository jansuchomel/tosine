export function libraryUpdated(params) {
    return { type: "LIBRARY_UPDATED", artists: params.artists }
}

export function libraryExpanded(params) {
    return { type: "LIBRARY_EXPANDED", artist: params.artist, albums: params.albums }
}

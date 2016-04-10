export function libraryUpdated(params) {
    return { type: "LIBRARY_UPDATED", artists: params.artists }
}

export function artistExpanded(params) {
    return { type: "ARTIST_EXPANDED", artist: params.artist, albums: params.albums }
}

export function albumExpanded(params) {
    return { type: "ALBUM_EXPANDED", artist: params.artist, album: params.album, tracks: params.tracks }
}

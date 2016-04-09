export function libraryUpdated(params) {
    return { type: "LIBRARY_UPDATED", artists: params.artists }
}

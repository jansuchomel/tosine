import React, { Component } from 'react';
import { render } from 'react-dom';

import { VirtualScroll, AutoSizer } from 'react-virtualized';

export default class Library extends Component {
    expandLibrary(library, uri) {
        this.props.mopidyAction("expandLibrary", {library: library, uri: uri});
    }
    expandArtist(library, artist, uri) {
        this.props.mopidyAction("expandArtist", {library: library, artist:artist, uri: uri});
    }
    expandAlbum(library, artist, album, uri) {
        this.props.mopidyAction("expandAlbum", {library:library, artist:artist, album:album, uri: uri});
    }
    addToTl(uri) {
        this.props.mopidyAction("addToTl", {uri: uri});
    }
    render() {
        const { libraries, mopidyAction } = this.props;
        let comps = [];
        libraries.forEach((library, libraryName) => {
            comps.push(
                <span className="list-group-item level0" key={libraryName} onClick={this.expandLibrary.bind(this, libraryName, library.get("uri"))}>
                    {libraryName}
                    <a onClick={this.addToTl.bind(this, library.get("uri"))}>+</a>
                </span>);
                library.get("artists").forEach((artist, artistName) => {
                    comps.push(
                        <span className="list-group-item level1" key={artistName} onClick={this.expandArtist.bind(this, libraryName, artistName, artist.get("uri"))}>
                            {artistName}
                            <a onClick={this.addToTl.bind(this, artist.get("uri"))}>+</a>
                        </span>);
                        if (artist.has("albums")) {
                            let i = 0;
                             artist.get("albums").forEach((album, albumName) => {
                                comps.push(
                                    <span className="list-group-item level2"
                                        key={"album_" + artistName + "_" + ++i}
                                        onClick={this.expandAlbum.bind(this, libraryName, artistName, albumName, album.get("uri"))}>
                                        {albumName}
                                        <a onClick={this.addToTl.bind(this, album.get("uri"))}>+</a>
                                    </span>);
                                    let j = 0;
                                    let tracks = album.get("tracks");
                                    tracks.forEach((track, trackName) => {
                                        comps.push(
                                            <span className="list-group-item level3"
                                                key={"track_" + trackName + "_" + ++j}>
                                                {track.get("name")}
                                                <a onClick={this.addToTl.bind(this, track.get("uri"))}>+</a>
                                            </span>
                                        );
                                    });
                            });
                        }
                });

        })

        return (
            <div className="library-list list-group list-group-root">
                <AutoSizer>
                    {({ height, width }) => (
                        <VirtualScroll
                            width={width}
                            height={height}
                            rowsCount={comps.length}
                            rowHeight={40}
                            rowRenderer={
                                index => comps[index] // Could also be a DOM element
                            }
                        />
                    )}
                </AutoSizer>
            </div>
        );
    }
}

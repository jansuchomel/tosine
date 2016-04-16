import React, { Component } from 'react';
import { render } from 'react-dom';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

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
    render() {
        const { libraries, mopidyAction } = this.props;
        let comps = [];
        libraries.forEach((library, libraryName) => {
            comps.push(
                <li className="library" key={libraryName} onClick={this.expandLibrary.bind(this, libraryName, library.get("uri"))}>
                    {libraryName}
                </li>);
                library.get("artists").forEach((artist, artistName) => {
                    comps.push(
                        <li className="artist" key={artistName} onClick={this.expandArtist.bind(this, libraryName, artistName, artist.get("uri"))}>
                            {artistName}
                        </li>);
                        if (artist.has("albums")) {
                            let i = 0;
                             artist.get("albums").forEach((album, albumName) => {
                                comps.push(
                                    <li className="album"
                                        key={"album_" + artistName + "_" + ++i}
                                        onClick={this.expandAlbum.bind(this, libraryName, artistName, albumName, album.get("uri"))}>
                                        {albumName}
                                    </li>);
                                    let j = 0;
                                    let tracks = album.get("tracks");
                                    tracks.forEach((track, trackName) => {
                                        comps.push(
                                            <li className="track"
                                                key={"track_" + trackName + "_" + ++j}>
                                                {track.get("name")}
                                            </li>
                                        );
                                    });
                            });
                        }
                });

        })

        return (
            <div className="library">
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

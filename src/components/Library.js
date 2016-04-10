import React, { Component } from 'react';
import { render } from 'react-dom';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

import { VirtualScroll, AutoSizer } from 'react-virtualized';

export default class Library extends Component {
    expandArtist(artist, uris) {
        this.props.mopidyAction("expandArtist", {artist:artist, uris: uris});
    }
    expandAlbum(artist, album, uris) {
        this.props.mopidyAction("expandAlbum", {artist:artist, album:album, uris: uris});
    }
    renderItem(index, key) {
      return <div key={key}>{index}</div>;
    }
    render() {
        const { artists, mopidyAction } = this.props;
        let comps = [];
        artists.forEach((artist, artistName) => {
            comps.push(
                <li className="artist" key={artistName} onClick={this.expandArtist.bind(this, artistName, artist.get("uris"))}>
                    {artistName}
                </li>);
                if (artist.has("albums")) {
                    let i = 0;
                     artist.get("albums").forEach((album, albumName) => {
                        comps.push(
                            <li className="album"
                                key={"album_" + artistName + "_" + ++i}
                                onClick={this.expandAlbum.bind(this, artistName, albumName, album.get("uris"))}>
                                {albumName}
                            </li>);
                            console.log(album);
                            let j = 0;
                            let tracks = album.get("tracks");
                            if(tracks.count() > 0) console.log(tracks.count());
                            tracks.forEach((track, trackName) => {
                                console.log(track);
                                comps.push(
                                    <li className="track"
                                        key={"track_" + trackName + "_" + ++j}>
                                        {trackName}
                                    </li>

                                );
                            });


                    });
                }
        });

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

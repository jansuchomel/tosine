import React, { Component } from 'react';
import { render } from 'react-dom';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

import { VirtualScroll, AutoSizer } from 'react-virtualized';

export default class Library extends Component {
    expandArtist(artist, uris) {
        this.props.mopidyAction("expandArtist", {artist:artist, uris: uris})
    }
    renderItem(index, key) {
      return <div key={key}>{index}</div>;
    }
    render() {
        const { artists, mopidyAction } = this.props;

        let artistsComps = [];
        artists.forEach((artist, artistName) => {
            artistsComps.push(
                <li className="artist" key={artistName} onClick={this.expandArtist.bind(this, artistName, artist.uris)}>
                    {artistName}
                </li>);
                if ("albums" in artist) {
                    let i = 0;
                    for (let album of artist.albums) {
                        artistsComps.push(<li className="album" key={"album_" + artistName + "_" + ++i}>{album.name}</li>);
                    }
                 }
        });

        return (
            <div className="library">
                <AutoSizer>
                    {({ height, width }) => (
                        <VirtualScroll
                            width={width}
                            height={height}
                            rowsCount={artistsComps.length}
                            rowHeight={40}
                            rowRenderer={
                                index => artistsComps[index] // Could also be a DOM element
                            }
                        />
                    )}
                    </AutoSizer>
                </div>
        );
    }
}

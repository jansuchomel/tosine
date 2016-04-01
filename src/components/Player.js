import React, { Component } from 'react';
import { render } from 'react-dom';

export default class Player extends Component {
    render() {
        const { track, state } = this.props;

        let artistComps = [];
        track.artists.forEach(function (artist, i) {
            artistComps.push(<b key={"artist_" + i}> {artist.name} </b>);
        });

        return (
        <div>
            now { state }  <b>{ track.title } </b>
            by { artistComps }
            from <b> { track.album.name }</b>

        </div>);
    }
}

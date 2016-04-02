import React, { Component } from 'react';
import { render } from 'react-dom';

export default class Tracklist extends Component {
    render() {
        const { tracks, index } = this.props;

        let tracksComps = [];
        if (tracks != undefined) {
            tracks.forEach(function (track, i) {
              if (i == index) {
                  tracksComps.push(<li key={"track_" + i}><b> {track.name}</b> </li>);
              }
              else {
                  tracksComps.push(<li key={"track_" + i}> {track.name} </li>);
              }
            });
        }

        return (
        <ul>
            { tracksComps }
        </ul>);
    }
}

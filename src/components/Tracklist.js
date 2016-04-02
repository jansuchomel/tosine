import React, { Component } from 'react';
import { render } from 'react-dom';

export default class Tracklist extends Component {
    select(index) {
        this.props.mopidyAction("select", {index: index});
    }
    render() {
        const { tracks, index, mopidyAction } = this.props;

        let tracksComps = [];
        if (tracks != undefined) {
            tracks.forEach(function (track, i) {
                if ("track" in track) {
                    if (i == index) {
                      tracksComps.push(<li key={"track_" + track.tlid}><b> {track.track.name}</b> </li>);
                    }
                    else {
                      tracksComps.push(
                          <li key={"track_" + i} onDoubleClick={ this.select.bind(this, track.tlid) }>
                            {track.track.name}
                          </li>
                      );

                  }
                }
          }.bind(this));
        }

        return (
        <ul>
            { tracksComps }
        </ul>);
    }
}

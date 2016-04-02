import React, { Component } from 'react';
import { render } from 'react-dom';

import ListGroup from 'react-bootstrap/lib/ListGroup';
import ListGroupItem from 'react-bootstrap/lib/ListGroupItem';

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
                      tracksComps.push(
                          <ListGroupItem
                            key={"track_" + track.tlid} active>
                            {track.track.name}
                            </ListGroupItem>
                        );
                    }
                    else {
                      tracksComps.push(
                          <ListGroupItem
                            key={"track_" + track.tlid}
                            onClick={this.select.bind(this, track.tlid)}>
                            {track.track.name}
                            </ListGroupItem>
                      );

                  }
                }
          }.bind(this));
        }

        return (
        <ListGroup>
            { tracksComps }
        </ListGroup>);
    }
}

import React, { Component } from 'react';
import { render } from 'react-dom';

export default class Player extends Component {
    render() {
        const { track, state, mopidyAction } = this.props;

        let artistComps = [];
        if (track.artists != undefined) {
          track.artists.forEach(function (artist, i) {
              artistComps.push(<b key={"artist_" + i}> {artist.name} </b>);
          });
        }

        return (
        <div>
            <b>{ track.title } </b>
            by { artistComps }
            from <b> { track.album.name }</b>
            <Control state={ state } mopidyAction={ mopidyAction } />
        </div>);
    }
}

class Control extends Component {
    resume() {
        this.props.mopidyAction("resume");
    }
    pause() {
        this.props.mopidyAction("pause");
    }
    previous() {
        this.props.mopidyAction("previous");
    }
    next() {
        this.props.mopidyAction("next");
    }
    render() {
        const { state, mopidyAction } = this.props;

        let playPause = <a onClick={ this.resume.bind(this) }> play </a>;
        if ( state == "playing" ) {
            playPause = <a onClick={ this.pause.bind(this) }> pause </a>;
        }

        return (
            <div>
                <a onClick={ this.previous.bind(this) }> prev </a>
                { playPause }
                <a onClick={ this.next.bind(this) }> next </a>
            </div>
        )
    }
}

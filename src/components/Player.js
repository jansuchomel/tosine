import React, { Component } from 'react';
import { render } from 'react-dom';

import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

export default class Player extends Component {
    render() {
        const { track, state, mopidyAction, position } = this.props;

        let artistComps = [];
        if (track.artists != undefined) {
          track.artists.forEach(function (artist, i) {
              artistComps.push(<b key={"artist_" + i}> {artist.name} </b>);
          });
        }

        return (
        <span>
            <b>{ track.title } </b>
            by { artistComps }
            from <b> { track.album.name }</b>
            <Control state={ state } mopidyAction={ mopidyAction } />
            <SeekBar duration={ track.duration } position={position} state={state} />
        </span>);
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

        let playPause = <Button onClick={ this.resume.bind(this) }> <Glyphicon glyph="play" /> </Button>;
        if ( state == "playing" ) {
            playPause = <Button onClick={ this.pause.bind(this) }> <Glyphicon glyph="pause" /> </Button>;
        }
        else if ( state == "stopped" ) {
            playPause = <b>stopped</b>
        }

        return (
            <div>

                <Button onClick={ this.previous.bind(this) }> <Glyphicon glyph="step-backward" /> </Button>
                { playPause }
                <Button onClick={ this.next.bind(this) }> <Glyphicon glyph="step-forward" /> </Button>
            </div>
        )
    }
}

class SeekBar extends Component {
    constructor(props) {
        super(props);
        this.state = {position: props.position};
    }
    componentDidMount() {
        setInterval(() => {
            this.tick();
        }, 100);
        this.setState({position: this.props.position});
    }
    componentWillReceiveProps(nextProps) {
        this.setState({position: nextProps.position});
    }
    tick() {
        if (this.props.state == "playing") {
            this.setState({position: this.state.position + 100});
            this.state.step++;
        }
    }
    render() {
        const { duration } = this.props;
        if (this.state && "position" in this.state) {
            return <b>{ this.state.position / 1000}/{duration / 1000}</b>
        }
        else {
            return <b>ERROR</b>
        }
    }
}

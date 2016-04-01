import React, { Component } from 'react';
import { render } from 'react-dom';

export default class Player extends Component {
    render() {
        const { track, state } = this.props;
        return ( <p>now { state }  { track.title } </p>);
    }
}

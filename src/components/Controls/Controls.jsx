import React, { Component } from 'react';
import './Controls.css'

class Controls extends Component {
  render() {
    return (
      <div id='controls'>
        <button type='button' className={this.props.action === 'rotate' ? 'active' : ''} onClick={this.props.rotateTile}>Rotate Tile</button>
        <button type='button' onClick={this.props.saveMap}>Save Map</button>
        <button type='button' className={this.props.action === 'clear' ? 'active' : ''} onClick={this.props.clearTile}>Clear Tile</button>
      </div>
    );
  }
}

export default Controls;
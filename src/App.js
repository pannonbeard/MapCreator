import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import './App.css';

import wallPng from './assets/wall.png'
import floorWallPng from './assets/wood-floor-with-wall.png'
import woodFloorPng from './assets/wood-floor.png'

import Grid from './components/Grid/Grid'
import Controls from './components/Controls/Controls'
import Menu from './components/Menu/Menu'

class App extends Component {
  state = {
    tiles: [
      { id: 1, image: wallPng, name: 'wall', rotation: 0, count: 0 },
      { id: 2, image: woodFloorPng, name: 'wood floor', rotation: 0, count: 0 },
      { id: 3, image: floorWallPng, name: 'floor with wall', rotation: 0, count: 0 },
    ],
    squareSize: 50,
    currentTile: null,
    gridWidth: 10,
    gridHeight: 10,
    zoom: 100,
    background: 'grass'
  }

  componentDidMount() {
    const columns = document.body.clientWidth < 700 ? 
      Math.round(document.body.clientWidth / this.state.squareSize) :
      Math.round( (document.body.clientWidth - 200) / this.state.squareSize )
    const rows = Math.round(document.body.clientHeight / this.state.squareSize)

    this.setState({ gridWidth: columns, gridHeight: rows })
  }

  changeBackground = (e) => {
    this.setState({ background: e.target.value })
  }

  setCurrentTile = (tile) => {
    this.setState({ currentTile: tile, action: null })
  }

  updateTileCount = (tileId, change) => {
    let updatedTile = { ...this.state.tiles.find( tile => tile.id === tileId ) }
    updatedTile.count += change
    let tiles = this.state.tiles.map( tile => {
      if(tile.id == updatedTile.id){
        return {...updatedTile}
      }
      return {...tile}
    })
    this.setState({ tiles })
  }

  setToRotate = () =>{
    if(this.state.action === 'rotate'){
      this.setState({ action: null, currentTile: null })
    }else{
      this.setState({ action: 'rotate', currentTile: null })
    }
  }

  setToClear = () => {
    if(this.state.action === 'clear'){
      this.setState({ action: null, currentTile: null })
    }else{
      this.setState({ action: 'clear', currentTile: null })
    }
  }

  saveMap = () => {
    html2canvas(document.querySelector('#grid'))
      .then( canvas => {
        const image = canvas.toDataURL('image/jpeg').replace("image/jpeg", "image/octet-stream");
        console.log(image)
        const link = document.createElement('a')
        link.href = image
        link.download = 'map.png'
        document.body.appendChild(link)
        link.click()
        link.remove()
      })
  }

  setMapWidth = (width) => {
    this.setState({ gridWidth: width })
  }

  setMapHeight = (height) => {
    this.setState({ gridHeight: height })
  }

  render() {
    return (
      <div className="App">
      <Controls 
          clearTile={this.setToClear} 
          rotateTile={this.setToRotate} 
          saveMap={this.saveMap}
          gridWidth={this.state.gridWidth}
          gridHeight={this.state.gridHeight}
          setWidth={this.setMapWidth}
          setHeight={this.setMapHeight}
          action={this.state.action}
          />
        <Menu 
          gridHeight={this.state.gridWidth}
          gridWidth={this.state.gridWidth}
          tiles={this.state.tiles}
          setMapHeight={this.setMapHeight}
          setMapWidth={this.setMapWidth}
          changeBackground={this.changeBackground}
          currentTile={this.state.currentTile}
          setCurrentTile={this.setCurrentTile}
        />
        <div className="CreationArea">
          <header>
            <h1>Map Builder</h1>
          </header>
          <Grid 
            squareSize={this.state.squareSize} 
            gridWidth={this.state.gridWidth}
            gridHeight={this.state.gridHeight}
            zoom={this.state.zoom}
            background={this.state.background}
            status={this.state.action}
            currentTile={this.state.currentTile}
            action={this.state.action}
            />
        </div>
      </div>
    );
  }
}

export default App;

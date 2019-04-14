import React, { Component } from 'react';
import html2canvas from 'html2canvas';
import './App.css';

import wallPng from './assets/wall.png'
import floorWallPng from './assets/wood-floor-with-wall.png'
import woodFloorPng from './assets/wood-floor.png'

import Grid from './components/Grid/Grid'
import Controls from './components/Controls/Controls'

class App extends Component {
  state = {
    tiles: [
      { id: 1, image: wallPng, name: 'wall', rotation: 0, count: 0 },
      { id: 2, image: woodFloorPng, name: 'wood floor', rotation: 0, count: 0 },
      { id: 3, image: floorWallPng, name: 'floor with wall', rotation: 0, count: 0 },
    ],
    grid: [
      /*
        [
          [ {}, {}, {}, {} ]
        ]
      */
    ],
    squareSize: 50,
    currentTile: null,
    action: null,
    gridWidth: 10,
    gridHeight: 10,
    zoom: 100,
    background: 'grass',
    navOpen: false
  }

  componentDidMount() {
    const columns = document.body.clientWidth < 700 ? 
      Math.round(document.body.clientWidth / this.state.squareSize) :
      Math.round( (document.body.clientWidth - 200) / this.state.squareSize )
    const rows = Math.round(document.body.clientHeight / this.state.squareSize)

    this.setState({ gridWidth: columns, gridHeight: rows })
  }

  toggleNav = () => {
    this.setState({ navOpen: !this.state.navOpen })
  }

  changeBackground = (e) => {
    this.setState({ background: e.target.value })
  }

  genGrid = (grid) => {
    this.setState({ grid })
  }

  selectTile = (e, id) => {
    this.setState({ currentTile: id, action: null })
    if(this.state.navOpen){
      this.toggleNav()
    }
  }

  clearSpace = (row, column) => {
    const grid = this.state.grid.map( row => {
      return row.map( space => {
        return {...space, tile: {...space.tile} }
      })
    })
    const tile = grid[row][column].tile
    this.updateTileCount(tile.id, -1)
    grid[row][column] = { row, column, tile: null }
    this.setState({ grid })
  }

  rotateSpace = (row, column) => {
    const grid = this.state.grid.map( row => {
      return row.map( space => {
        return {...space, tile: {...space.tile} }
      })
    })
    const space = { 
      ...grid[row][column], 
      tile: { ...grid[row][column].tile} 
    }
    space.tile.rotation += 90
    if (space.tile.rotation > 270) {
      space.tile.rotation = 0
    }
    grid[row][column] = space
    this.setState({ grid })
  }

  setTile = (row, column) => {
    if(this.state.currentTile !== null){
      let tile = this.state.tiles.find( tile => tile.id === this.state.currentTile )
      this.updateTileCount(tile.id, 1)
      const grid = this.state.grid.map( row => {
        return row.map( space => {
          return { ...space, tile: {...space.tile} }
        })
      })
      
      grid[row][column] = { row, column, tile }
      this.setState({ grid })
    }else if (this.state.action === 'rotate'){
      this.rotateSpace(row, column)
    }else if (this.state.action === 'clear' ){
      this.clearSpace(row, column)
    }else{
      console.log("nothing happened")
    }
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
        <aside className={this.state.navOpen ? 'open' : '' }>
          <div className='navHeader'>
            <h1>Map Builder</h1>
            <div className='menu-closer' onClick={this.toggleNav}>
              <div className='bar'></div>
              <div className='bar'></div>
            </div>
          </div>
          <div className='height_width'>
            <label>H: <input type='number' value={this.state.gridHeight} onChange={ (e) => this.setMapHeight(e.target.value)} /></label>
            <label>W: <input type='number' value={this.state.gridWidth} onChange={ (e) => this.setMapWidth(e.target.value)}/></label>
          </div>
          <select onChange={this.changeBackground} className='gridBackground'>
            <option value='grass'>Grass</option>
            <option value='water'>Water</option>
          </select>
          <ul>
            {this.state.tiles.map(tile =>
              <li key={tile.id}>
                <img 
                  src={tile.image} 
                  alt={tile.name} 
                  className={this.state.currentTile === tile.id ? 'active' : ''}
                  onClick={(e) => this.selectTile(e, tile.id)}
                  />
              </li>
            )}
          </ul>
        </aside>
        { this.state.navOpen ? <div className='drawer-back' onClick={this.toggleNav}></div> : null }
        <div className="CreationArea">
          <header>
            <div className='menu-opener' onClick={this.toggleNav}>
              <div className='bar'></div>
              <div className='bar'></div>
              <div className='bar'></div>
            </div>
            <h1>Map Builder</h1>
          </header>
          <Grid 
            squareSize={this.state.squareSize} 
            grid={this.state.grid} 
            updateGrid={this.genGrid} 
            setTile={this.setTile}
            gridWidth={this.state.gridWidth}
            gridHeight={this.state.gridHeight}
            zoom={this.state.zoom}
            background={this.state.background}
            status={this.state.action}
            />
        </div>
      </div>
    );
  }
}

export default App;

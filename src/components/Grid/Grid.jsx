import React, { Component } from 'react';
import './Grid.css'
import Grass from '../../assets/grass.png'
import Water from '../../assets/water.jpg'
class Grid extends Component {
  state = {
    grid: [],
    action: null
  }

  componentDidMount() {
    this.genGrid()
  }

  componentDidUpdate(prevProps){
    if(prevProps.gridHeight !== this.props.gridHeight || 
        prevProps.gridWidth !== this.props.gridWidth){
      this.updateGrid()
    }
  }

  clearSpace = (row, column) => {
    const grid = this.state.grid.map( row => {
      return row.map( space => {
        return {...space, tile: {...space.tile} }
      })
    })
    // const tile = grid[row][column].tile
    // this.updateTileCount(tile.id, -1)
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
    if(this.props.currentTile !== null){
      let tile = { ...this.props.currentTile}
      // this.updateTileCount(tile.id, 1)
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


  updateGrid = () => {
    let grid = this.state.grid.map(row => {
      if(row.length > this.props.gridWidth){
        row = row.slice(0, this.props.gridWidth)
      }
      return row.map( item => {
        return {...item} 
      })
    })

    let newGrid = []
    for(let i = 0; i < this.props.gridHeight; i++){
      let row = []
      if(!grid[i]){
        let row = []
        for(let j = 0; j < this.props.gridWidth; j++){
          row.push({ row: i, column: j, tile: null })
        }
        newGrid.push(row)
      } else if(grid[i].length < this.props.gridWidth ){
        for(let j = 0; j < this.props.gridWidth; j++){
          if(!grid[i][j]){
            grid[i].push({ row: i, column: j, tile: null })
          }
        }
        row = grid[i]
      } else{
        row = grid[i]
      }
      newGrid.push(row)
    }
    this.setState({ grid: newGrid } )
  }

  genGrid = () => {
    const squaresWide = this.props.gridWidth
    const squaresHigh = this.props.gridHeight

    let grid = []
    for(let j = 0; j < squaresHigh; j++){
      let row = []
      for (let i = 0; i < squaresWide; i++) {
        row.push({ row: j, column: i, tile: null })
      }
      grid.push(row)
    }
    this.setState({ grid })
  }

  handleMouseOver = (e, row, column) => {
    e.preventDefault()
    if(e.buttons === 1){
      this.setTile(row, column)
    }
  }

  handleMouseDown = (e, row, column) => {
    e.preventDefault();
    this.setTile(row, column)
  }

  setBackground = () => {
    if(this.props.background === 'grass'){
      return Grass
    }else if (this.props.background === 'water'){
      return Water
    }
  }

  render() {
    const genGrid = this.state.grid.map((row) => {
      return row.map((space, index) => (
          <div
          key={index}
          className={`tile rotate-${space.tile !== null ? space.tile.rotation : ''}`}
          style={{
            backgroundImage: space.tile !== null ? `url('${space.tile.image}')` : '',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: this.props.squareSize,
            width: this.props.squareSize
          }}
          onMouseDown={(e) => this.handleMouseDown(e, space.row, space.column)}
          onMouseOver={(e) => this.handleMouseOver(e, space.row, space.column)}></div>
        ))
      })
      let currentCursor = this.props.status === 'rotate' ? 
        'rotating' : ''
    return (
      <main className={currentCursor}>
        <div id='grid' style={
          { 
            gridTemplateColumns: `repeat(${this.props.gridWidth}, ${this.props.squareSize}px)`,
            gridTemplateRows: `repeat(${this.props.gridHeight}, ${this.props.squareSize}px)`,
            display: 'grid',
            width: `${this.props.gridWidth * this.props.squareSize}px`,
            zoom: `${this.props.zoom}%`,
            backgroundImage: `url(${this.setBackground()})`,
          }
        }>
          {genGrid}
        </div>
      </main>
    );
  }
}

export default Grid;
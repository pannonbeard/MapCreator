import React, { Component } from 'react';
import './Grid.css'
import Grass from '../../assets/grass.png'
import Water from '../../assets/water.jpg'
class Grid extends Component {
  componentDidMount() {
    this.genGrid()
  }

  componentDidUpdate(prevProps){
    if(prevProps.gridHeight !== this.props.gridHeight || 
        prevProps.gridWidth !== this.props.gridWidth){
      this.updateGrid()
    }
  }

  updateGrid = () => {
    let grid = this.props.grid.map(row => {
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
    this.props.updateGrid(newGrid)
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
    this.props.updateGrid(grid)
  }

  handleMouseOver = (e, row, column) => {
    e.preventDefault()
    if(e.buttons === 1){
      this.props.setTile(row, column)
    }
  }

  handleMouseDown = (e, row, column) => {
    e.preventDefault();
    this.props.setTile(row, column)
  }

  setBackground = () => {
    if(this.props.background === 'grass'){
      return Grass
    }else if (this.props.background === 'water'){
      return Water
    }
  }

  render() {
    const genGrid = this.props.grid.map((row) => {
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
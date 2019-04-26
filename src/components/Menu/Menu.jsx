import React, { Fragment, useState } from 'react';

const Menu = (props) => {
  const [navOpen, setNavOpen] = useState(false)

  function toggleNav(){
    setNavOpen(!navOpen)
  }

  function selectTile (e, id) {
    props.setCurrentTile(id)

    if(navOpen){
      toggleNav()
    }
  }

  return (
    <Fragment>
      <div className='menu-opener' onClick={toggleNav}>
        <div className='bar'></div>
        <div className='bar'></div>
        <div className='bar'></div>
      </div>
      <aside className={navOpen ? 'open' : '' }>
        <div className='navHeader'>
          <h1>Map Builder</h1>
          <div className='menu-closer' onClick={toggleNav}>
            <div className='bar'></div>
            <div className='bar'></div>
          </div>
        </div>
        <div className='height_width'>
          <label>H: <input type='number' value={props.gridHeight} onChange={ (e) => props.setMapHeight(e.target.value)} /></label>
          <label>W: <input type='number' value={props.gridWidth} onChange={ (e) => props.setMapWidth(e.target.value)}/></label>
        </div>
        <select onChange={props.changeBackground} className='gridBackground'>
          <option value='grass'>Grass</option>
          <option value='water'>Water</option>
        </select>
        <ul>
          {props.tiles.map(tile =>
            <li key={tile.id}>
              <img 
                src={tile.image} 
                alt={tile.name} 
                className={props.currentTile === tile ? 'active' : ''}
                onClick={(e) => selectTile(e, tile)}
                />
            </li>
            )}
          </ul>
        </aside>
        { navOpen ? <div className='drawer-back' onClick={toggleNav}></div> : null }
      </Fragment>
  );
}

export default Menu;
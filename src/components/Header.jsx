import React from 'react';
import './Header.css';

function Header({ onNavClick, searchValue, onSearchChange }) {
  return (
    <div className="header">
      <h1 className="header__logo">NIGHTFALL</h1>
      <div className="header__nav">
        <button onClick={() => onNavClick('home')}>Home</button>
        <button onClick={() => onNavClick('tvshows')}>TV Shows</button>
        <button onClick={() => onNavClick('movies')}>Movies</button>
        <button onClick={() => onNavClick('new')}>New & Popular</button>
        <button onClick={() => onNavClick('mylist')}>My List</button>
        <button onClick={() => onNavClick('addmovie')}>Add Movie</button>
      </div>
      <div className="header__right">
        <input
          type="text"
          placeholder="Search"
          className="header__search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <img
          className="header__avatar"
          src="https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png"
          alt="Avatar"
        />
      </div>
    </div>
  );
}

export default Header;

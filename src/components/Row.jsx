import React, { useRef } from 'react';
import { SHA256 } from 'crypto-js';
import './Row.css';

function Row({ title, movies, id, showArrows = false, onSelect, onRemove }) {
  const postersRef = useRef();

  const scrollLeft = () => {
    postersRef.current.scrollBy({ left: -500, behavior: 'smooth' });
  };

  const scrollRight = () => {
    postersRef.current.scrollBy({ left: 500, behavior: 'smooth' });
  };

  return (
    <div className="row" id={id}>
      <h2>{title}</h2>
      <div className="row__container">
        {showArrows && (
          <button className="row__arrow row__arrow--left" onClick={scrollLeft}>‹</button>
        )}
        <div className="row__posters" ref={postersRef}>
          {movies.map((movie, index) => (
            <div key={index} className="row__posterContainer">
              <img
                className="row__poster"
                src={
                  movie.poster_path && movie.poster_path.startsWith('http')
                    ? movie.poster_path
                    : `https://image.tmdb.org/t/p/w780${movie.poster_path ?? ''}`
                }
                alt={movie.title}
                onClick={() => onSelect && onSelect(movie)}
              />
              {onRemove && (
                <button
                  className="row__remove"
                  onClick={(e) => {
                    e.stopPropagation();
                    const password = window.prompt('Enter admin password to remove movie:').trim();
                    const enteredHash = SHA256(password).toString();
                    if (enteredHash === import.meta.env.VITE_ADMIN_PASSWORD_HASH) {
                      onRemove(movie);
                    } else {
                      alert('Incorrect password. Access denied.');
                    }
                  }}
                  title="Remove from list"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        {showArrows && (
          <button className="row__arrow row__arrow--right" onClick={scrollRight}>›</button>
        )}
      </div>
    </div>
  );
}

export default Row;

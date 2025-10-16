import React from 'react';
import './Banner.css';

function Banner({ movie, onSelect }) {
  return (
    <div className="banner" id="home">
      <div className="banner__container">
        <img
          className="banner__poster"
          src={`https://image.tmdb.org/t/p/w780${movie.poster_path}`}
          alt={movie.title}
          onClick={() => onSelect && onSelect(movie)}
        />
        <div className="banner__details">
          <h1 className="banner__title">{movie.title}</h1>
          <div className="banner__meta">
            <span>{movie.releaseDate}</span>
            <span>{movie.duration}</span>
            <span>⭐ {movie.rating}</span>
          </div>
          <div className="banner__tags">
            <span className="banner__badge">{movie.genre}</span>
            <span className="banner__badge">Director: {movie.director}</span>
          </div>
          <p className="banner__description">{movie.description}</p>
          <div className="banner__buttons">
            <button className="banner__primary" onClick={() => onSelect && onSelect(movie)}>Watch</button>
          </div>
        </div>
      </div>
      <div className="banner--fadeBottom"></div>
    </div>
  );
}

export default Banner;

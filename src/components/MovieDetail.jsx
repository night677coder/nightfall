import React, { useState, useEffect, useMemo } from 'react';
import './MovieDetail.css';
import Row from './Row';

function MovieDetail({ movie, recommended = [], onSelect, onBack }) {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [maxEpisodes, setMaxEpisodes] = useState(movie.seasonsEpisodes ? movie.seasonsEpisodes[0] : 10);

  const availableServers = useMemo(() => {
    if (movie.type === 'tv') {
      return [];
    }
    const uniqueServers = movie.servers ? [...movie.servers] : [];
    const baseUrl = movie.videoUrl || uniqueServers[0]?.url || null;

    if (baseUrl && !uniqueServers.some(server => server.url === baseUrl)) {
      uniqueServers.unshift({ name: 'Default', url: baseUrl });
    }

    if (!uniqueServers.length && baseUrl) {
      uniqueServers.push({ name: 'Default', url: baseUrl });
    }

    if (baseUrl && baseUrl.includes('2embed.')) {
      const hasParam = baseUrl.includes('?');
      const hasServerParam = baseUrl.includes('server=');
      const vsrccUrl = hasServerParam ? baseUrl.replace(/server=[^&]*/i, 'server=vsrcc') : `${baseUrl}${hasParam ? '&' : '?'}server=vsrcc`;
      if (!uniqueServers.some(server => server.url === vsrccUrl)) {
        uniqueServers.push({ name: 'VSRCC', url: vsrccUrl });
      }
    }

    return uniqueServers;
  }, [movie]);

  const [activeServer, setActiveServer] = useState(availableServers[0]?.name || null);
  const [activeVideoUrl, setActiveVideoUrl] = useState(
    availableServers[0]?.url || (movie.type === 'tv' ? null : movie.videoUrl || null)
  );

  useEffect(() => {
    const newMax = movie.seasonsEpisodes ? movie.seasonsEpisodes[selectedSeason - 1] : 10;
    setMaxEpisodes(newMax);
    if (selectedEpisode > newMax) {
      setSelectedEpisode(1);
    }
  }, [selectedSeason, movie.seasonsEpisodes, selectedEpisode]);

  useEffect(() => {
    if (movie.type === 'tv') {
      setActiveServer(null);
      setActiveVideoUrl(null);
      return;
    }

    if (availableServers.length) {
      setActiveServer(availableServers[0].name);
      setActiveVideoUrl(availableServers[0].url);
    } else {
      setActiveServer(null);
      setActiveVideoUrl(movie.videoUrl || null);
    }
  }, [movie, availableServers]);

  return (
    <div className="detail">
      <button className="detail__back" onClick={onBack}>
        ← Back
      </button>

      <section className="detail__info">
        <img
          className="detail__poster"
          src={movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w780${movie.poster_path}`}
          alt={movie.title}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/220x330?text=No+Image'; }}
        />
        <div className="detail__meta">
          <h1>{movie.title}</h1>
          <div className="detail__grid">
            <div>
              <span className="detail__label">Title</span>
              <span>{movie.title}</span>
            </div>
            <div>
              <span className="detail__label">Quality</span>
              <span>{movie.quality || 'HD'}</span>
            </div>
            <div>
              <span className="detail__label">Released</span>
              <span>{movie.releaseDate}</span>
            </div>
            <div>
              <span className="detail__label">Genre</span>
              <span>{movie.genre}</span>
            </div>
            <div>
              <span className="detail__label">Country</span>
              <span>{movie.country || 'United States'}</span>
            </div>
            <div>
              <span className="detail__label">Cast</span>
              <span>{movie.cast || 'Cast information not available'}</span>
            </div>
            <div>
              <span className="detail__label">{movie.type === "tv" ? "Seasons" : "Duration"}</span>
              <span>{movie.type === "tv" ? movie.seasons : movie.duration}</span>
            </div>
            {movie.type === "tv" && (
              <div>
                <span className="detail__label">Episodes</span>
                <span>{movie.episodes}</span>
              </div>
            )}
            <div>
              <span className="detail__label">Rating</span>
              <span>⭐ {movie.rating}</span>
            </div>
            <div>
              <span className="detail__label">Director</span>
              <span>{movie.director}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="detail__trailer">
        <h2>Watch {movie.title} Online</h2>
        <div className="detail__trailerBox">
          {movie.type === "tv" ? (
            <iframe
              src={`https://player4u.xyz/embed?key=${movie.title.toLowerCase().replace(/ /g, '%20')}%20s${selectedSeason.toString().padStart(2, '0')}e${selectedEpisode.toString().padStart(2, '0')}`}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              title={`${movie.title} trailer`}
            ></iframe>
          ) : (activeVideoUrl || movie.videoUrl) ? (
            <iframe
              src={activeVideoUrl || movie.videoUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              allowFullScreen
              title={`${movie.title} trailer`}
            ></iframe>
          ) : (
            <>
              <img src={movie.trailerImage} alt={`${movie.title} trailer`} />
              <button className="detail__play">▶</button>
            </>
          )}
        </div>
        {movie.type !== "tv" && availableServers.length > 0 && (
          <div className="detail__servers">
            <h3>Available Servers</h3>
            <div className="detail__serverButtons">
              {availableServers.map((server) => (
                <button
                  key={server.name}
                  className={`detail__serverButton${server.name === activeServer ? ' detail__serverButton--active' : ''}`}
                  onClick={() => {
                    setActiveServer(server.name);
                    setActiveVideoUrl(server.url);
                  }}
                >
                  {server.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {movie.type === "tv" && (
          <div className="detail__selectors">
            <label>Season: 
              <select value={selectedSeason} onChange={(e) => setSelectedSeason(Number(e.target.value))}>
                {Array.from({ length: movie.seasons }, (_, i) => i + 1).map(season => (
                  <option key={season} value={season}>Season {season}</option>
                ))}
              </select>
            </label>
            <label>Episode: 
              <select value={selectedEpisode} onChange={(e) => setSelectedEpisode(Number(e.target.value))}>
                {Array.from({ length: maxEpisodes }, (_, i) => i + 1).map(episode => (
                  <option key={episode} value={episode}>Episode {episode}</option>
                ))}
              </select>
            </label>
          </div>
        )}
      </section>

      <section className="detail__synopsis">
        <h2>Synopsis</h2>
        <p>{movie.description}</p>
      </section>

      {recommended.length > 0 && (
        <section className="detail__recommend">
          <h2>You May Also Like</h2>
          <Row
            id="recommended"
            title="Recommended"
            movies={recommended}
            onSelect={onSelect}
          />
        </section>
      )}
    </div>
  );
}

export default MovieDetail;

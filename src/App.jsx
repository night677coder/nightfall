import React, { useState, useMemo, useEffect } from 'react';
import './App.css';
import Header from './components/Header.jsx';
import Banner from './components/Banner.jsx';
import Row from './components/Row.jsx';
import MovieDetail from './components/MovieDetail.jsx';
import AddMovie from './components/AddMovie.jsx';
import Footer from './components/Footer.jsx';
import AdSense from './components/AdSense.jsx';
import { trending, movies, tvshows, newpopular, mylist, allMovies } from './movieData';

const shuffleArray = (items) => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const STORAGE_KEYS = {
  section: 'nightfall.currentSection',
  selectedMovie: 'nightfall.selectedMovieTitle',
  isDetailView: 'nightfall.isDetailView',
  lastSection: 'nightfall.lastSection'
};

function App() {
  const [currentSection, setCurrentSection] = useState(() => {
    if (typeof window === 'undefined') {
      return 'home';
    }
    const storedSection = window.localStorage.getItem(STORAGE_KEYS.section);
    return storedSection || 'home';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMovie, setSelectedMovie] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    const storedMovie = window.localStorage.getItem(STORAGE_KEYS.selectedMovie);
    if (!storedMovie) {
      return null;
    }
    return allMovies.find((movie) => movie.title === storedMovie) || null;
  });
  const [isDetailView, setIsDetailView] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const storedIsDetail = window.localStorage.getItem(STORAGE_KEYS.isDetailView);
    return storedIsDetail === 'true' && !!selectedMovie;
  });
  const [userAddedMovies, setUserAddedMovies] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    const stored = window.localStorage.getItem('nightfall.userAddedMovies');
    return stored ? JSON.parse(stored) : [];
  });
  const shuffledTrending = useMemo(() => shuffleArray(trending), []);
  const shuffledMovies = useMemo(() => shuffleArray(movies), []);
  const shuffledNewPopular = useMemo(() => shuffleArray(newpopular), []);
  const shuffledTvShows = useMemo(() => shuffleArray(tvshows), []);
  const recommendedMovies = selectedMovie
    ? allMovies.filter((movie) => movie.title !== selectedMovie.title)
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
    : [];

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.section, currentSection);
  }, [currentSection]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (selectedMovie) {
      window.localStorage.setItem(STORAGE_KEYS.selectedMovie, selectedMovie.title);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.selectedMovie);
    }
  }, [selectedMovie]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem(STORAGE_KEYS.isDetailView, isDetailView.toString());
  }, [isDetailView]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    window.localStorage.setItem('nightfall.userAddedMovies', JSON.stringify(userAddedMovies));
  }, [userAddedMovies]);

  const handleNavClick = (section) => {
    setSearchTerm('');
    setSelectedMovie(null);
    setIsDetailView(false);
    setCurrentSection(section);
  };

  const handleAddMovie = (movie) => {
    setUserAddedMovies(prev => [...prev, movie]);
  };

  const handleRemoveMovie = (movie) => {
    setUserAddedMovies(prev => prev.filter(m => m.title !== movie.title));
  };

  const handleSelectMovie = (movie) => {
    window.localStorage.setItem(STORAGE_KEYS.lastSection, currentSection);
    const fullMovie = allMovies.find((item) => item.title === movie.title) || movie;
    setSelectedMovie(fullMovie);
    setIsDetailView(true);
    setSearchTerm(''); // Clear search when selecting a movie
  };

  const handleBackToBrowse = () => {
    setSelectedMovie(null);
    setIsDetailView(false);
    const lastSection = window.localStorage.getItem(STORAGE_KEYS.lastSection) || 'home';
    setCurrentSection(lastSection);
  };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const searchResults = normalizedSearch
    ? [...allMovies, ...userAddedMovies].filter((movie) =>
        movie.title.toLowerCase().includes(normalizedSearch)
      )
    : [];

  const renderSearchResults = () => {
    if (!searchResults.length) {
      return (
        <div className="search-empty">
          No results found for "{searchTerm}".
        </div>
      );
    }

    return (
      <Row
        id="search"
        title={`Search Results for "${searchTerm}"`}
        movies={searchResults}
        showArrows={searchResults.length > 5}
        onSelect={handleSelectMovie}
      />
    );
  };

  const renderContent = () => {
    if (isDetailView && selectedMovie) {
      return (
        <MovieDetail
          movie={selectedMovie}
          recommended={recommendedMovies}
          onSelect={handleSelectMovie}
          onBack={handleBackToBrowse}
        />
      );
    }

    switch (currentSection) {
      case 'home':
        return (
          <>
            <Banner movie={shuffledTrending[0] || trending[0]} onSelect={handleSelectMovie} />
            <Row id="trending" title="Trending Now" movies={shuffledTrending} showArrows onSelect={handleSelectMovie} />
            <AdSense adSlot="1234567890" />
            <Row id="movies" title="movies" movies={shuffledMovies.slice(0, 6)} onSelect={handleSelectMovie} />
            <Row id="new" title="New & Popular" movies={shuffledNewPopular.slice(0, 6)} onSelect={handleSelectMovie} />
            <AdSense adSlot="0987654321" />
            <Row id="mylist-home" title="My List" movies={[...mylist, ...userAddedMovies].slice(0,6)} onSelect={handleSelectMovie} />
            <Row id="Tv Shows" title="Tv Shows" movies={shuffledTvShows.slice(0, 6)} onSelect={handleSelectMovie} />
          </>
        );
      case 'addmovie':
        return <AddMovie onAddMovie={handleAddMovie} />;
      case 'tvshows': {
        const rows = [];
        for (let i = 0; i < tvshows.length; i += 6) {
          const title = "Tv Shows";
          rows.push(
            <Row
              key={i}
              id={`TvShows${i}`}
              title={title}
              movies={tvshows.slice(i, i + 6)}
              onSelect={handleSelectMovie}
            />
          );
        }
        return <>{rows}</>;
      }
      case 'movies': {
        const rows = [];
        for (let i = 0; i < movies.length; i += 6) {
          const title = "Movies";
          rows.push(
            <Row
              key={i}
              id={`Movies${i}`}
              title={title}
              movies={movies.slice(i, i + 6)}
              onSelect={handleSelectMovie}
            />
          );
        }
        return <>{rows}</>;
      }
      case 'new': {
        const rows = [];
        for (let i = 0; i < newpopular.length; i += 6) {
          const title = "New & Popular";
          rows.push(
            <Row
              key={i}
              id={`New${i}`}
              title={title}
              movies={newpopular.slice(i, i + 6)}
              onSelect={handleSelectMovie}
            />
          );
        }
        return <>{rows}</>;
      }
      case 'mylist': {
        const allMyList = [...mylist, ...userAddedMovies];
        const rows = [];
        for (let i = 0; i < allMyList.length; i += 6) {
          const title = "My List";
          rows.push(
            <Row
              key={i}
              id={`MyList${i}`}
              title={title}
              movies={allMyList.slice(i, i + 6)}
              onSelect={handleSelectMovie}
              onRemove={handleRemoveMovie}
            />
          );
        }
        return <>{rows}</>;
      }
      default:
        return (
          <>
            <Banner movie={shuffledTrending[0] || trending[0]} onSelect={handleSelectMovie} />
            <Row id="trending" title="Trending Now" movies={shuffledTrending} showArrows onSelect={handleSelectMovie} />
            <Row id="movies" title="movies" movies={shuffledMovies} onSelect={handleSelectMovie} />
            <Row id="new" title="New & Popular" movies={shuffledNewPopular} onSelect={handleSelectMovie} />
            <Row id="mylist" title="My List" movies={mylist} onSelect={handleSelectMovie} />
            <Row id="Tv Shows" title="Tv Shows" movies={shuffledTvShows.slice(0, 6)} onSelect={handleSelectMovie} />
          </>
        );
    }
  };

  return (
    <div className="app">
      <Header
        onNavClick={handleNavClick}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />
      <main className="content">
        {normalizedSearch && !isDetailView
          ? renderSearchResults()
          : renderContent()}
      </main>
      <Footer />
    </div>
  );
}

export default App;

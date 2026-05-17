import { useEffect, useState } from 'react';
import Search from './components/Search.jsx';
import Spinner from './components/Spinner.jsx';
import MovieCard from './components/MovieCard.jsx';
import { useDebounce } from 'react-use';
import {getTrendingMovies, updateSearchCount} from './appwrite.js';

const API_BASE_URL = import.meta.env.VITE_TMDB_API_BASE_URL;

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    }
}

const App = () => {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const [movieList, setMovieList] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const [trendingMovies, setTrendingMovies] = useState([]);
    const [trendingMovieError, setTrendingMovieError] = useState('');
    const [trendingMovieLoading, setTrendingMovieLoading] = useState(false);

    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

    const fetchMovies = async (query = '') => {
        setLoading(true);
        setError('');

        try{
            const endPoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

            const response = await fetch(endPoint, API_OPTIONS);

            if (!response.ok) {
                setError(`Error fetching movies (${response.status})`);
                setMovieList([]);
                return;
            }

            const data = await response.json();

            if(data.Response === 'False') {
                setError(data.Error || 'Error fetching movies');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || []);

            if(query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        }catch(error) {
            console.log(`Error fetching movies: ${error}`);
            setError(`Error fetching movies: ${error}`);
        }finally {
            setLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        setTrendingMovieLoading(true);
        setTrendingMovieError('');

        try {
            const trendingMovies = await getTrendingMovies();

            setTrendingMovies(trendingMovies);
        }catch (error) {
            console.log(`Error fetching trending movies: ${error}`);
            setTrendingMovieError(`Error fetching trending movies: ${error}`);
        }finally {
            setTrendingMovieLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies();
    }, [])

    return (
        <main>
            <div className="pattern" />

            <div className="wrapper">
                <header>
                    <img src="/hero.png" alt="Hero Banner" />
                    <h1>
                        Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle
                    </h1>

                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </header>

                {trendingMovies.length > 0 && (
                    <section className="trending">
                        <h2>Trending Movies</h2>

                        {trendingMovieLoading ? (
                            <Spinner />
                        ) : trendingMovieError ? (
                            <p className="error">{trendingMovieError}</p>
                        ) : (
                            <ul>
                                {trendingMovies.map((movie, index) => {
                                    return (
                                        <li key={movie.$id || index}>
                                            <p>{index + 1}</p>
                                            <img src={movie.poster_url} alt={movie.title} />
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </section>
                )}

                <section className="all-movies">
                    <h2>All Movies</h2>

                    {loading ? (
                        <Spinner />
                    ) : error ? (
                        <p className="text-white">{error}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    );
};

export default App;
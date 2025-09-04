import { useEffect, useState } from "react";
import type { MovieType } from "../App";
import MovieDetail from "./MovieDetail";
import { fetchMovies } from "../services/api";

export default function Movies({
  addToCart,
  addToFavorites,
}: {
  addToCart: (movie: MovieType) => void;
  addToFavorites: (movie: MovieType) => void;
}) {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [search, setSearch] = useState(""); // untuk search input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // fetch movies berdasarkan keyword
  const loadMovies = (query: string) => {
    setLoading(true);
    setError("");
    fetchMovies(query)
      .then(setMovies)
      .catch(() => setError("Gagal memuat film."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMovies("Batman");
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    loadMovies(search.trim());
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Movies</h1>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6 flex">
        <input
          type="text"
          placeholder="Cari film..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 rounded-l-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-r-lg"
        >
          Cari
        </button>
      </form>

      {/* Loading & Error */}
      {loading && <p className="text-gray-900 dark:text-white mb-4">Memuat film...</p>}
      {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer"
            onClick={() => setSelectedMovie(movie.imdbID)}
          >
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "/images/no-image.png"}
              alt={movie.Title}
              className="w-full h-72 object-cover"
            />
            <div className="p-3 text-gray-900 dark:text-white">
              <h2 className="font-semibold">{movie.Title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{movie.Year}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal MovieDetail */}
      {selectedMovie && (
        <MovieDetail
          movieId={selectedMovie}
          onClose={() => setSelectedMovie(null)}
          addToCart={addToCart}
          addToFavorites={addToFavorites}
        />
      )}
    </div>
  );
}

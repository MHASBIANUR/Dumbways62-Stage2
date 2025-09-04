type FavoriteMovie = {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
};

type FavoritesProps = {
  favorites: FavoriteMovie[];
  setFavorites: (favorites: FavoriteMovie[]) => void;
};

export default function Favorites({ favorites, setFavorites }: FavoritesProps) {
  const removeFavorite = (imdbID: string) => {
    const updated = favorites.filter(f => f.imdbID !== imdbID);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  if (favorites.length === 0) {
    return (
      <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Favorite Movies</h1>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Belum ada film favorit. Tambahkan dari halaman Movies.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">My Favorite Movies</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {favorites.map((movie) => (
          <div
            key={movie.imdbID}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={movie.Poster !== "N/A" ? movie.Poster : "/images/no-image.png"}
              alt={movie.Title}
              className="w-full h-72 object-cover"
            />
            <div className="p-3 text-gray-900 dark:text-white">
              <h2 className="font-semibold">{movie.Title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{movie.Year}</p>
              <button
                onClick={() => removeFavorite(movie.imdbID)}
                className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

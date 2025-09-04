// MovieDetail.tsx
import { useEffect, useState } from "react";

export type MovieDetailType = {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  Genre: string;
  Plot: string;
  Actors: string;
};

type CartItem = MovieDetailType & { quantity: number };

type MovieDetailProps = {
  movieId: string;
  onClose: () => void;
  addToCart: (movie: CartItem) => void;
  addToFavorites: (movie: MovieDetailType) => void;
};

export default function MovieDetail({
  movieId,
  onClose,
  addToCart,
  addToFavorites,
}: MovieDetailProps) {
  const [movie, setMovie] = useState<MovieDetailType | null>(null);

  useEffect(() => {
    fetch(`https://www.omdbapi.com/?i=${movieId}&apikey=eb86308a`)
      .then(res => res.json())
      .then(data => {
        if (data.Response === "True") {
          setMovie({
            imdbID: data.imdbID,
            Title: data.Title,
            Poster: data.Poster,
            Year: data.Year,
            Genre: data.Genre,
            Plot: data.Plot,
            Actors: data.Actors,
          });
        }
      });
  }, [movieId]);

  if (!movie)
    return <p className="text-center mt-6 text-gray-900 dark:text-gray-100">Loading...</p>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg relative text-gray-900 dark:text-white">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          ✕
        </button>
        <img src={movie.Poster !== "N/A" ? movie.Poster : "/images/no-image.png"} alt={movie.Title} className="w-full h-72 object-cover rounded-lg mb-4"/>
        <h2 className="text-xl font-bold">{movie.Title}</h2>
        <p className="text-gray-600 dark:text-gray-400">{movie.Year} • {movie.Genre}</p>
        <p className="mt-2">{movie.Plot}</p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">🎭 {movie.Actors}</p>
        <div className="flex gap-2 mt-4">
          <button onClick={() => addToCart({ ...movie, quantity: 1 })} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 active:scale-95 transition transform">
            Add to Cart
          </button>
          <button onClick={() => addToFavorites(movie)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 active:scale-95 transition transform">
            Favorite
          </button>
        </div>
      </div>
    </div>
  );
}

// src/services/api.ts
import axios from "axios";

// Fake store API (kalau masih dipakai)
export const api = axios.create({
  baseURL: "https://fakestoreapi.com/",
});

// OMDb API
const OMDB_API_KEY = "eb86308a";
export const fetchMovies = async (search: string) => {
  const res = await axios.get(`https://www.omdbapi.com/`, {
    params: {
      s: search,
      apikey: OMDB_API_KEY,
    },
  });
  return res.data.Search || [];
};

const API_KEY = "7745dfac93b5fd660453a17696753913";
const BASE_URL = "https://api.themoviedb.org/3";

export interface IGetMovies {
  dates:         Dates;
  page:          number;
  results:       Result[];
  total_pages:   number;
  total_results: number;
}

export interface Dates {
  maximum: Date;
  minimum: Date;
}

export interface Result {
  adult:             boolean;
  backdrop_path:     null | string;
  genre_ids:         number[];
  id:                number;
  original_language: string;
  original_title:    string;
  overview:          string;
  popularity:        number;
  poster_path:       string;
  release_date:      Date;
  title:             string;
  video:             boolean;
  vote_average:      number;
  vote_count:        number;
}


export function getMovies(){
  return fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ko&page=1&region=kr`).then(resp => resp.json());
}
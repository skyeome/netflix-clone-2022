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


export interface IGetMovieDetail {
  adult:                 boolean;
  backdrop_path:         string;
  belongs_to_collection: BelongsToCollection;
  budget:                number;
  genres:                Genre[];
  homepage:              string;
  id:                    number;
  imdb_id:               string;
  original_language:     string;
  original_title:        string;
  overview:              string;
  popularity:            number;
  poster_path:           string;
  production_companies:  ProductionCompany[];
  production_countries:  ProductionCountry[];
  release_date:          Date;
  revenue:               number;
  runtime:               number;
  spoken_languages:      SpokenLanguage[];
  status:                string;
  tagline:               string;
  title:                 string;
  video:                 boolean;
  vote_average:          number;
  vote_count:            number;
}

export interface BelongsToCollection {
  id:            number;
  name:          string;
  poster_path:   string;
  backdrop_path: string;
}

export interface Genre {
  id:   number;
  name: string;
}

export interface ProductionCompany {
  id:             number;
  logo_path:      string;
  name:           string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name:       string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1:    string;
  name:         string;
}


export function getMovieDetail(movieId:string | undefined){
  return fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=ko`).then(resp=>resp.json());
}

export interface OMDbShort {
  Title: string;
  Year: string;
  imdbID: string;
  Type: EOMDbType;
  Poster: string;
}

export enum EOMDbType {
  MOVIE = "movie",
  SERIES = "series",
}

export interface OMDbFull extends OMDbShort {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Ratings: OMDbRating[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  Response: "True";
}

export interface OMDbMovie extends OMDbFull {
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
}

export interface OMDbSerie extends OMDbFull {
  totalSeasons: string;
}

export interface OMDbError {
  Response: "False";
  Error: string;
}

export interface OMDbRating {
  Source: string;
  Value: string;
}

export interface OMDbSearchResponse {
  Search: OMDbShort[];
  totalResults: string;
  Response: "True";
}

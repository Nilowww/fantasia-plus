import axios from "axios";
import { EOMDbType, OMDbError, OMDbSearchResponse } from "~/types/movies";

export default defineEventHandler(async (event) => {
  // console.log({ api_key: process.env.NUXT_OMDB_API_KEY })
  const key = process.env.NUXT_OMDB_API_KEY;
  const query = getQuery<{
    s: string;
    page?: number;
    type?: EOMDbType;
  }>(event);

  // static async getList(search: string = "Movie", page: number = 1, type?: EOMDbType) {
  let url = `https://www.omdbapi.com/?apikey=${key}&s=${query.s}&page=${query.page}`;
  if (query.type) {
    url += `&type=${query.type}`;
  }

  const response = await axios.get<OMDbSearchResponse | OMDbError>(url);
  return response.data
  // }
});

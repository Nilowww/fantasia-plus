import axios from "axios";
import { OMDbError, OMDbMovie, OMDbSerie } from "~/types/movies";

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event) as { id: string };
  const key = process.env.NUXT_OMDB_API_KEY;

  const response = await axios.get<OMDbMovie | OMDbSerie | OMDbError>(
    `https://www.omdbapi.com/?apikey=${key}&i=${params.id}&plot=full`
  );
  return response.data;
});

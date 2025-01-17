import axios from "axios";
import type { EOMDbType, OMDbError, OMDbMovie, OMDbSearchResponse, OMDbSerie } from "~/types/movies";

export class OMDbService {
    static async get(id: string) {
        return await axios.get<OMDbMovie|OMDbSerie|OMDbError>(`https://www.omdbapi.com/?apikey=d71ccc1e&i=${id}&plot=full`)
    }
    static async getList(search: string = "Movie", type?: EOMDbType) {
        let url = `https://www.omdbapi.com/?apikey=d71ccc1e&s=${search}`
        if (type) {
            url += `&type=${type}`
        }
        return await axios.get<OMDbSearchResponse|OMDbError>(url)
    }
}
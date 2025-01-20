import axios from "axios";
import type { EOMDbType, OMDbError, OMDbMovie, OMDbSearchResponse, OMDbSerie } from "~/types/movies";

export class OMDbService {
    static async get(id: string) {
        return await axios.get<OMDbMovie|OMDbSerie|OMDbError>(`/api/omdb/${id}`)
    }
    
    static async getList(search: string = "Movie", type?: EOMDbType, page: number = 1) {
        let url = `/api/omdb/?s=${search}&page=${page}`
        if (type) {
            url += `&type=${type}`
        }
        return await axios.get<OMDbSearchResponse|OMDbError>(url)
    }
}
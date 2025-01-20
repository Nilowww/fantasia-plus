import axios from "axios";
import { EOMDbType, type OMDbError, type OMDbMovie, type OMDbSearchResponse, type OMDbSerie } from "~/types/movies";

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

    static async searchAll(search: string, page: number = 1) {
        const [moviesResponse, seriesResponse] = await Promise.all([
            this.getList(search, EOMDbType.MOVIE, page),
            this.getList(search, EOMDbType.SERIES, page)
        ]);

        const movies = moviesResponse.data.Response === 'True' ? moviesResponse.data : { Search: [], totalResults: '0' };
        const series = seriesResponse.data.Response === 'True' ? seriesResponse.data : { Search: [], totalResults: '0' };

        const combinedResults = {
            Search: [...(movies.Search || []), ...(series.Search || [])],
            totalResults: String(Number(movies.totalResults) + Number(series.totalResults)),
            Response: 'True' as const
        };

        return {
            data: combinedResults
        };
    }
}
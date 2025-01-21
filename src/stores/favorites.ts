import { defineStore } from 'pinia'
import type { OMDbMovie, OMDbSerie } from '~/types/movies'

interface FavoriteMovie {
  id: string;
  user_id: string;
  movie_data: OMDbMovie | OMDbSerie;
}

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [] as (OMDbMovie | OMDbSerie)[],
    filteredFavorites: [] as (OMDbMovie | OMDbSerie)[],
    loading: false
  }),

  actions: {
    async loadFavorites() {
      const user = useSupabaseUser();
      const supabase = useSupabaseClient<{ favorites: FavoriteMovie }>();
      
      if (!user.value) {
        this.favorites = [];
        this.filteredFavorites = [];
        return;
      }

      this.loading = true;
      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('movie_data')
          .eq('user_id', user.value.id);

        if (error) throw error;

        this.favorites = data?.map(item => item.movie_data) || [];
        this.filteredFavorites = this.favorites;
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        this.loading = false;
      }
    },

    async toggleFavorite(movie: OMDbMovie | OMDbSerie) {
      const user = useSupabaseUser();
      const supabase = useSupabaseClient<{ favorites: FavoriteMovie }>();

      if (!user.value) return;

      const isFavorite = this.favorites.some(fav => fav.imdbID === movie.imdbID);

      try {
        if (isFavorite) {
          await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.value.id)
            .eq('movie_id', movie.imdbID);

          this.favorites = this.favorites.filter(fav => fav.imdbID !== movie.imdbID);
        } else {
          await supabase
            .from('favorites')
            .insert({
              user_id: user.value.id,
              movie_id: movie.imdbID,
              movie_data: movie
            });

          this.favorites.push(movie);
        }
        this.filteredFavorites = this.favorites;
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    },

    filterFavorites(query: string) {
      if (!query.trim()) {
        this.filteredFavorites = this.favorites;
      } else {
        const searchTerm = query.toLowerCase();
        this.filteredFavorites = this.favorites.filter(movie => 
          movie.Title.toLowerCase().includes(searchTerm)
        );
      }
    }
  }
})
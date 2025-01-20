# Fantasia+ - Disney+ project

**_<p style="text-align: center;">![](https://github.com/Nilowww/fantasia-plus/blob/master/src/assets/fantasia-logo.png?raw=true)</p>_**


Fantasia+ is a demo project inspired by Disney, created as part of a technical interview. It showcases a robust front-end implementation using modern technologies and includes an online demo hosted on Netlify.


## Demo

[Online Demo]()

## Requirements
To run the project locally, you need:
- Nuxt3
- A Supabase account for backend services
- OMDB API key for movie data

[OMDBApi](https://www.omdbapi.com/apikey.aspx) - Required for films key  
[SupaBase](https://supabase.com/dashboard/sign-up) - Required for authentication

## Getting Started

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/fantasia-plus.git
   cd fantasia-plus
   ```

2. **Install Dependencies:**
   ```bash
   yarn install
   ```

3. **Setup Environment Variables:**
   Create a `.env` file in the root directory with the following:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   NUXT_OMDB_API_KEY=your_omdb_api_key
   ```

4. **Run the Development Server:**
   ```bash
   yarn run dev
   ```

5. **Build for Production:**
   ```bash
   yarn run build
   ```

## Deployment
Fantasia+ is deployed on [Netlify](https://www.netlify.com/). To deploy your own version:
1. Link your repository to a Netlify project.
2. Set the required environment variables in Netlify's dashboard.

## Testing
Run tests with:
```bash
yarn run test
```
Enjoy exploring Fantasia+! For any questions or feedback, feel free to contact me.


## Project Features
- **Framework:** NuxtJS for a powerful Vue.js framework
- **Styling:** Vuetify for a modern Material Design interface
- **Development Tools:** Vite Plugin Vuetify for enhanced development
- **Backend:** Supabase for real-time data and authentication
- **State Management:** Pinia for managing application state
- **Utility Library:** Lodash for data manipulation and utility functions
- **Testing:** Vitest for unit and integration testing

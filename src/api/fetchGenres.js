import axios from 'axios';

const API_KEY = '91a44eb93a051d3f21e3d4bf02a1b30f'; // Replace with your TMDb API key
const TMDB_GENRES_URL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=en-US`;

export const fetchGenres = async () => {
    try {
        const response = await axios.get(TMDB_GENRES_URL);
        const genres = response.data.genres;

        // Capitalize the first letter of both value and name
        const formattedGenres = genres.map(genre => ({
            value: genre.name.charAt(0).toUpperCase() + genre.name.slice(1),
            name: genre.name.charAt(0).toUpperCase() + genre.name.slice(1)
        }));
   
        return formattedGenres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        return [];
    }
};


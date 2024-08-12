import './featured.scss'
import PlayArrow from '@mui/icons-material/PlayArrow';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import { useEffect, useState } from 'react';
import axios from 'axios';

const Featured = ({ type, setGenre }) => {

    const slidesData = [
        { image: 'https://4kwallpapers.com/images/wallpapers/kalki-2898-ad-2024-2560x1440-17165.jpg', infoImage: 'https://res.cloudinary.com/stayease/image/upload/v1723108295/klazsudev0rcrjzpedg0.png', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure quaerat illum amet eveniet ab unde facere alias nesciunt eligendi quae! Aliquid praesentium delectus, facere architecto ducimus incidunt non quasi est.' },
        { image: 'https://images.indianexpress.com/2024/02/Premalu-movie-review-09022024.jpg', infoImage: 'https://img10.hotstar.com/image/upload/f_auto,h_156/sources/r1/cms/prod/8256/1712839838256-t', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure quaerat illum amet eveniet ab unde facere alias nesciunt eligendi quae! Aliquid praesentium delectus, facere architecto ducimus incidunt non quasi est.' },
        { image: 'https://media5.bollywoodhungama.in/wp-content/uploads/2017/09/War-11.jpg', infoImage: 'https://res.cloudinary.com/stayease/image/upload/v1723108295/klazsudev0rcrjzpedg0.png', description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure quaerat illum amet eveniet ab unde facere alias nesciunt eligendi quae! Aliquid praesentium delectus, facere architecto ducimus incidunt non quasi est.' },
        // Add more slides data here
    ];

    const [content, setContent] = useState([])
    const [selectedGenre, setSelectedGenre] = useState('');

    // Handler for select change
    const handleGenreChange = (event) => {
        const newGenre = event.target.value;
        setSelectedGenre(newGenre); // Update local state (optional)
        setGenre(newGenre); // Call the prop function to update genre
    };

    useEffect(() => {
        const getRandomContent = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}movies/random?type=${type}`, {
                    headers: {
                        token: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YTc4MWIzNjQ3YzEzNjYyNzVjNjkwOCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcyMzI4MTQzOSwiZXhwIjoxNzIzNzEzNDM5fQ.GcSudNwYKYaaVtTdvHvXvuTqCUQzlMYz5MNZXTHNVM4",
                    }
                })
                console.log(response.data)
                setContent(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        getRandomContent()
    }, [type])
    return (
        <div className='featured'>
            {type && (
                <div className="category">
                    <span>{type == 'movie' ? 'Movies' : 'Series'}</span>
                    <select name="genre" id="genre" value={selectedGenre} onChange={handleGenreChange}>
                    <option>Genre</option>
                        <option value="adventure">Adventure</option>
                        <option value="comedy">Comedy</option>
                        <option value="crime">Crime</option>
                        <option value="fantasy">Fantasy</option>
                        <option value="historical">Historical</option>
                        <option value="horror">Horror</option>
                        <option value="romance">Romance</option>
                        <option value="sci-fi">Sci-fi</option>
                        <option value="thriller">Thriller</option>
                        <option value="western">Western</option>
                        <option value="animation">Animation</option>
                        <option value="drama">Drama</option>
                        <option value="documentary">Documentary</option>
                    </select>
                </div>
            )}

            <Slide
                autoplay
                transitionDuration={2000}
                duration={3000}
                easing='ease'>
                {slidesData.map((slide, index) => (
                    <div className="slide" key={index}>
                        <img src={slide.image} alt="Featured" />
                        <div className="info">
                            <img src={slide.infoImage} alt="Info" />
                            <span className="desc">{slide.description}</span>
                            <div className="buttons">
                                <button className="play">
                                    <PlayArrow />
                                    <span>Play</span>
                                </button>
                                <button className="more">
                                    <InfoOutlined />
                                    <span>Info</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </Slide>


        </div>
    )
}

export default Featured

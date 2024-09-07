import './featured.scss';
import PlayArrow from '@mui/icons-material/PlayArrow';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../api/axiosInstance';
import { fetchGenres } from '../../api/fetchGenres';
import { Link } from 'react-router-dom';

const Featured = ({ type, setGenre }) => {
  const slidesData = [
    { img: 'https://4kwallpapers.com/images/wallpapers/kalki-2898-ad-2024-2560x1440-17165.jpg', imgTitle: 'https://res.cloudinary.com/stayease/image/upload/v1723108295/klazsudev0rcrjzpedg0.png', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure quaerat illum amet eveniet ab unde facere alias nesciunt eligendi quae! Aliquid praesentium delectus, facere architecto ducimus incidunt non quasi est.' },
    { img: 'https://images.indianexpress.com/2024/02/Premalu-movie-review-09022024.jpg', imgTitle: 'https://img10.hotstar.com/image/upload/f_auto,h_156/sources/r1/cms/prod/8256/1712839838256-t', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure quaerat illum amet eveniet ab unde facere alias nesciunt eligendi quae! Aliquid praesentium delectus, facere architecto ducimus incidunt non quasi est.' },
    { img: 'https://media5.bollywoodhungama.in/wp-content/uploads/2017/09/War-11.jpg', imgTitle: 'https://res.cloudinary.com/stayease/image/upload/v1723108295/klazsudev0rcrjzpedg0.png', desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure quaerat illum amet eveniet ab unde facere alias nesciunt eligendi quae! Aliquid praesentium delectus, facere architecto ducimus incidunt non quasi est.' },
    // Add more slides data here
  ];

  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadGenres = async () => {
      const fetchedGenres = await fetchGenres();
      setGenres(fetchedGenres)
    };
    loadGenres();
  }, []);

  const [content, setContent] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  // Handler for select change
  const handleGenreChange = (event) => {
    const newGenre = event.target.value;
    console.log('Selected genre:', newGenre);
    setSelectedGenre(newGenre); // Update local state (optional)
    setGenre(newGenre); // Call the prop function to update genre
  };

  useEffect(() => {
    const getRandomContent = async () => {
      try {
        const response = await axiosInstance.get(`movies/random?type=${type}`);
        console.log('Fetched content:', response.data);
        setContent(response.data);
      } catch (error) {
        console.log('Error fetching content:', error);
      }
    };

    getRandomContent();
  }, [type]);

  return (
    <div className='featured'>
      {type && (
        <div className="category">
          <span>{type === 'movie' ? 'Movies' : 'Series'}</span>
          <select name="genre" id="genre" value={selectedGenre} onChange={handleGenreChange}>
            <option>Genre</option>
            {genres.map((item) => (
              <option value={item.value} key={item.value}>{item.name}</option>

            ))}
          </select>
        </div>
      )}

      <Slide
        autoplay
        transitionDuration={2000}
        duration={3000}
        easing='ease'>
        {content.map((slide, index) => (
          <div className="slide" key={index}>
            <img src={slide.img} alt="Featured" />
            <div className="info">
              <img src={slide.imgTitle} alt="Info" />
              <span className="desc">{slide.desc}</span>
              <div className="buttons">
                <Link to="/watch" state={{ movie: slide }} className='link'>
                  <button className="play">
                    <PlayArrow className='icon' />
                    <span>Play</span>
                  </button>
                </Link>
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
  );
};

export default Featured;

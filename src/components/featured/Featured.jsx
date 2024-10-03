import './featured.scss';
import PlayArrow from '@mui/icons-material/PlayArrow';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { fetchGenres } from '../../api/fetchGenres';
import { Link } from 'react-router-dom';
import Spinner from '../spinner/Spinner'
const Featured = ({ type, setGenre }) => {
  const [genres, setGenres] = useState([]);
  const [content, setContent] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const fetchedGenres = await fetchGenres();
        setGenres(fetchedGenres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };
    loadGenres();
  }, []);

  useEffect(() => {
    const getRandomContent = async () => {
      try {
        const response = await axiosInstance.get(`movies/random?type=${type}`);
        setContent(response.data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching content:', error);
        setLoading(false); // Set loading to false even if there's an error
      }
    };

    getRandomContent();
  }, [type]);

  // Handler for select change
  const handleGenreChange = (event) => {
    const newGenre = event.target.value;
    console.log('Selected genre:', newGenre);
    setSelectedGenre(newGenre); // Update local state (optional)
    setGenre(newGenre); // Call the prop function to update genre
  };

  return (
    <div className='featured'>
      {type && (
        <div className="category">
          <span>{type === 'movie' ? 'Movies' : 'Series'}</span>
          <select name="genre" id="genre" value={selectedGenre} onChange={handleGenreChange}>
            <option value="">Genre</option>
            {genres.map((item) => (
              <option value={item.value} key={item.value}>{item.name}</option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <Spinner />
      ) : (
        <Slide autoplay transitionDuration={2000} duration={3000} easing='ease'>
          {content.map((slide, index) => (
            <div className="slide" key={index}>
              <img src={slide.img} alt="Featured" />
              <div className="info">
                <img src={slide.imgTitle} alt="Info" />
                <span className="desc">{slide.desc}</span>
                <div className="buttons">
                  <Link to={`/watch/${slide._id}`} className="link">
                    <button className="play">
                      <PlayArrow className='icon' />
                      <span>Play</span>
                    </button>
                  </Link>
                  <Link to={`/info/${slide._id}`} className="link">
                    <button className="more">
                      <InfoOutlined />
                      <span>Info</span>
                    </button>
                  </Link>

                </div>
              </div>
            </div>
          ))}
        </Slide>
      )}
    </div>
  );
};

export default Featured;

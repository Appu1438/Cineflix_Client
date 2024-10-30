import './featured.scss';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { fetchGenres } from '../../api/fetchGenres';
import { Link } from 'react-router-dom';
import Spinner from '../spinner/Spinner';

const Featured = ({ type, setGenre }) => {
  const [genres, setGenres] = useState([]);
  const [content, setContent] = useState([]);
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching content:', error);
        setLoading(false);
      }
    };
    getRandomContent();
  }, [type]);

  return (
    <div className="featured">
      {loading ? (
        <Spinner />
      ) : (
        <Slide
          autoplay
          transitionDuration={2000}
          duration={3000}
          easing='ease'
        >          {content?.map((slide, index) => (
          <div className="hero" key={index}>
            <img src={slide.img} alt="" className="banner-img" />
            <div className="hero-caption">
              <img src={slide.imgTitle} alt="" className="caption-img" />
              <div className="hero-btns">
                <Link to={`/watch/${slide._id}`} className="btn link">
                  <PlayArrowIcon />
                  Play
                </Link>
                <Link to={`/info/${slide._id}`} className="btn dark-btn link">
                  <InfoOutlinedIcon />
                  More Info
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

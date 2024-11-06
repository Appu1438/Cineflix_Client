import './featured.scss';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { fetchGenres } from '../../api/fetchGenres';
import { Link } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const Featured = ({ type, setGenre }) => {
  const [genres, setGenres] = useState([]);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  const sliderSettings = {
    dots: false, // Disable dots if you don't need them
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false // Hide arrows
  };

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
        const validContent = response.data.filter(item => item && item.img && item.imgTitle);
        const limitedContent = validContent.slice(0, 5);
        setContent(limitedContent);
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
        <Slider {...sliderSettings}>
          {content.map((slide, index) => (
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
        </Slider>
      )}
    </div>
  );
};

export default Featured;

import './listItem.scss'
import PlayArrow from '@mui/icons-material/PlayArrow';
import Add from '@mui/icons-material/Add';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlined from '@mui/icons-material/ThumbDownOutlined';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function ListItem({ index, item }) {
    const [isHovered, setIsHovered] = useState(false);
    const [movie, setMovie] = useState({});
    const [hoverTop, setHoverTop] = useState(0);
    const hoverRef = useRef();

    useEffect(() => {
        if (isHovered && hoverRef.current) {
            const hoverHeight = hoverRef.current.offsetHeight;
            const newTop = -hoverHeight; // Adjust hoverTop based on content height
            setHoverTop(newTop);
        }
    }, [isHovered]);

    useEffect(() => {
        const getMovie = async () => {
            try {
                const response = await axiosInstance.get(`movies/find/${item}`);
                setMovie(response.data);
                console.log(response.data);
                
            } catch (error) {
                console.error(error);
            }
        };
        getMovie();
    }, [item]);

    return (
        <div
            className='listItem'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            // ref={hoverRef}
            // style={{ top: isHovered ? `${hoverTop}px` : '0px' }}

        >
            <img src={movie.imgsm} alt={movie.title} />

            {isHovered && (
                <>
                <video src={movie.trailer} autoPlay loop controls />
                    <div className="itemInfo">
                        <div className="icons">
                            <Link to="/watch" state={{ movie }} className='link'>
                                <PlayArrow className='icon' />
                            </Link>
                            <Add className='icon' />
                            <ThumbUpAltOutlined className='icon' />
                            <ThumbDownOutlined className='icon' />
                        </div>
                        <div className="itemInfoTop">
                            <span>{movie.duration}</span>
                            <span className='limit'>+{movie.limit}</span>
                            <span>{movie.year}</span>
                        </div>
                        <div className="title">{movie.title}</div>
                        <div className="desc">{movie.desc}</div>
                        <div className="genre">
                            {Array.isArray(movie?.genre) ? movie.genre.join(', ') : movie?.genre}
                        </div>
                    </div>
            </>
            )}
        </div>
    );
}

import './listItem.scss'
import PlayArrow from '@mui/icons-material/PlayArrow';
import Add from '@mui/icons-material/Add';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlined from '@mui/icons-material/ThumbDownOutlined';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
export default function ListItem({ index, item, scrolled }) {
    const [isHovered, setIsHovered] = useState(false);
    const [movie, setMovie] = useState({});
    const [hoverLeft, setHoverLeft] = useState(0);
    const hoverRef = useRef();

    useEffect(() => {
        if (isHovered && hoverRef.current) {
            const itemRect = hoverRef.current.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const hoverWidth = 360; // Width after hover
            const remainingSpace = windowWidth - itemRect.right;

            // If there's not enough space on the right, adjust to fit within the window
            if (remainingSpace < hoverWidth - itemRect.width) {
                setHoverLeft(-(hoverWidth - itemRect.width));
            } else {
                setHoverLeft(0);
            }
        }
    }, [isHovered]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        const getMovie = async () => {
            try {
                const response = await axiosInstance.get(`movies/find/${item}`, { signal });
                item === response.data._id && setMovie(response.data);
            } catch (error) {
                if (error.name === 'CanceledError') {
                    console.log('Request canceled', error.message);
                } else {
                    console.error(error);
                }
            }
        };

        getMovie();
        return () => {
            controller.abort();
        }
    }, [item]);


    return (
        <div
            className='listItem'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            ref={hoverRef}
        // style={{ left: isHovered ? `${hoverLeft}px` : '0px' }}
        >
            <img src={movie.imgsm} alt={movie.title} />

            {isHovered && !scrolled && (
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

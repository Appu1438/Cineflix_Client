import './listItem.scss'

import PlayArrow from '@mui/icons-material/PlayArrow';
import Add from '@mui/icons-material/Add';
import ThumbUpAltOutlined from '@mui/icons-material/ThumbUpAltOutlined';
import ThumbDownOutlined from '@mui/icons-material/ThumbDownOutlined';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';


export default function ListItem({ index, item }) {

    const [isHovered, setIsHovered] = useState(false)
    const [movie, setMovie] = useState('')

    useEffect(() => {
        const getMovie = async () => {
            try {
                const response = await axiosInstance.get(`movies/find/${item}`)
                setMovie(response.data)
                console.log(response.data);
                
            } catch (error) {
                console.log(error)
            }
        }

        getMovie()
    }, [item])

    return (
        <div className='listItem'
            style={{ left: isHovered && index * 225 - 50 + index * 2.5 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <img
                src={movie.imgsm}
                alt=""
            />
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
                        <div className="desc">
                            {movie.desc}
                        </div>
                        <div className="genre">{movie.genre}</div>
                    </div>
                </>
            )}

        </div>

    )
}

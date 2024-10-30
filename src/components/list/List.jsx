
import './list.scss';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const List = ({ list }) => {
    const listRef = useRef();
    const [movies, setMovies] = useState([]);
    const cardsRef = useRef();

    const handleScrollLeft = () => {
        cardsRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    };

    const handleScrollRight = () => {
        cardsRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    };

    const handleWheel = (event) => {
        event.preventDefault();
        cardsRef.current.scrollLeft += event.deltaY;
    };

    // Fetch movie data for each item in the list
    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const getMovies = async () => {
            try {
                const moviePromises = list.content.map(async (item) => {
                    const response = await axiosInstance.get(`movies/find/${item.movieId ? item.movieId : item}`, { signal });
                    return response.data;
                });

                const movieData = await Promise.all(moviePromises);
                setMovies(movieData);
            } catch (error) {
                if (error.name === 'CanceledError') {
                    console.log('Request canceled', error.message);
                } else {
                    console.error(error);
                }
            }
        };

        getMovies();
        if (cardsRef.current) {
            cardsRef.current.addEventListener("wheel", handleWheel);
        }

        return () => {
            controller.abort();
            if (cardsRef.current) {
                cardsRef.current.removeEventListener("wheel", handleWheel);
            }
        };
    }, [list]);

    return (
        <div className="title-cards">
            <h2>{list?.title || "Popular on Cineflix"}</h2>
            <div className="card-container">
                <button className="scroll-btn left" onClick={handleScrollLeft}>{"<"}</button>
                <div className="card-list" ref={cardsRef}>
                    {movies.map((movie, index) => (
                        <Link to={`/info/${movie._id}`} className="card" key={index}>
                            <img src={movie?.imgsm} alt={movie?.title} />
                            <p>{movie?.title}</p>
                        </Link>
                    ))}
                </div>
                <button className="scroll-btn right" onClick={handleScrollRight}>{">"}</button>
            </div>
        </div>
    );
};

export default List;

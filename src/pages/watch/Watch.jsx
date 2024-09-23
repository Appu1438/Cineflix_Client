import { Link, useLocation } from 'react-router-dom';
import './watch.scss'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';
import { useContext, useEffect } from 'react';
import { HistoryContext } from '../../context/historyContext/HistoryContext';
import { AuthContext } from '../../context/authContext/AuthContext';
import { add_User_History } from '../../context/historyContext/apiCalls';

export default function Watch() {
    const location = useLocation()
    const movie = location.state.movie
    const { user } = useContext(AuthContext)
    const { dispatch } = useContext(HistoryContext)
    useEffect(() => {
        add_User_History({ userId: user._id, movieId: movie._id }, dispatch)
    }, [dispatch])
    return (
        <div className='watch'>
            <Link to='/'>
                <div className="back">
                    <ArrowBackOutlined />
                    Home
                </div>
            </Link>
            <video
                className='video'
                src={movie.video}
                autoPlay
                controls
                preload="metadata"  // Important to prevent full upfront download
                playsInline
            />
        </div>
    )
}

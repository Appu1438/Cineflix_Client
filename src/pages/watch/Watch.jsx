import { Link, useLocation } from 'react-router-dom';
import './watch.scss'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';

export default function Watch() {
    const location = useLocation()
    const movie = location.state.movie
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
                src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                autoPlay
                controls
                progress />
        </div>
    )
}

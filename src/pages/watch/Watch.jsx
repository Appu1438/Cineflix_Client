import './watch.scss'
import ArrowBackOutlined from '@mui/icons-material/ArrowBackOutlined';

export default function Watch() {
    return (
        <div className='watch'>
            <div className="back">
                <ArrowBackOutlined />
                Home
            </div>
            <video
                className='video'
                src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                autoPlay
                controls
                progress />
        </div>
    )
}

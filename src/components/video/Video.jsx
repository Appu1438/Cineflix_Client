import React, { useEffect, useRef, useState } from 'react';
import './video.scss';
import { STREAM_URL } from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import { Forward10, Replay10, PlayArrow, Pause } from '@mui/icons-material';

const VideoPlayer = ({ videoUrl, subtitleUrl, watchedPortion, setWatchedPortion }) => {
    const videoRef = useRef(null);
    const subtitleRef = useRef(null);
    const overlayRef = useRef(null);
    const progressBarRef = useRef(null);
    const offscreenVideoRef = useRef(null);
    const CustomControlRef = useRef(null)

    console.log(watchedPortion)
    const [currentQuality, setCurrentQuality] = useState('720p');
    const [showQualityOptions, setShowQualityOptions] = useState(false);
    const [hoveredTime, setHoveredTime] = useState(null);
    const [previewThumbnail, setPreviewThumbnail] = useState(null);
    const [thumbnailVisible, setThumbnailVisible] = useState(false);
    const [progress, setProgress] = useState(0); // Track video progress
    const [bufferedProgress, setBufferedProgress] = useState(0); // Track buffered progress
    const [lastTap, setLastTap] = useState(0); // To detect double-tap
    const [showSkipAnimation, setShowSkipAnimation] = useState(false);
    const [skipMessage, setSkipMessage] = useState('');
    const [isPaused, setIsPaused] = useState(true);


    useEffect(() => {
        const fetchSubtitle = async () => {
            try {
                if (subtitleUrl) {
                    const SubtitleResponse = await fetch(subtitleUrl);
                    const SubtitleBlob = await SubtitleResponse.blob();
                    const SubtitleBloburl = URL.createObjectURL(SubtitleBlob);
                    if (subtitleRef.current) {
                        subtitleRef.current.src = SubtitleBloburl;
                    }
                }
            } catch (error) {
                console.error('Error fetching subtitle:', error);
            }
        };

        fetchSubtitle();
    }, [subtitleUrl]);

    const handleClickOutside = (event) => {
        if (overlayRef.current && !overlayRef.current.contains(event.target)) {
            setShowQualityOptions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleQualityChange = (newQuality) => {
        const currentTime = videoRef.current.currentTime;
        setCurrentQuality(newQuality);

        setTimeout(() => {
            videoRef.current.src = `${STREAM_URL}?filename=${videoUrl}&quality=${newQuality}`;
            videoRef.current.currentTime = currentTime;
            videoRef.current.play();
        }, 100);
    };

    const handleMouseMoveOnProgressBar = (e) => {
        const progressBar = e.currentTarget;
        const boundingRect = progressBar.getBoundingClientRect();
        const hoverPosition = e.clientX - boundingRect.left; // Mouse position relative to the progress bar
        const progressBarWidth = progressBar.offsetWidth;
        const duration = videoRef.current.duration;

        if (duration && hoverPosition >= 0 && hoverPosition <= progressBarWidth) {
            const hoverTime = (hoverPosition / progressBarWidth) * duration;
            setHoveredTime(hoverTime);
            captureThumbnail(hoverTime);
            setThumbnailVisible(true); // Show the thumbnail
        }
    };

    const captureThumbnail = (time) => {
        const offscreenVideo = offscreenVideoRef.current;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = offscreenVideo.videoWidth / 4;
        canvas.height = offscreenVideo.videoHeight / 4;

        const seekToTime = async () => {
            offscreenVideo.currentTime = time;

            return new Promise((resolve) => {
                const captureFrame = () => {
                    context.drawImage(offscreenVideo, 0, 0, canvas.width, canvas.height);
                    const thumbnailUrl = canvas.toDataURL('image/jpeg');
                    setPreviewThumbnail(thumbnailUrl);
                    offscreenVideo.removeEventListener('seeked', captureFrame);
                    resolve();
                };

                offscreenVideo.addEventListener('seeked', captureFrame, { once: true });
            });
        };

        if (offscreenVideo.readyState >= 2) {
            seekToTime();
        } else {
            offscreenVideo.addEventListener('loadeddata', () => seekToTime(), { once: true });
        }
    };

    const handleProgressBarClick = (e) => {
        const progressBar = e.currentTarget;
        const boundingRect = progressBar.getBoundingClientRect();
        const clickPosition = e.clientX - boundingRect.left; // Mouse position relative to the progress bar
        const progressBarWidth = progressBar.offsetWidth;
        const duration = videoRef.current.duration;

        if (duration) {
            const clickTime = (clickPosition / progressBarWidth) * duration;
            videoRef.current.currentTime = clickTime; // Seek to the clicked time
            if (setWatchedPortion) {
                setWatchedPortion((clickTime / duration) * 100); // Update watched position
            }
        }
    };

    const handleMouseLeave = () => {
        setThumbnailVisible(false); // Hide the thumbnail when the mouse leaves
    };

    const showProgressBar = () => {
        progressBarRef.current.style.opacity = '1';
    };

    const hideProgressBar = () => {
        // Assuming you have a reference to your video element
        const videoElement = videoRef.current; // Replace with your actual video reference

        // Check if the video is not paused
        if (!videoElement.paused) {
            // Hide the progress bar
            progressBarRef.current.style.opacity = '0';
        }
    };
    const showCustomControls = () => {
        CustomControlRef.current.style.opacity = '1'
    };

    const hideCustomControls = () => {
        // Assuming you have a reference to your video element
        const videoElement = videoRef.current; // Replace with your actual video reference

        // Check if the video is not paused
        if (!videoElement.paused) {
            // Hide the progress bar
            CustomControlRef.current.style.opacity = '0'
        }
    };


    const updateProgress = () => {
        const duration = videoRef.current.duration;
        const currentTime = videoRef.current.currentTime;
        setProgress((currentTime / duration) * 100);
        if (setWatchedPortion) {
            setWatchedPortion((currentTime / duration) * 100); // Update watched position
        }
    };

    const updateBufferedProgress = () => {
        const video = videoRef.current;
        if (video && video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            const duration = video.duration;
            if (duration > 0) {
                setBufferedProgress((bufferedEnd / duration) * 100);
            }
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.addEventListener('timeupdate', updateProgress);
            video.addEventListener('progress', updateBufferedProgress);
            return () => {
                video.removeEventListener('timeupdate', updateProgress);
                video.removeEventListener('progress', updateBufferedProgress);
            };
        }
    }, []);

    const handleDoubleTap = (direction) => {
        const video = videoRef.current;
        const skipAmount = 10
        const isPaused = video.paused

        if (direction === 'forward') {
            video.currentTime = Math.min(video.currentTime + 10, video.duration);
            setSkipMessage(`+${skipAmount} sec`);

        } else if (direction === 'backward') {
            video.currentTime = Math.max(video.currentTime - 10, 0);
            setSkipMessage(`-${skipAmount} sec`);
        }


        // Show animation
        setShowSkipAnimation(true);
        setTimeout(() => setShowSkipAnimation(false), 800); // Hide after 0.8 seconds
    };

    const handleTap = (e, direction) => {
        const currentTime = new Date().getTime();
        const tapGap = currentTime - lastTap;

        if (tapGap < 300 && tapGap > 0) {
            // Double-tap detected
            handleDoubleTap(direction);
        } 
        setLastTap(currentTime);
    };

    const togglePlayPause = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            setIsPaused(false)

        } else {
            video.pause();
            setIsPaused(true)
        }
    };



    useEffect(() => {
        const video = videoRef.current;

        // Set the watched position when video metadata is loaded
        const handleLoadedMetadata = () => {
            if (watchedPortion) {
                video.currentTime = (watchedPortion / 100) * video.duration; // Convert watched portion percentage to seconds
            }
        };

        if (video) {
            video.addEventListener('loadedmetadata', handleLoadedMetadata);
            video.addEventListener('timeupdate', updateProgress);
            video.addEventListener('progress', updateBufferedProgress);
            return () => {
                video.removeEventListener('loadedmetadata', handleLoadedMetadata);
                video.removeEventListener('timeupdate', updateProgress);
                video.removeEventListener('progress', updateBufferedProgress);
            };
        }
    }, [watchedPortion]); // Add watchedPortion as a dependency


    return (
        <div
            className="videoPlayerContainer"
            onMouseEnter={showProgressBar}
            onMouseLeave={hideProgressBar}
        >
            <div className="videoTapArea left" onClick={(e) => handleTap(e, 'backward')} />

            <video
                ref={videoRef}
                src={`${STREAM_URL}?filename=${videoUrl}&quality=${currentQuality}`}
                controls
                className="trailerVideo"
                preload="metadata"
                crossOrigin="anonymous"
                onPause={() => {
                    setIsPaused(true)
                    showProgressBar()
                }}
                onPlay={() => setIsPaused(false)}
                onMouseEnter={showCustomControls}
                onMouseLeave={hideCustomControls}
            >
                <track ref={subtitleRef} kind="subtitles" />

            </video>

            <div className="videoTapArea right" onClick={(e) => handleTap(e, 'forward')} />

            <div className="customControls" ref={CustomControlRef} onMouseEnter={showCustomControls} onMouseLeave={hideCustomControls}>
                <button className="skipLeftButton" onClick={() => handleDoubleTap('backward')}>
                    <Replay10 className='customIcons' style={{ fontSize: '50px' }} />
                </button>
                <button className="pauseButton" onClick={togglePlayPause}>
                    {isPaused ? (
                        <PlayArrow className='customIcons' style={{ fontSize: '50px' }} />
                    ) : (
                        <Pause className='customIcons' style={{ fontSize: '50px' }} />
                    )}
                </button>
                <button className="skipRightButton" onClick={() => handleDoubleTap('forward')}>
                    <Forward10 className='customIcons' style={{ fontSize: '50px' }} />
                </button>
            </div>


            {showSkipAnimation && (
                <motion.div
                    className="skipAnimation"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.2 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                    {skipMessage}
                </motion.div>
            )}
            <video
                ref={offscreenVideoRef}
                src={`${STREAM_URL}?filename=${videoUrl}&quality=${currentQuality}`}
                preload="metadata"
                style={{ display: 'none' }}
                crossOrigin="anonymous"
            />

            <div className="settingsIcon" onClick={() => setShowQualityOptions(!showQualityOptions)}>
                ⚙️
            </div>

            {showQualityOptions && (
                <div className="qualityOverlay" ref={overlayRef}>
                    <label htmlFor="quality" className="qualityLabel">Choose quality:</label>
                    <select
                        id="quality"
                        value={currentQuality}
                        onChange={(e) => handleQualityChange(e.target.value)}
                    >
                        <option value="360p">360P</option>
                        <option value="480p">480P</option>
                        <option value="720p">720P</option>
                        <option value="1080p">1080P</option>
                    </select>
                </div>
            )}

            <div
                className="customProgressBar"
                onMouseMove={handleMouseMoveOnProgressBar}
                onMouseLeave={handleMouseLeave}
                ref={progressBarRef}
                onClick={handleProgressBarClick}
            >
                <div className="buffered" style={{ width: `${bufferedProgress}%` }} />
                <div className="progress" style={{ width: `${progress}%` }} />

                <div
                    className="progressCircle"
                    style={{ left: `calc(${progress}% - 10px)` }}
                />
            </div>

            {thumbnailVisible && hoveredTime && previewThumbnail && (
                <div
                    className="previewThumbnail"
                    style={{
                        left: `${(hoveredTime / videoRef.current.duration) * 100}%`,
                    }}
                >
                    <img src={previewThumbnail} alt="Preview" />
                    <span>{new Date(hoveredTime * 1000).toISOString().substr(11, 8)}</span>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;

import React, { useEffect, useRef, useState } from 'react';
import './video.scss';
import { STREAM_URL } from '../../api';

const VideoPlayer = ({ videoUrl, subtitleUrl }) => {
    const videoRef = useRef(null);
    const subtitleRef = useRef(null);
    const overlayRef = useRef(null);
    const progressBarRef = useRef(null);
    const offscreenVideoRef = useRef(null);

    const [currentQuality, setCurrentQuality] = useState('720p');
    const [showQualityOptions, setShowQualityOptions] = useState(false);
    const [hoveredTime, setHoveredTime] = useState(null);
    const [previewThumbnail, setPreviewThumbnail] = useState(null);
    const [thumbnailVisible, setThumbnailVisible] = useState(false);
    const [progress, setProgress] = useState(0); // Track video progress
    const [bufferedProgress, setBufferedProgress] = useState(0); // Track buffered progress

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
        }
    };

    const handleMouseLeave = () => {
        setThumbnailVisible(false); // Hide the thumbnail when the mouse leaves
    };

    const showProgressBar = () => {
        progressBarRef.current.style.opacity = '1';
    };

    const hideProgressBar = () => {
        progressBarRef.current.style.opacity = '0';
    };

    const updateProgress = () => {
        const duration = videoRef.current.duration;
        const currentTime = videoRef.current.currentTime;
        setProgress((currentTime / duration) * 100);
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

    return (
        <div
            className="videoPlayerContainer"
            onMouseEnter={showProgressBar}
            onMouseLeave={hideProgressBar}
        >
            <video
                ref={videoRef}
                src={`${STREAM_URL}?filename=${videoUrl}&quality=${currentQuality}`}
                controls
                className="trailerVideo"
                preload="metadata"
                crossOrigin="anonymous"
            >
                <track ref={subtitleRef} kind="subtitles" />
            </video>

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

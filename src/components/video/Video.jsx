import React, { useEffect, useRef, useState } from 'react';
import './video.scss';
import axiosInstance from '../../api/axiosInstance';
import { STREAM_URL } from '../../api';

const VideoPlayer = ({ videoUrl, subtitleUrl }) => {
    const videoRef = useRef(null);
    const subtitleRef = useRef(null);
    const [currentQuality, setCurrentQuality] = useState('720p');
    const [showQualityOptions, setShowQualityOptions] = useState(false);
    const overlayRef = useRef(null);

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

    // Close overlay when clicking outside
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
        const currentTime = videoRef.current.currentTime; // Store current playback time
        setCurrentQuality(newQuality); // Change quality

        // Update video source after a short delay to allow time for the quality change
        setTimeout(() => {
            videoRef.current.src = `${STREAM_URL}?filename=${videoUrl}&quality=${newQuality}`;
            videoRef.current.currentTime = currentTime; // Restore the previous playback position
            videoRef.current.play(); // Play the video again
        }, 100); // Delay can be adjusted if needed
    };

    return (
        <div className="videoPlayerContainer">
            <video
                ref={videoRef}
                src={`${STREAM_URL}?filename=${videoUrl}&quality=${currentQuality}`}
                controls
                className='trailerVideo'
                preload='metadata'
            >
                <track ref={subtitleRef} kind="subtitles" />
            </video>

            <div className="settingsIcon" onClick={() => setShowQualityOptions(!showQualityOptions)}>
                ⚙️
            </div>

            {showQualityOptions && (
                <div className="qualityOverlay" ref={overlayRef}>
                    <label htmlFor="quality" className="qualityLabel">Choose quality:</label>
                    <select
                        id="quality"
                        value={currentQuality}
                        onChange={(e) => handleQualityChange(e.target.value)} // Use the new function to handle quality change
                    >
                        <option value='360p'>360P</option>
                        <option value='480p'>480P</option>
                        <option value='720p'>720P</option>
                        <option value='1080p'>1080P</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;

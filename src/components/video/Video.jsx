import React, { useEffect, useRef, useState } from 'react';
import './video.scss';

const VideoPlayer = ({ videoQualities, subtitleUrl }) => {
    const videoRef = useRef(null);
    const subtitleRef = useRef(null);
    const [currentQuality, setCurrentQuality] = useState(videoQualities ? videoQualities[0] : '');
    const [showQualityOptions, setShowQualityOptions] = useState(false); // State to control visibility of quality options
    const overlayRef = useRef(null); // Ref for the overlay

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

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.src = currentQuality.url;
            videoRef.current.load();
        }
    }, [currentQuality]);

    // Close overlay when clicking outside
    const handleClickOutside = (event) => {
        if (overlayRef.current && !overlayRef.current.contains(event.target)) {
            setShowQualityOptions(false);
        }
    };

    useEffect(() => {
        // Bind the event listener to the document
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="videoPlayerContainer">
            <video ref={videoRef} controls className='trailerVideo'>
                <track ref={subtitleRef} kind="subtitles" />
            </video>

            {/* Settings Icon positioned near speaker icon */}
            <div className="settingsIcon" onClick={() => setShowQualityOptions(!showQualityOptions)}>
                ⚙️ {/* Use any settings icon or an image here */}
            </div>

            {/* Popup for selecting quality */}
            {showQualityOptions && (
                <div className="qualityOverlay" ref={overlayRef}>
                    <label htmlFor="quality" className="qualityLabel">Choose quality:</label>
                    <select
                        id="quality"
                        value={currentQuality.url} // Change here to use the URL as the value
                        onChange={(e) => {
                            const selectedUrl = e.target.value;
                            const selectedLabel = videoQualities.find(quality => quality.url === selectedUrl)?.label;
                            setCurrentQuality({ label: selectedLabel, url: selectedUrl });
                        }}
                    >
                        {videoQualities.map((quality) => (
                            <option key={quality.label} value={quality.url}>
                                {quality.label}  {/* Display quality label, e.g., 480p, 720p */}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;

import React, { useEffect, useRef, useState } from 'react';
import './video.scss';
import axiosInstance from '../../api/axiosInstance';

const VideoPlayer = ({ videoUrl, subtitleUrl }) => {
    const videoRef = useRef(null);
    const subtitleRef = useRef(null);
    const [videoStream, setVideoStream] = useState();
    const [currentQuality, setCurrentQuality] = useState();
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
        const fetchVideoUrl = async () => {
            try {
                const response = await axiosInstance.get(`movies/stream-video`, {
                    params: {
                        filename: videoUrl // Ensure this is the correct filename
                    },
                    headers: {
                        'Range': 'bytes=0-' // Request the first 1000 bytes (for example)
                    },
                    responseType: 'blob' // Important to set the response type
                });

                // Create a URL for the video blob and play it
                const videoBlob = new Blob([response.data], { type: 'video/mp4' });
                const videoUrlBlob = URL.createObjectURL(videoBlob);


                // Ensure that the response contains the video URL
                console.log('Video Stream URL:', response);
                console.log('Blob', videoUrlBlob)
                setVideoStream(videoUrlBlob); // Set the video stream URL
            } catch (error) {
                console.error('Error fetching video URL:', error);
            }
        };

        fetchVideoUrl();
    }, [videoUrl]); // Use videoFilename as a dependency




    useEffect(() => {
        if (videoRef.current && videoStream) {
            videoRef.current.src = videoStream; // Set the video source to the stream URL
            videoRef.current.load();
        }
    }, [videoStream]); // Depend on videoStream

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

        </div>
    );
};

export default VideoPlayer;

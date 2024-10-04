import React, { useEffect, useRef } from 'react';
import './video.scss';

const VideoPlayer = ({ videoUrl, subtitleUrl }) => {
    const videoRef = useRef(null);
    const subtitleRef = useRef(null);

    useEffect(() => {
        const fetchSubtitle = async () => {
            try {
                if (subtitleUrl) {  // Check if subtitle URL exists
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

        fetchSubtitle();  // Only fetch and blob the subtitle if available

        if (videoRef.current) {
            videoRef.current.src = videoUrl;  // Use videoUrl directly
        }
    }, [videoUrl, subtitleUrl]);  // Add subtitleUrl as a dependency

    return (
        <video
            key={videoUrl}
            ref={videoRef}
            controls
            className='trailerVideo'>
            <track ref={subtitleRef} kind="subtitles" />
        </video>
    );
};

export default VideoPlayer;

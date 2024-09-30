import React from 'react';
import Star from '@mui/icons-material/Star';
import StarHalf from '@mui/icons-material/StarHalf';
import StarOutline from '@mui/icons-material/StarOutline';
import './starComponent.scss';

const StarComponent = ({ rating }) => {
    const MAX_RATING = 5;
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = MAX_RATING - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="starComponent">
            {/* Full Stars */}
            {Array(fullStars).fill().map((_, i) => (
                <Star key={`full-${i}`} className="star full" />
            ))}
            {/* Half Star */}
            {halfStar && <StarHalf className="star half" />}
            {/* Empty Stars */}
            {Array(emptyStars).fill().map((_, i) => (
                <StarOutline key={`empty-${i}`} className="star empty" />
            ))}
        </div>
    );
};

export default StarComponent;

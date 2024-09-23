
import './list.scss';
import { useRef, useState, useEffect } from 'react';
import ListItem from '../listItem/ListItem';

const List = ({ list }) => {
    const listRef = useRef();
   
    const [isScrolling, setIsScrolling] = useState(false);

    // Variable to track if scrolling has stopped
    let scrollTimeout;

    // Function to handle scroll event
    const handleScroll = () => {
        // Set scrolling to true
        setIsScrolling(true);

        // Clear the previous timeout if any
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // Set a timeout to determine when scrolling has stopped
        scrollTimeout = setTimeout(() => {
            setIsScrolling(false);
        }, 500); // Adjust the delay as needed (150ms is a common choice)
    };

    useEffect(() => {
        const container = listRef.current;

        if (container) {
            container.addEventListener('scroll', handleScroll);

            return () => {
                container.removeEventListener('scroll', handleScroll);
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
            };
        }
    }, []);
    // Enable manual horizontal scrolling
    const handleMouseDown = (e) => {
        const scrollElement = listRef.current;
        scrollElement.isDown = true;
        scrollElement.startX = e.pageX - scrollElement.offsetLeft;
        scrollElement.scrollLeft = scrollElement.scrollLeft;
    };

    const handleMouseMove = (e) => {
        const scrollElement = listRef.current;
        if (!scrollElement.isDown) return;
        e.preventDefault();
        const x = e.pageX - scrollElement.offsetLeft;
        const walk = (x - scrollElement.startX) * 2; // Adjust scrolling speed
        scrollElement.scrollLeft = scrollElement.scrollLeft - walk;
    };

    const handleMouseUp = () => {
        listRef.current.isDown = false;
    };

    const handleMouseLeave = () => {
        listRef.current.isDown = false;
    };

    return (
        <div className="list">
            <span className="listTitle">{list.title}</span>
            <div
                className="wrapper"
                ref={listRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
            >
                <div className="container">
                {list?.content?.map((item, index) => (
                        <ListItem index={index} item={item} key={index} scrolled={isScrolling} />
                  ))}
                </div>
            </div>
        </div>
    );
};

export default List;

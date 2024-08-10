import './list.scss'
import ArrowBackIosOutlined from '@mui/icons-material/ArrowBackIosOutlined';
import ArrowForwardIosOutlined from '@mui/icons-material/ArrowForwardIosOutlined';
import ListItem from '../listItem/ListItem';
import { useRef, useState } from 'react';


const List = ({ list }) => {
    const [slideNumber, setSlideNumber] = useState(0)
    const [IsMoved, setIsMoved] = useState(false)
    const listRef = useRef()

    const handleClick = (direction) => {
        setIsMoved(true)
        let distance = listRef.current.getBoundingClientRect().x - 50

        if (direction == 'left' && slideNumber > 0) {
            setSlideNumber(slideNumber - 1)
            listRef.current.style.transform = `translateX(${230 + distance}px)`
        }
        if (direction == 'right' && slideNumber < list.content.length - 8) {
            setSlideNumber(slideNumber + 1)
            listRef.current.style.transform = `translateX(${-230 + distance}px)`
        }
        console.log(distance);

    }
    return (
        <div className="list">
            <span className="listTitle">{list.title}</span>
            <div className="wrapper">
                <div onClick={() => handleClick('left')}>
                    <ArrowBackIosOutlined className="sliderArrow left"
                        style={{ display: !IsMoved && 'none' }} />
                </div>
                <div className="container" ref={listRef}>
                    {list.content.map((item, index) => (
                        <ListItem index={index} item={item} />
                    ))}
                </div>
                <div onClick={() => handleClick('right')}>
                    <ArrowForwardIosOutlined className="sliderArrow right " />
                </div>

            </div>
        </div>
    )
}

export default List

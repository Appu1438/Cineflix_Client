import './list.scss'
import ArrowBackIosOutlined from '@mui/icons-material/ArrowBackIosOutlined';
import ArrowForwardIosOutlined from '@mui/icons-material/ArrowForwardIosOutlined';
import ListItem from '../listItem/ListItem';
import { useRef, useState } from 'react';


const List = () => {
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
        if (direction == 'right' && slideNumber < 3) {
            setSlideNumber(slideNumber + 1)
            listRef.current.style.transform = `translateX(${-230 + distance}px)`
        }
        console.log(distance);

    }
    return (
        <div className="list">
            <span className="listTitle">Continue to Watch</span>
            <div className="wrapper">
                <div onClick={() => handleClick('left')}>
                    <ArrowBackIosOutlined className="sliderArrow left"
                    style={{ display: !IsMoved && 'none' }} />
                </div>
                <div className="container" ref={listRef}>
                    <ListItem index={0} />
                    <ListItem index={1}  />
                    <ListItem index={2}  />
                    <ListItem index={3}  />
                    <ListItem index={4}  />
                    <ListItem index={5}  />
                    <ListItem index={6} />
                    <ListItem index={7} />
                    <ListItem index={8} />
                    <ListItem index={9} />
                    <ListItem index={10} />
                </div>
                <div onClick={() => handleClick('right')}>
                    <ArrowForwardIosOutlined className="sliderArrow right " />
                </div>

            </div>
        </div>
    )
}

export default List

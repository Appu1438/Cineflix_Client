import './navbar.scss'
import Search from '@mui/icons-material/Search';
import Notifications from '@mui/icons-material/Notifications';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext/AuthContext';
import { logout } from '../../context/authContext/apiCalls';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const { user, dispatch } = useContext(AuthContext)

    window.onscroll = () => {
        setIsScrolled(window.pageYOffset === 0 ? false : true)
        return () => (window.onscroll = null)
    }
    const handleLogout = async () => {
        logout()
    }
    console.log(isScrolled)
    return (
        <div className={isScrolled ? "navbar scrolled" : 'navbar'}>
            <div className="container">
                <div className="left">
                    <img
                        src="/assests/images/CINEFLIX2.png"
                        alt="Cineflix" />

                    <Link to={'/'} className='link'>
                        <span>Homepage</span>
                    </Link>

                    <Link to={'/movies'} className='link'>
                        <span>Movies</span>
                    </Link>

                    <Link to={'/series'} className='link'>
                        <span>Series</span>
                    </Link>
                    <span>New and Popular</span>
                    <Link to={'/profile'} className='link'>
                    <span>My List</span>
                    </Link>
                </div>

                <div className="right">
                    <Search className='icon' />
                    <span>KID</span>
                    <Notifications className='icon' />
                    <img
                        src={user.profilePic || "https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                        alt="" />
                    <div className="profile">
                        <ArrowDropDown className='icon' />
                        <div className="options">
                            <span>Settings</span>
                            <span onClick={handleLogout}>Logout</span>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default Navbar

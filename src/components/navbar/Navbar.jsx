import './navbar.scss'
import Search from '@mui/icons-material/Search';
import Notifications from '@mui/icons-material/Notifications';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext/AuthContext';
import { logout } from '../../context/authContext/apiCalls';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false)
    const { user, dispatch } = useContext(AuthContext)

    // window.onscroll = () => {
    //     setIsScrolled(window.pageYOffset === 0 ? false : true)
    //     return () => (window.onscroll = null)
    // }

    const navRef = useRef()

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if (window.scrollY >= 50) {
                navRef.current.classList.add('nav-dark')
            } else {
                navRef.current.classList.remove('nav-dark')
            }
        })
    }, [])

    const handleLogout = async () => {
        logout()
    }
    console.log(isScrolled)
    return (
        <div ref={navRef} className='navbar'>
            <div className="navbar-left">
                <img src="/assests/images/CINEFLIX2.png" alt="" />
                <ul>
                    <Link to={'/'} className='link'>
                        <li>Homepage</li>
                    </Link>

                    <Link to={'/movies'} className='link'>
                        <li>Movies</li>
                    </Link>

                    <Link to={'/series'} className='link'>
                        <li>Series</li>
                    </Link>
                    <Link to={'/profile'} className='link'>
                        <li>My List</li>
                    </Link>
                </ul>
            </div>
            <div className="navbar-right">
                <Link to={'/search'} className='link'>
                    <Search className='icons' />
                </Link>
                {/* {user?.username} */}
                <div className="navbar-profile">
                    <img
                        src={user.profilePic || "https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                        alt="" className='profile' />
                    <div className="dropdown">
                        <Link to={'/profile'} className='link'>
                            <p>Settings</p>
                        </Link>
                        <p onClick={() => { handleLogout() }}>Sign Out</p>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Navbar

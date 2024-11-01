import './navbar.scss';
import Search from '@mui/icons-material/Search';
import Notifications from '@mui/icons-material/Notifications';
import ArrowDropDown from '@mui/icons-material/ArrowDropDown';
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Import the icon
import { useContext, useEffect, useRef, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import Close from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext/AuthContext';
import { logout } from '../../context/authContext/apiCalls';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { user, dispatch } = useContext(AuthContext);
    const [menuOpen, setMenuOpen] = useState(false);

    const navRef = useRef();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY >= 50) {
                navRef.current.classList.add('nav-dark');
            } else {
                navRef.current.classList.remove('nav-dark');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        logout();
    };

    const toggleMenu = () => {
        setMenuOpen(prev => !prev);
    };

    return (
        <div ref={navRef} className='navbar'>
            <div className="navbar-left">
                <Link to={'/'} className='link'>
                <img src="/assests/images/CINEFLIX2.png" alt="" />
                </Link>

                {/* Desktop menu */}
                <ul className="desktop-menu">
                    <Link to={'/'} className='link'><li>Homepage</li></Link>
                    <Link to={'/movies'} className='link'><li>Movies</li></Link>
                    <Link to={'/series'} className='link'><li>Series</li></Link>
                    <Link to={'/profile'} className='link'><li>My List</li></Link>
                </ul>
            </div>

            <div className="navbar-right">
                <Link to={'/search'} className='link'>
                    <Search className='icons' />
                </Link>
                <div className="navbar-profile">
                    <img
                        src={user.profilePic || "https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"}
                        alt="" className='profile' />
                    <div className="dropdown">
                        <Link to={'/profile'} className='link'><p>Settings</p></Link>
                        <p onClick={handleLogout} className='link'>Sign Out</p>
                    </div>
                </div>

                {menuOpen ? <Close onClick={toggleMenu} className="hamburger" /> :  <MenuIcon onClick={toggleMenu} className="hamburger" /> }
            </div>

            {/* Mobile menu */}
            <ul className={`mobile-menu ${menuOpen ? 'open' : ''}`}>

                <Link to={'/'} className='link'><li>Homepage</li></Link>
                <Link to={'/movies'} className='link'><li>Movies</li></Link>
                <Link to={'/series'} className='link'><li>Series</li></Link>
                <Link to={'/profile'} className='link'><li>My List</li></Link>

                <li className="user-profile">
                    <AccountCircleIcon className="profile-icon" />
                    <span>{user.username || 'Guest'}</span> {/* Display the username or fallback */}
                </li>
            </ul>

        </div>
    );
};

export default Navbar;

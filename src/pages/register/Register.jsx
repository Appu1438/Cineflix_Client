import { useRef, useState } from 'react';
import './register.scss'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axiosInstance from '../../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/auth/register', { username, email, password });
      navigate('/login');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="register">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <img
            className="logo"
            src="/assests/images/CINEFLIX2.png"
            alt="Cineflix Logo"
          />
          <h1>Register</h1>
          <p>
          Ready to watch? Enter your email to create your account
        </p>
          <input
            type="email"
            placeholder="Enter Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Your Username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="registerButton" type="submit">
            Sign In
          </button>
          <span>
            <Link to={'/login'} className='link'>
               Already have an Account? <b> Login now.</b>
            </Link>
          </span>

          <small>
            This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
            <b>Learn more</b>.
          </small>
        </form>
      </div>
    </div>
  );
}

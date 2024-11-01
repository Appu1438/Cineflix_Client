import { useContext, useState } from 'react';
import './login.scss';
import { login } from '../../context/authContext/apiCalls';
import { AuthContext } from '../../context/authContext/AuthContext';
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    login({ email, password }, dispatch);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="login">
      <div className="container">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
        <div className="container">
          <form onSubmit={handleSubmit}>
            <img
              className="logo"
              src="/assests/images/CINEFLIX2.png"
              alt="Cineflix Logo"
            />
            <h1>Sign In</h1>
            <input
              type="email"
              placeholder="Enter Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter Your Password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="eyeButton" onClick={togglePasswordVisibility}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </div>


            <button className="loginButton" type="submit">
              Sign In
            </button>

            <b className='forgot span'>Forgot password?</b>

            <span className='span'>
              <Link to={'/register'} className='link'>
                New to Cineflix? <b>Sign up now.</b>
              </Link>
            </span>

            <small>
              This page is protected by Google reCAPTCHA to ensure you're not a bot.{' '}
              <b>Learn more</b>.
            </small>
          </form>
        </div>
      </div>
    </div>
  );
}
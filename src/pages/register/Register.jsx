import { useState } from 'react';
import './register.scss';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import axiosInstance from '../../api/axiosInstance';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('auth/register', { username, email, password });
      toast.success('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Redirect after success
    } catch (error) {
      if (error.response) {
        // Handle Joi validation errors or email already exists
        if (error.response.status === 400) {
          toast.error(error.response.data.message);
        } else if (error.response.status === 500) {
          toast.error('Internal server error. Please try again later.');
        }
      } else {
        toast.error('Something went wrong. Please try again.');
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };


  return (
    <div className="register">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <img className="logo" src="/assests/images/CINEFLIX2.png" alt="Cineflix Logo" />
          <h1>Register</h1>
          <p>Enter your email to create your account</p>
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
                type={showPassword ? 'text' : 'text'}
                placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* <div className="eyeButton" onClick={togglePasswordVisibility}>
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </div> */}

          <button className="registerButton" type="submit">
            Sign In
          </button>
          <span>
            <Link to={'/login'} className="link">
              Already have an Account? <b>Login now.</b>
            </Link>
          </span>
          <small>
            This page is protected by Google reCAPTCHA to ensure you're not a bot. <b>Learn more</b>.
          </small>
        </form>
      </div>
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

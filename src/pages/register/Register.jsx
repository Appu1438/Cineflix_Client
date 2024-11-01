import { useState } from 'react';
import './register.scss';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for react-toastify
import axiosInstance from '../../api/axiosInstance';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Generate OTP
      const response = await axiosInstance.post('auth/generate-otp', { email });
      setGeneratedOtp(response.data.otp); // Save generated OTP
      setOtpSent(true);
      toast.success("OTP sent to your email.");
    } catch (error) {
      toast.error("Failed to generate OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    console.log(otp,generatedOtp)
    if (otp == generatedOtp) {
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
    } else {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="register">
      <div className="container">
        {!otpSent ? (
          <form onSubmit={handleRegister}>
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
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="registerButton" type="submit">
              Generate OTP
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
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <h1>Verify OTP</h1>
            <input
              type="text"
              placeholder="Enter the OTP sent to your email"
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button className="verifyButton" type="submit">
              Verify OTP
            </button>
            <span>
              <Link to={'/login'} className="link">
                Back to Registration? <b>Go back.</b>
              </Link>
            </span>
          </form>
        )}
      </div>
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

import { useContext, useState } from 'react';
import './login.scss';
import { login } from '../../context/authContext/apiCalls';
import { AuthContext } from '../../context/authContext/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axiosInstance from '../../api/axiosInstance';
import { loginFailure, loginStart, loginSuccess } from '../../context/authContext/AuthAction';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { dispatch } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page refresh

    if (!forgotPassword) {
        dispatch(loginStart());
        try {
            const res = await axiosInstance.post(`auth/login`, { email, password }, { withCredentials: true });
            toast.success("Login successful.");
            dispatch(loginSuccess(res.data));
        } catch (error) {
            console.error('Login error:', error);
            
            if (error.response) {
                if (error.response.status === 401) {
                    toast.error("Wrong password. Please try again.");
                } else if (error.response.status === 404) {
                    toast.error("User not found. Please check your email.");
                } else {
                    toast.error("Login failed. Please check your credentials.");
                }
            } else {
                toast.error("An unexpected error occurred. Please try again.");
            }
            dispatch(loginFailure()); // Dispatch failure action only after handling error
        }
    } else {
        if (!otpSent) {
            // Generate OTP
            try {
                const response = await axiosInstance.post('auth/generate-otp', { email });
                setGeneratedOtp(response.data.otp);
                console.log(generatedOtp);
                setOtpSent(true);
                toast.success("OTP sent to your email.");
            } catch (error) {
                toast.error("Failed to generate OTP. Please try again.");
            }
        } else {
            // Verify OTP and reset password
            console.log(otp, generatedOtp);
            if (otp == generatedOtp) {
                try {
                    await axiosInstance.post('auth/reset-password', { email, newPassword });
                    toast.success("Password reset successful. Please log in.");
                    setForgotPassword(false);
                    setOtpSent(false);
                    setNewPassword('');
                    setOtp('');
                } catch (error) {
                    toast.error("Failed to reset password. Please try again.");
                }
            } else {
                toast.error("Invalid OTP. Please try again.");
            }
        }
    }
};

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleForgotPasswordClick = () => {
    setForgotPassword((prev) => !prev);
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
            <h1>{forgotPassword ? 'Reset Password' : 'Sign In'}</h1>
            <input
              type="email"
              placeholder="Enter Your Email Address"
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {!forgotPassword && (
              <>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter Your Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div className="eyeButton" onClick={togglePasswordVisibility}>
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </div>
              </>
            )}

            {forgotPassword && otpSent && (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Enter New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </>
            )}

            <button className="loginButton" type="submit">
              {forgotPassword ? (otpSent ? 'Reset Password' : 'Send OTP') : 'Sign In'}
            </button>

            {!forgotPassword && (
              <b className="forgot span" onClick={handleForgotPasswordClick}>
                Forgot password?
              </b>
            )}

            {!forgotPassword ? (
              <span className="span">
                <Link to={'/register'} className="link">
                  New to Cineflix? <b>Sign up now.</b>
                </Link>
              </span>
            ) : (
              <span className="span" onClick={handleForgotPasswordClick}>
                Know Your Password? <b>Login now.</b>
              </span>)}

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

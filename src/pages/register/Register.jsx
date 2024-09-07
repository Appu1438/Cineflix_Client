import { useRef, useState } from 'react';
import './register.scss'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';


export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const userRef = useRef();
  const navigate = useNavigate()
  const handleStart = () => {
    setEmail(emailRef.current.value);
    emailRef.current.value = ''; // Clear email input field

  };

  const handleFinish = async (e) => {
    e.preventDefault()
    setUsername(userRef.current.value)
    setPassword(passwordRef.current.value);
    try {
      await axiosInstance.post('/auth/register', { username,email, password })
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className='register'>
      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src="/assests/images/CINEFLIX2.png"
            alt="Cineflix Logo"
          />
          <button className="loginButton">
            Sign In
          </button>
        </div>
      </div>

      <div className="container">
        <h1>Unlimited movies, TV shows, and more.</h1>
        <h2>Watch anywhere. Cancel anytime.</h2>
        <p>
          Ready to watch? Enter your email to create or restart your membership.
        </p>
        {!email ? (
          <div className="input">
            <input type="email" placeholder='Enter Your Email Address' ref={emailRef} />
            <button className="registerButton" onClick={handleStart}>
              Get Started
            </button>
          </div>

        ) : (
          <div className="input">
            <input type='text' placeholder='Enter Your Username' ref={userRef} />
            <input type={passwordVisible ? 'text' : 'password'} placeholder='Enter Your Password' ref={passwordRef} />
            <button className="togglePasswordButton" onClick={() => setPasswordVisible(prev => !prev)}>
              {passwordVisible ? <VisibilityOff /> : <Visibility />}
            </button>
            <button className="registerButton" onClick={handleFinish}>
              Start
            </button>
          </div>

        )}
      </div>
    </div>
  );
}

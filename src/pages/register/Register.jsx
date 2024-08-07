import { useRef, useState } from 'react';
import './register.scss'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';


export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleStart = () => {
    setEmail(emailRef.current.value);
    emailRef.current.value = ''; // Clear email input field

  };

  const handleFinish = () => {
    setPassword(passwordRef.current.value);
  };

  return (
    <div className='register'>
      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt="Netflix Logo"
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
          <>
            <div className="input">
              <input type="email" placeholder='Enter Your Email Address' ref={emailRef} />
              <button className="registerButton" onClick={handleStart}>
                Get Started
              </button>
            </div>

          </>
        ) : (
          <>
            <div className="input">
              <input type={passwordVisible ? 'text' : 'password'} placeholder='Enter Your Password' ref={passwordRef} />
              <button className="togglePasswordButton" onClick={() => setPasswordVisible(prev => !prev)}>
                {passwordVisible ? <VisibilityOff/> : <Visibility/>}
              </button>
              <button className="registerButton" onClick={handleFinish}>
                Start
              </button>
            </div>

          </>
        )}
      </div>
    </div>
  );
}

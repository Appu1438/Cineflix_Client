import { useContext, useRef, useState } from 'react';
import './login.scss'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { login } from '../../context/authContext/apiCalls';
import { AuthContext } from '../../context/authContext/AuthContext';


export default function Login() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { dispatch } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    login({ email, password }, dispatch)
  }
  return (
    <div className='login'>
      <div className="top">
        <div className="wrapper">
          <img
            className="logo"
            src="/assests/images/CINEFLIX2.png"
            alt="Cineflix Logo"
          />
        </div>
      </div>

      <div className="container">

        <form action="">
          <h1>Sign In</h1>
          <input type="email" placeholder='Enter Your Email Address' onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder='Enter Your Password' onChange={(e) => setPassword(e.target.value)} />
          <button className="loginButton" onClick={handleSubmit}>
            Sign In
          </button>
          <span>New to Cineflix? <b>Sign up now.</b></span>
          <small>
            This page is protected by Google reCAPTCHA to ensure that you're not a bot. <b>Learn more</b>.
          </small>

        </form>

      </div>
    </div>
  );
}

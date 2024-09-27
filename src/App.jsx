import { useContext, useEffect } from 'react';
import './app.scss'
import Home from "./pages/home/Home";
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Watch from './pages/watch/Watch';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from "./context/authContext/AuthContext";
import { ToastContainer } from 'react-toastify';
import axiosInstance from './api/axiosInstance';
import { fetchUserDetailsIfOutdated } from './context/authContext/apiCalls';
import MyList from './pages/myList/MyList';
import MovieInfo from './pages/movieInfo/MovieInfo';

function App() {
  const { user, dispatch } = useContext(AuthContext);

  useEffect(() => {
    console.log(process.env.REACT_APP_API_URL)
    fetchUserDetailsIfOutdated(dispatch);
  }, []);

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={2000} />
      <Routes>
        <Route path='/' element={user ? <Home type={null} /> : <Navigate to={'/login'} />} />
        {user ? (
          <>
            <Route path='/movies' element={<Home type={'movie'} />} />
            <Route path='/series' element={<Home type={'series'} />} />
            <Route path='/watch' element={<Watch />} />
            <Route path='/info' element={<MovieInfo />} />
            <Route path='/profile' element={<MyList />} />

          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" />} />
        )
        }
        <Route path='/register' element={!user ? <Register /> : <Navigate to={'/'} />} />
        <Route path='/login' element={!user ? <Login /> : <Navigate to={'/'} />} />
      </Routes>
    </Router>


  );
}

export default App;

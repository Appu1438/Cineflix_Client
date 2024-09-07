import { useContext } from 'react';
import './app.scss'
import Home from "./pages/home/Home";
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Watch from './pages/watch/Watch';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthContext } from "./context/authContext/AuthContext";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path='/' element={user ? <Home type={null} /> : <Navigate to={'/login'} />} />
        {user ? (
          <>
            <Route path='/movies' element={<Home type={'movie'} />} />
            <Route path='/series' element={<Home type={'series'} />} />
            <Route path='/watch' element={<Watch />} />

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

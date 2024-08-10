import './app.scss'
import Home from "./pages/home/Home";
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Watch from './pages/watch/Watch';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


function App() {
  const user = true;
  return (
    <Router>
      <Routes>
        <Route path='/' element={user ? <Home /> : <Navigate to={'/login'} />} />
        {user && (
          <>
            <Route path='/movies' element={<Home type={'movie'} />} />
            <Route path='/series' element={<Home type={'series'} />} />
            <Route path='/watch' element={<Watch />} />
          </>
        )}


        <Route path='/register' element={!user ? <Register /> : <Navigate to={'/'} />} />
        <Route path='/login' element={!user ? <Login /> : <Navigate to={'/'} />} />
      </Routes>
    </Router>


  );
}

export default App;

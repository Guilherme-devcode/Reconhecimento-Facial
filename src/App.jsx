import './App.css';
import FaceIndentify from './pages/faceidentify/FaceIndentify';
import Home from './pages/home/Home';
import Navbar from './components/navbar/Navbar';
import { Route, Routes, useLocation } from 'react-router-dom';
import FaceRegistration from './pages/faceRegistration/FaceRegistration';
import Login from './pages/login/Login';
import { AuthContext, AuthProvider } from './Auth/AuthProvider';
import { useContext } from 'react';



function App() {
  const { pathname } = useLocation();
  // const { currentUser } = useContext(AuthContext);

  // console.log(currentUser);

  return (
    <AuthProvider>
      <div className="App">
        {pathname !== '/Login' && <Navbar />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/check-in' element={<FaceIndentify />} />
          <Route path='/register' element={<FaceRegistration />} />
          <Route path='/Login' element={<Login />} />
        </Routes>
      </div >
    </AuthProvider>
  );
}

export default App;

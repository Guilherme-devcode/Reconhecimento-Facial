import './App.css';
import FaceIndentify from './pages/faceidentify/FaceIndentify';
import Home from './pages/home/Home';
import Navbar from './components/navbar/Navbar';
import SendFile from './components/sendfile/SendFile';
import { Route, Routes } from 'react-router-dom';
import FaceRegistration from './pages/faceRegistration/FaceRegistration';



function App() {

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/check-in' element={<FaceIndentify />}/>
        <Route path='/register' element={<FaceRegistration />}/>
      </Routes>
      {/* <FaceIndentify />
      <SendFile /> */}
    </div>

  );
}

export default App;

import './App.css';
import FaceIndentify from './components/faceidentify/FaceIndentify';
import Home from './components/home/Home';
import Navbar from './components/navbar/Navbar';
import SendFile from './components/sendfile/SendFile';



function App() {

  return (
    <div className="App">
      <Navbar />
      <Home/>
      {/* <FaceIndentify />
      <SendFile /> */}
    </div>

  );
}

export default App;

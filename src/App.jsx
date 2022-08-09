import './App.css';
import Navbar from './components/navbar';
import FaceIndentify from './components/FaceIndentify';
import SendFile from './components/SendFile';



function App() {

  return (
    <div className="App">
      <Navbar />
      <FaceIndentify />
      <div className='content'>
        <SendFile />
      </div>
    </div>

  );
}

export default App;

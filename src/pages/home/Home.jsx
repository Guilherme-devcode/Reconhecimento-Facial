import React from 'react'
import './style.css';
import faceId from '../../assets/img/faceId.png'
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className='content'>
      <div className='text'>
        <h2>Seja Bem vindo!</h2>
        <p>Adipisicing ullamco amet sit laboris ex esse quis. Cupidatat exercitation consectetur est eiusmod. Id mollit voluptate officia officia eiusmod ipsum occaecat non. Enim reprehenderit amet reprehenderit fugiat pariatur sit id occaecat duis proident fugiat sint.</p>
        <Link className='btn' to="/check-in">Reconhecimento</Link>
      </div>
      <img className='face-id' src={faceId}></img>
    </div >
  )
}

export default Home
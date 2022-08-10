import React from 'react'
import './style.css';
import faceId from '../../assets/img/faceId.png'

function Home() {
  return (
    <div className='content'>
      <div className='text'>
        <h2>Seja Bem vindo!</h2>
        <p>Adipisicing ullamco amet sit laboris ex esse quis. Cupidatat exercitation consectetur est eiusmod. Id mollit voluptate officia officia eiusmod ipsum occaecat non. Enim reprehenderit amet reprehenderit fugiat pariatur sit id occaecat duis proident fugiat sint.</p>
        <a href='#' className='btn'>Faça o check-in</a>
      </div>
      <img className='face-id' src={faceId}></img>
    </div>
  )
}

export default Home
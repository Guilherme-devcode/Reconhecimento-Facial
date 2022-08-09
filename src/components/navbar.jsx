import React from 'react'

const Navbar = () => {
    return (
        <div className='navbar'>
            <nav id='menu'>
                <input type='checkbox' id='responsive-menu'></input><label></label>
                <ul>
                    <li><a href='http://'>Face Recognition</a></li>
                </ul>
            </nav>
        </div>
    )
}

export default Navbar
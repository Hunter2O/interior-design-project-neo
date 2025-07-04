import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header style={{ backgroundColor: '#333', padding: '1rem', color: '#fff' }}>
      <nav>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/bedroom" style={linkStyle}>Bedroom</Link>
        <Link to="/livingroom" style={linkStyle}>Living Room</Link>
        <Link to="/kitchen" style={linkStyle}>Kitchen</Link>
        <Link to="/bathroom" style={linkStyle}>Bathroom</Link>
      </nav>
    </header>
  );
}

const linkStyle = {
  margin: '0 15px',
  color: '#fff',
  textDecoration: 'none'
};

export default Header;

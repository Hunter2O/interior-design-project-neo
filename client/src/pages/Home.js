import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  const [hovered, setHovered] = useState('');
  const [signup, setSignup] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const sectionData = {
    'About Us': {
      text: 'We are passionate designers helping homeowners visualize and plan beautiful interior spaces.',
      image: '/images/about.jpg'
    },
    'Contact Us': {
      text: 'Email us at support@interiorsplanner.com or call +91 98765 43210.',
      image: '/images/contact.jpg'
    },
    'History': {
      text: 'Launched in 2024, we’ve helped thousands plan their dream homes with smart tools.',
      image: '/images/history.jpg'
    },
    'Support': {
      text: 'For issues or queries, visit our helpdesk or reach out via our app chat support.',
      image: '/images/support.jpg'
    }
  };

  const sections = Object.keys(sectionData);

  const backgroundStyle = hovered
    ? {
        backgroundImage: `url(${sectionData[hovered]?.image})`,
        opacity: 0.7
      }
    : { opacity: 0 };

  const handleInputChange = (e) => {
    setSignup({ ...signup, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!signup.name || !signup.email) {
      return alert('Please fill in all required fields.');
    }

    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,}$/;
    const trustedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'protonmail.com'];

    if (!emailRegex.test(signup.email)) {
      return alert('Invalid email format.');
    }

    const domain = signup.email.split('@')[1].toLowerCase();
    if (!trustedDomains.includes(domain)) {
      return alert('Please use a valid email.');
    }

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signup),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Signup submitted:', data);
        setSubmitted(true);
      } else {
        alert(data.message || 'Signup failed.');
      }
    } catch (err) {
      console.error('Error during signup:', err);
      alert('Error submitting signup.');
    }
  };

  return (
    <div className="home-wrapper">
      <div className="background-image" style={backgroundStyle}></div>

      <div className="home-container">
        <h1>🏡 Welcome to Home Interiors Planner</h1>
        <p>Select a room to start designing:</p>

        <div className="room-grid">
          <Link to="/bedroom" className="room-card">
            <img src="/images/rooms/bedroom.jpg" alt="Bedroom" />
            <span>🛏️ Bedroom</span>
          </Link>
          <Link to="/livingroom" className="room-card">
            <img src="/images/rooms/livingroom.jpg" alt="Livingroom" />
            <span>🛋️ Living Room</span>
          </Link>
          <Link to="/kitchen" className="room-card">
            <img src="/images/rooms/kitchen.jpg" alt="Kitchen" />
            <span>🍳 Kitchen</span>
          </Link>
          <Link to="/bathroom" className="room-card">
            <img src="/images/rooms/bathroom.jpg" alt="Bathroom" />
            <span>🚿 Bathroom</span>
          </Link>
        </div>

        <div className="info-scroll-section">
          <div className="scroll-buttons">
            {sections.map((section) => (
              <div
                key={section}
                className={`scroll-btn ${hovered === section ? 'active' : ''}`}
                onMouseEnter={() => setHovered(section)}
                onMouseLeave={() => setHovered('')}
              >
                {section}
              </div>
            ))}
          </div>
          <div className="hover-content">
            <p>{hovered && sectionData[hovered]?.text}</p>
          </div>
        </div>

        {/* 🔹 Sign Up Section */}
        <div className="signup-section">
          <h3>📝 Sign Up With Us</h3>
          <p>Join our newsletter and get updates on interior trends and offers.</p>
          <div className="signup-form">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={signup.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={signup.email}
              onChange={handleInputChange}
            />
            <textarea
              name="message"
              placeholder="Your Message (optional)"
              value={signup.message}
              onChange={handleInputChange}
            />
            <button onClick={handleSignup}>Submit</button>
            {submitted && <p className="success-message">✅ Thank you for signing up!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

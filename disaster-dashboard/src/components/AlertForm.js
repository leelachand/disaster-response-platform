import React, { useState } from 'react';

const AlertForm = () => {
  const [message, setMessage] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const alertData = {
      message,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      const res = await fetch('http://localhost:3000/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alertData)
      });

      const data = await res.json();
      console.log('🚨 Alert Sent:', data);
      alert('Alert submitted successfully!');
    } catch (err) {
      console.error('Error sending alert:', err);
      alert('Failed to send alert');
    }
  };

  return (
    <div>
      <h3>🚨 Send Mock Alert</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="3"
          placeholder="Enter alert message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
        />
        <input
          type="text"
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
        />
        <br />
        <button type="submit">Submit Alert</button>
      </form>
    </div>
  );
};

export default AlertForm;

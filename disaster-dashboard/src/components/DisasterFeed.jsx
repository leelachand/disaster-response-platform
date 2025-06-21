import React, { useEffect, useState } from 'react';
import { fetchDisasters } from '../services/api';
import io from 'socket.io-client';

// ✅ Singleton socket instance
const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  reconnection: true,
});

const DisasterFeed = ({ onSelect }) => {
  const [disasters, setDisasters] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const loadDisasters = async () => {
      try {
        const data = await fetchDisasters();
        setDisasters(data);
      } catch (err) {
        console.error('Failed to fetch disasters:', err);
      }
    };

    loadDisasters();

    socket.on('disaster_created', (newDisaster) => {
      setDisasters((prev) => [newDisaster, ...prev]);
    });

    socket.on('disaster_updated', (updated) => {
      setDisasters((prev) =>
        prev.map((d) => (d.id === updated.id ? updated : d))
      );
    });

    socket.on('disaster_deleted', ({ id }) => {
      setDisasters((prev) => prev.filter((d) => d.id !== id));
    });

    return () => {
      socket.off('disaster_created');
      socket.off('disaster_updated');
      socket.off('disaster_deleted');
    };
  }, []);

  const handleSelect = (id) => {
    setSelectedId(id);
    onSelect?.(id); // Optional chaining to avoid errors
  };

  return (
    <div>
      <h2>🛑 Live Disaster Feed</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {disasters.map((d) => (
          <li
            key={d.id}
            onClick={() => handleSelect(d.id)}
            style={{
              border: d.id === selectedId ? '2px solid #007bff' : '1px solid #ccc',
              borderRadius: '8px',
              marginBottom: '1rem',
              padding: '1rem',
              backgroundColor: d.id === selectedId ? '#e9f5ff' : '#fff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              cursor: 'pointer',
              transition: 'background-color 0.2s, border 0.2s',
            }}
          >
            <h3>{d.title}</h3>
            <p><strong>📍 Location:</strong> {d.location_name || 'Unknown'}</p>
            <p><em>{d.description}</em></p>

            {d.summary && <p><strong>📝 Summary:</strong> {d.summary}</p>}
            {d.type && <p><strong>🚨 Type:</strong> {d.type}</p>}

            {d.tags?.length > 0 && (
              <p>
                <strong>🏷️ Tags:</strong>{' '}
                {d.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      backgroundColor: '#e0e0e0',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      marginRight: '6px',
                      fontSize: '0.9em',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisasterFeed;


import React, { useState } from 'react';
import DisasterFeed from './components/DisasterFeed';
import AlertForm from './components/AlertForm';
import MapView from './components/MapView';
import SocialMediaFeed from './components/SocialMediaFeed'; // ✅ Import
import './App.css';

function App() {
  const [selectedDisasterId, setSelectedDisasterId] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🌍 Disaster Response Dashboard</h1>
      </header>

      <main style={{ padding: '2rem 1rem', maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
        <section>
          <h2>🗺️ Map Overview</h2>
          <MapView />
        </section>

        <hr style={{ margin: '2.5rem 0' }} />

        <section>
          <h2>📤 Submit New Alert</h2>
          <AlertForm />
        </section>

        <hr style={{ margin: '2.5rem 0' }} />

        <section>
          <h2>📡 Live Feed</h2>
          <DisasterFeed onSelect={setSelectedDisasterId} /> {/* ✅ Pass setSelectedDisasterId */}
        </section>

        {selectedDisasterId && (
          <>
            <hr style={{ margin: '2.5rem 0' }} />
            <section>
              <h2>📢 Social Media Reports</h2>
              <SocialMediaFeed disasterId={selectedDisasterId} />
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;

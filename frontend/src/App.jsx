import { useState, useEffect } from 'react';
import Auth from './components/Auth';
import { logout } from './api';
import SpecGenerator from './components/SpecGenerator';
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // When the app loads, check if we already have a token lying around
  useEffect(() => {
    const token = localStorage.getItem('supabase_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Burn the token and kick the user out
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* The Header Navbar */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, color: '#333' }}>🚀 SpecDraft AI</h1>
        {isAuthenticated && (
          <button 
            onClick={handleLogout}
            style={{ padding: '8px 16px', backgroundColor: '#ff4c4c', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Logout (Escape!)
          </button>
        )}
      </header>

      {/* The Main Content */}
      {/* The Main Content */}
      <main>
        {!isAuthenticated ? (
          <Auth onLoginSuccess={() => setIsAuthenticated(true)} />
        ) : (
          // The VIP Section
          <div style={{ marginTop: '30px' }}>
            <SpecGenerator />
          </div>
        )}
      </main>

    </div>
  );
}

export default App;
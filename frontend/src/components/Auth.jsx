import { useState } from 'react';
import { login, signup } from '../api';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Stop the page from reloading like it's 1999
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        onLoginSuccess(); // Yell at the main app that we are officially in!
      } else {
        await signup(email, password);
        alert("Signup successful! Now prove you remember your password and log in.");
        setIsLogin(true); // Switch back to the login view
        setPassword(''); // Clear the password for safety
      }
    } catch (err) {
      // If the backend yells at us, show the error
      setError(err.response?.data?.detail || "Something went terribly wrong. Oops.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', border: '2px solid #333', borderRadius: '10px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2>{isLogin ? 'Welcome Back, Genius' : 'Join the SpecDraft Club'}</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" 
          placeholder="Your Email (Make it real)" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input 
          type="password" 
          placeholder="Password (Super secret)" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button 
          type="submit" 
          disabled={loading} 
          style={{ padding: '12px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}
        >
          {loading ? 'Thinking about it...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>

      <button 
        onClick={() => { setIsLogin(!isLogin); setError(''); }} 
        style={{ marginTop: '20px', background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' }}
      >
        {isLogin ? "Don't have an account? Sign up here." : "Already have an account? Log in."}
      </button>
    </div>
  );
}
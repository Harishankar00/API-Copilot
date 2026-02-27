import { useState } from 'react';
import { login, signup } from '../api';

export default function Auth({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        onLoginSuccess();
      } else {
        await signup(email, password);
        alert("Signup successful! Now log in to prove it.");
        setIsLogin(true);
        setPassword('');
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Oops.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-xl border border-pink-100 text-center animate-fade-in-up">
      <div className="mb-6">
        <span className="text-4xl">🚀</span>
        <h2 className="text-2xl font-extrabold text-rose-900 mt-2">
          {isLogin ? 'Welcome Back!' : 'Join SpecDraft'}
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          {isLogin ? 'Log in to generate some magic.' : 'Create an account to get started.'}
        </p>
      </div>
      
      {error && <div className="text-red-500 font-bold mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{error}</div>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          type="email" 
          placeholder="Email Address" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
          className="w-full p-3 bg-pink-50 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none text-slate-700 placeholder-slate-400"
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className="w-full p-3 bg-pink-50 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none text-slate-700 placeholder-slate-400"
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="w-full py-3 mt-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-bold shadow-md transform transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Thinking...' : (isLogin ? 'Login' : 'Sign Up')}
        </button>
      </form>

      <button 
        onClick={() => { setIsLogin(!isLogin); setError(''); }} 
        className="mt-6 text-pink-600 hover:text-pink-800 font-medium underline text-sm transition-colors"
      >
        {isLogin ? "Don't have an account? Sign up." : "Already have an account? Log in."}
      </button>
    </div>
  );
}
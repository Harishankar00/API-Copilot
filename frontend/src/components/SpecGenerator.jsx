import { useState } from 'react';
import { generateSpecs } from '../api';

export default function SpecGenerator() {
  const [textInput, setTextInput] = useState('');
  const [fileInput, setFileInput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!textInput && !fileInput) {
      setError("Come on, give me something to work with! Add text or a file.");
      return;
    }
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await generateSpecs(textInput, fileInput);
      setResult(data.data);
    } catch (err) {
      setError(err.response?.data?.detail || "The AI is napping or the backend crashed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto text-left p-4">
      
      {/* --- INPUT SECTION --- */}
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-pink-100 mb-8">
        <h3 className="text-2xl font-bold text-rose-900 mb-4 flex items-center gap-2">
          <span className="text-pink-500">✨</span> 1. Feed the AI
        </h3>
        
        <textarea 
          placeholder="Paste your messy requirement notes here..." 
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          className="w-full h-32 p-4 mb-4 bg-pink-50/50 text-slate-800 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:outline-none placeholder-slate-400"
        />
        
        <div className="mb-6 flex items-center gap-4 bg-pink-50/50 p-4 rounded-xl border border-pink-200">
          <label className="text-slate-600 font-medium">Or upload a file (.txt, .pdf):</label>
          <input 
            type="file" 
            onChange={(e) => setFileInput(e.target.files[0])} 
            accept=".txt,.pdf"
            className="text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200 cursor-pointer transition-colors"
          />
        </div>

        <button 
          onClick={handleGenerate} 
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl font-bold text-lg shadow-lg transform transition hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading ? (
            <span className="animate-pulse">🧠 Extracting Brainwaves...</span>
          ) : (
            'Generate Developer Specifications'
          )}
        </button>
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-medium">
            {error}
          </div>
        )}
      </div>

      {/* --- OUTPUT SECTION --- */}
      {result && (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-pink-200">
          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-600 mb-8 border-b border-pink-100 pb-4">
            ✅ Developer-Ready Specs
          </h2>
          
          {/* User Stories */}
          <div className="mb-8">
            <h4 className="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
              <span className="text-pink-400">👤</span> User Stories
            </h4>
            <ul className="space-y-3">
              {result.user_stories?.map((story, i) => (
                <li key={i} className="bg-pink-50/80 p-4 rounded-xl border border-pink-100 text-slate-700 shadow-sm font-medium">
                  {story}
                </li>
              ))}
            </ul>
          </div>

          {/* API Endpoints */}
          <div className="mb-8">
            <h4 className="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
              <span className="text-blue-400">🔌</span> API Endpoints
            </h4>
            <div className="overflow-x-auto rounded-xl border border-pink-200 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-pink-100/50 text-rose-800 text-sm uppercase tracking-wider">
                    <th className="p-4 font-bold border-b border-pink-200">Method</th>
                    <th className="p-4 font-bold border-b border-pink-200">Path</th>
                    <th className="p-4 font-bold border-b border-pink-200">Description</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {result.api_specs?.map((api, i) => (
                    <tr key={i} className="hover:bg-pink-50/50 transition-colors border-b border-pink-100 last:border-0">
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                          api.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                          api.method === 'POST' ? 'bg-green-100 text-green-700' :
                          api.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                          api.method === 'DELETE' ? 'bg-red-100 text-red-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {api.method}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-sm text-pink-600 font-semibold">{api.path}</td>
                      <td className="p-4">{api.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Schema */}
          <div className="mb-8">
            <h4 className="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
              <span className="text-emerald-400">🗄️</span> Database Schema
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.db_schema?.map((table, i) => (
                <div key={i} className="bg-white p-5 rounded-xl border border-pink-200 shadow-sm hover:shadow-md transition-shadow">
                  <strong className="text-lg text-rose-700 block mb-3 border-b border-pink-50 pb-2">{table.table}</strong>
                  <div className="flex flex-wrap gap-2">
                    {table.columns?.map((col, j) => (
                      <span key={j} className="bg-pink-50 text-slate-600 text-sm px-3 py-1 rounded-full border border-pink-100 font-medium">
                        {col}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Edge Cases */}
          {result.edge_cases && result.edge_cases.length > 0 && (
            <div>
              <h4 className="text-xl font-bold text-rose-900 mb-4 flex items-center gap-2">
                <span className="text-orange-400">⚠️</span> Edge Cases to Consider
              </h4>
              <ul className="space-y-2">
                {result.edge_cases.map((edgeCase, i) => (
                  <li key={i} className="bg-orange-50 p-4 rounded-xl border border-orange-200 text-orange-800 shadow-sm font-medium">
                    {edgeCase}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
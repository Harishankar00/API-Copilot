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
      // Call our Hugging Face powered backend
      const data = await generateSpecs(textInput, fileInput);
      setResult(data.data); // data.data because our FastAPI returns { message: "...", data: { ... } }
    } catch (err) {
      setError(err.response?.data?.detail || "The AI is napping or the backend crashed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'left' }}>
      
      {/* --- INPUT SECTION --- */}
      <div style={{ padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '10px', color: 'white', marginBottom: '20px' }}>
        <h3>1. Feed the AI</h3>
        
        <textarea 
          placeholder="Paste messy requirement notes here..." 
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          style={{ width: '100%', height: '100px', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}
        />
        
        <div style={{ marginBottom: '15px' }}>
          <label>Or upload a file (.txt, .pdf): </label>
          <input 
            type="file" 
            onChange={(e) => setFileInput(e.target.files[0])} 
            accept=".txt,.pdf"
            style={{ color: 'white' }}
          />
        </div>

        <button 
          onClick={handleGenerate} 
          disabled={loading}
          style={{ padding: '12px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
        >
          {loading ? '🧠 AI is thinking...' : 'Generate Specifications'}
        </button>
        
        {error && <p style={{ color: '#ff4c4c', marginTop: '10px' }}>{error}</p>}
      </div>

      {/* --- OUTPUT SECTION --- */}
      {result && (
        <div style={{ padding: '20px', border: '2px solid #28a745', borderRadius: '10px', backgroundColor: '#f9f9f9', color: '#333' }}>
          <h2 style={{ color: '#28a745', marginTop: 0 }}>✅ Developer-Ready Specs</h2>
          
          <h4>User Stories</h4>
          <ul>
            {result.user_stories?.map((story, i) => <li key={i}>{story}</li>)}
          </ul>

          <h4>API Endpoints</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ backgroundColor: '#ddd' }}>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Method</th>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Path</th>
                <th style={{ padding: '8px', border: '1px solid #ccc' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {result.api_specs?.map((api, i) => (
                <tr key={i}>
                  <td style={{ padding: '8px', border: '1px solid #ccc', fontWeight: 'bold' }}>{api.method}</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc', fontFamily: 'monospace' }}>{api.path}</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>{api.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h4>Database Schema</h4>
          {result.db_schema?.map((table, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <strong>Table: {table.table}</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>Columns: {table.columns?.join(', ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
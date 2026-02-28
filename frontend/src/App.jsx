import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [customerName, setCustomerName] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAiResult(null);

    try {
      // Sending data to your backend!
      const response = await axios.post('http://localhost:5000/api/reviews/process', {
        customerName,
        reviewText,
        rating: 5 // Defaulting to 5 for testing
      });
      
      setAiResult(response.data);
    } catch (err) {
      // Handles your Layer 1 Spam/Anomaly blocks
      setError(err.response?.data?.error || 'Failed to connect to AI Backend. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  // Minimalist Dark UI Styles
  const styles = {
    container: { fontFamily: 'sans-serif', maxWidth: '600px', margin: '50px auto', color: '#fff' },
    card: { backgroundColor: '#1e1e1e', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' },
    input: { width: '100%', padding: '12px', margin: '10px 0', borderRadius: '6px', border: '1px solid #333', backgroundColor: '#2d2d2d', color: '#fff', boxSizing: 'border-box' },
    button: { width: '100%', padding: '12px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' },
    resultBox: { marginTop: '20px', padding: '20px', backgroundColor: '#252526', borderLeft: '5px solid #007acc', borderRadius: '6px' },
    errorBox: { marginTop: '20px', padding: '15px', backgroundColor: '#4a1414', borderLeft: '5px solid #ff5252', borderRadius: '6px' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>🚀 AI Review Intelligence</h2>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Customer Name" 
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            style={styles.input}
            required
          />
          <textarea 
            placeholder="Type a review (e.g., 'The food was amazing but service was slow')" 
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            style={{ ...styles.input, height: '100px', resize: 'vertical' }}
            required
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? '🧠 Processing through AI Layers...' : 'Analyze Review'}
          </button>
        </form>

        {/* Display Error (Layer 1: Spam/Anomaly) */}
        {error && (
          <div style={styles.errorBox}>
            <strong>⚠️ Security Alert:</strong> {error}
          </div>
        )}

        {/* Display AI Intelligence Data (Layers 2 & 3) */}
        {aiResult && (
          <div style={styles.resultBox}>
            <h3 style={{ margin: '0 0 15px 0', color: '#007acc' }}>📊 Intelligence Report</h3>
            <p><strong>Sentiment Score:</strong> <span style={{ color: aiResult.sentimentScore > 50 ? '#4caf50' : '#ff5252' }}>{aiResult.sentimentScore} / 100</span></p>
            <p><strong>Category Tag:</strong> {aiResult.category}</p>
            <p><strong>AI Suggested Reply:</strong></p>
            <blockquote style={{ fontStyle: 'italic', margin: 0, padding: '10px', backgroundColor: '#1e1e1e', borderRadius: '4px' }}>
              "{aiResult.aiReply}"
            </blockquote>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
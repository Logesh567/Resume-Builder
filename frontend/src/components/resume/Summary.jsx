import { useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Sparkles } from 'lucide-react';

const Summary = ({ data, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState('');

  const improveWithAI = async () => {
    if (!data.summary) return toast.error('Write a summary first');
    setLoading(true);
    try {
      const { data: res } = await API.post('/ai/rewrite-summary/', {
        summary: data.summary,
        job_title: jobTitle,
      });
      onChange('summary', res.improved);
      toast.success('Summary improved!');
    } catch {
      toast.error('AI improvement failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-form">
      <h3 className="section-title">Professional Summary</h3>
      <div className="form-group">
        <label>Target Job Title (for AI)</label>
        <input
          type="text"
          placeholder="e.g. Senior React Developer"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Summary</label>
        <textarea
          rows={5}
          placeholder="Write a brief professional summary..."
          value={data.summary || ''}
          onChange={(e) => onChange('summary', e.target.value)}
        />
      </div>
      <button className="btn-ai" onClick={improveWithAI} disabled={loading}>
        <Sparkles size={16} />
        {loading ? 'Improving...' : 'Improve with AI'}
      </button>
    </div>
  );
};

export default Summary;
import { useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Sparkles } from 'lucide-react';

const empty = { job_title: '', company: '', location: '', start_date: '', end_date: '', is_current: false, description: '' };

const Experience = ({ resumeId, items, setItems }) => {
  const [loadingAI, setLoadingAI] = useState(null);

  const add = async () => {
    try {
      const { data } = await API.post(`/resumes/${resumeId}/experiences/`, empty);
      setItems([...items, data]);
    } catch { toast.error('Failed to add experience'); }
  };

  const update = async (index, field, value) => {
    const updated = items.map((item, i) => i === index ? { ...item, [field]: value } : item);
    setItems(updated);
    try {
      await API.patch(`/resumes/${resumeId}/experiences/${items[index].id}/`, { [field]: value });
    } catch { toast.error('Failed to save'); }
  };

  const remove = async (index) => {
    try {
      await API.delete(`/resumes/${resumeId}/experiences/${items[index].id}/`);
      setItems(items.filter((_, i) => i !== index));
      toast.success('Removed');
    } catch { toast.error('Failed to delete'); }
  };

  const improveWithAI = async (index) => {
    const item = items[index];
    if (!item.description) return toast.error('Add a description first');
    setLoadingAI(index);
    try {
      const { data } = await API.post('/ai/improve-bullet/', {
        bullet: item.description,
        job_title: item.job_title,
      });
      update(index, 'description', data.improved);
      toast.success('Improved with AI!');
    } catch { toast.error('AI failed'); }
    finally { setLoadingAI(null); }
  };

  return (
    <div className="section-form">
      <h3 className="section-title">Experience</h3>
      {items.map((item, index) => (
        <div key={item.id} className="item-card">
          <div className="form-grid">
            <div className="form-group">
              <label>Job Title</label>
              <input value={item.job_title} placeholder="Software Engineer"
                onChange={(e) => update(index, 'job_title', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Company</label>
              <input value={item.company} placeholder="Google"
                onChange={(e) => update(index, 'company', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input value={item.location} placeholder="Remote"
                onChange={(e) => update(index, 'location', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input value={item.start_date} placeholder="Jan 2022"
                onChange={(e) => update(index, 'start_date', e.target.value)} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input value={item.end_date} placeholder="Present" disabled={item.is_current}
                onChange={(e) => update(index, 'end_date', e.target.value)} />
            </div>
            <div className="form-group checkbox-group">
              <label>
                <input type="checkbox" checked={item.is_current}
                  onChange={(e) => update(index, 'is_current', e.target.checked)} />
                Currently working here
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Description / Bullet Points</label>
            <textarea rows={4} value={item.description} placeholder="Describe your responsibilities..."
              onChange={(e) => update(index, 'description', e.target.value)} />
          </div>
          <div className="item-actions">
            <button className="btn-ai" onClick={() => improveWithAI(index)} disabled={loadingAI === index}>
              <Sparkles size={14} />
              {loadingAI === index ? 'Improving...' : 'Improve with AI'}
            </button>
            <button className="btn-icon danger" onClick={() => remove(index)}>
              <Trash2 size={14} /> Remove
            </button>
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={add}>
        <Plus size={16} /> Add Experience
      </button>
    </div>
  );
};

export default Experience;
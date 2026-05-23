import { useState } from 'react';
import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2, Sparkles } from 'lucide-react';

const Skills = ({ resumeId, items, setItems }) => {
  const [jobTitle, setJobTitle] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const add = async () => {
    try {
      const { data } = await API.post(`/resumes/${resumeId}/skills/`, { name: 'New Skill', level: 'intermediate' });
      setItems([...items, data]);
    } catch { toast.error('Failed to add skill'); }
  };

  const update = async (index, field, value) => {
    setItems(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
    try {
      await API.patch(`/resumes/${resumeId}/skills/${items[index].id}/`, { [field]: value });
    } catch { toast.error('Failed to save'); }
  };

  const remove = async (index) => {
    try {
      await API.delete(`/resumes/${resumeId}/skills/${items[index].id}/`);
      setItems(items.filter((_, i) => i !== index));
    } catch { toast.error('Failed to delete'); }
  };

  const suggestWithAI = async () => {
    if (!jobTitle) return toast.error('Enter a job title first');
    setLoadingAI(true);
    try {
      const { data } = await API.post('/ai/suggest-skills/', {
        job_title: jobTitle,
        current_skills: items.map((s) => s.name),
      });
      for (const skill of data.suggestions) {
        const res = await API.post(`/resumes/${resumeId}/skills/`, { name: skill, level: 'intermediate' });
        setItems((prev) => [...prev, res.data]);
      }
      toast.success(`Added ${data.suggestions.length} AI-suggested skills!`);
    } catch { toast.error('AI suggestion failed'); }
    finally { setLoadingAI(false); }
  };

  return (
    <div className="section-form">
      <h3 className="section-title">Skills</h3>
      <div className="ai-skill-row">
        <input
          type="text"
          placeholder="Job title for AI suggestions (e.g. React Developer)"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
        />
        <button className="btn-ai" onClick={suggestWithAI} disabled={loadingAI}>
          <Sparkles size={14} />
          {loadingAI ? 'Suggesting...' : 'AI Suggest'}
        </button>
      </div>

      <div className="skills-list">
        {items.map((item, index) => (
          <div key={item.id} className="skill-row">
            <input
              value={item.name}
              placeholder="Skill name"
              onChange={(e) => update(index, 'name', e.target.value)}
            />
            <select value={item.level} onChange={(e) => update(index, 'level', e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
            <button className="btn-icon danger" onClick={() => remove(index)}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button className="btn-add" onClick={add}>
        <Plus size={16} /> Add Skill
      </button>
    </div>
  );
};

export default Skills;
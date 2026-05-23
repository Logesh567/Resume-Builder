import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

const empty = { name: '', description: '', technologies: '', url: '' };

const Projects = ({ resumeId, items, setItems }) => {
  const add = async () => {
    try {
      const { data } = await API.post(`/resumes/${resumeId}/projects/`, empty);
      setItems([...items, data]);
    } catch { toast.error('Failed to add project'); }
  };

  const update = async (index, field, value) => {
    setItems(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
    try {
      await API.patch(`/resumes/${resumeId}/projects/${items[index].id}/`, { [field]: value });
    } catch { toast.error('Failed to save'); }
  };

  const remove = async (index) => {
    try {
      await API.delete(`/resumes/${resumeId}/projects/${items[index].id}/`);
      setItems(items.filter((_, i) => i !== index));
      toast.success('Removed');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="section-form">
      <h3 className="section-title">Projects</h3>
      {items.map((item, index) => (
        <div key={item.id} className="item-card">
          <div className="form-grid">
            <div className="form-group">
              <label>Project Name</label>
              <input value={item.name} placeholder="Resume Builder App"
                onChange={(e) => update(index, 'name', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Technologies</label>
              <input value={item.technologies} placeholder="React, Django, MySQL"
                onChange={(e) => update(index, 'technologies', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Project URL</label>
              <input value={item.url} placeholder="https://github.com/..."
                onChange={(e) => update(index, 'url', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea rows={3} value={item.description} placeholder="Describe the project..."
              onChange={(e) => update(index, 'description', e.target.value)} />
          </div>
          <div className="item-actions">
            <button className="btn-icon danger" onClick={() => remove(index)}>
              <Trash2 size={14} /> Remove
            </button>
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={add}>
        <Plus size={16} /> Add Project
      </button>
    </div>
  );
};

export default Projects;
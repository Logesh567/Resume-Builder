import API from '../../api/axios';
import toast from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

const empty = { degree: '', institution: '', location: '', start_date: '', end_date: '', gpa: '', description: '' };

const Education = ({ resumeId, items, setItems }) => {
  const add = async () => {
    try {
      const { data } = await API.post(`/resumes/${resumeId}/educations/`, empty);
      setItems([...items, data]);
    } catch { toast.error('Failed to add'); }
  };

  const update = async (index, field, value) => {
    setItems(items.map((item, i) => i === index ? { ...item, [field]: value } : item));
    try {
      await API.patch(`/resumes/${resumeId}/educations/${items[index].id}/`, { [field]: value });
    } catch { toast.error('Failed to save'); }
  };

  const remove = async (index) => {
    try {
      await API.delete(`/resumes/${resumeId}/educations/${items[index].id}/`);
      setItems(items.filter((_, i) => i !== index));
      toast.success('Removed');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="section-form">
      <h3 className="section-title">Education</h3>
      {items.map((item, index) => (
        <div key={item.id} className="item-card">
          <div className="form-grid">
            <div className="form-group">
              <label>Degree</label>
              <input value={item.degree} placeholder="B.Tech Computer Science"
                onChange={(e) => update(index, 'degree', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Institution</label>
              <input value={item.institution} placeholder="MIT"
                onChange={(e) => update(index, 'institution', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input value={item.location} placeholder="Chennai, India"
                onChange={(e) => update(index, 'location', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Start Date</label>
              <input value={item.start_date} placeholder="2019"
                onChange={(e) => update(index, 'start_date', e.target.value)} />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input value={item.end_date} placeholder="2023"
                onChange={(e) => update(index, 'end_date', e.target.value)} />
            </div>
            <div className="form-group">
              <label>GPA</label>
              <input value={item.gpa} placeholder="8.5"
                onChange={(e) => update(index, 'gpa', e.target.value)} />
            </div>
          </div>
          <div className="item-actions">
            <button className="btn-icon danger" onClick={() => remove(index)}>
              <Trash2 size={14} /> Remove
            </button>
          </div>
        </div>
      ))}
      <button className="btn-add" onClick={add}>
        <Plus size={16} /> Add Education
      </button>
    </div>
  );
};

export default Education;
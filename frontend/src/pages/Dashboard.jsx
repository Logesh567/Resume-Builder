import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, FileText, Trash2, Edit } from 'lucide-react';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const { data } = await API.get('/resumes/');
      setResumes(data);
    } catch {
      toast.error('Failed to load resumes');
    } finally {
      setLoading(false);
    }
  };

  const createResume = async () => {
    try {
      const { data } = await API.post('/resumes/', { title: 'New Resume' });
      toast.success('Resume created!');
      navigate(`/resume/${data.id}`);
    } catch {
      toast.error('Failed to create resume');
    }
  };

  const deleteResume = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await API.delete(`/resumes/${id}/`);
      setResumes(resumes.filter((r) => r.id !== id));
      toast.success('Resume deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="loading">Loading your resumes...</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Resumes</h1>
        <button className="btn-primary" onClick={createResume}>
          <Plus size={18} /> New Resume
        </button>
      </div>

      {resumes.length === 0 ? (
        <div className="empty-state">
          <FileText size={64} className="empty-icon" />
          <h3>No resumes yet</h3>
          <p>Create your first AI-powered resume!</p>
          <button className="btn-primary" onClick={createResume}>
            <Plus size={18} /> Create Resume
          </button>
        </div>
      ) : (
        <div className="resume-grid">
          {resumes.map((resume) => (
            <div key={resume.id} className="resume-card">
              <div className="resume-card-icon">
                <FileText size={32} />
              </div>
              <div className="resume-card-info">
                <h3>{resume.title}</h3>
                <p>{resume.full_name || 'No name set'}</p>
                <span className="resume-date">
                  {new Date(resume.updated_at).toLocaleDateString()}
                </span>
              </div>
              <div className="resume-card-actions">
                <button className="btn-icon" onClick={() => navigate(`/resume/${resume.id}`)}>
                  <Edit size={16} /> Edit
                </button>
                <button className="btn-icon danger" onClick={() => deleteResume(resume.id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
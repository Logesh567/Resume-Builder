import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import PersonalInfo from '../components/resume/PersonalInfo';
import Summary from '../components/resume/Summary';
import Experience from '../components/resume/Experience';
import Education from '../components/resume/Education';
import Skills from '../components/resume/Skills';
import Projects from '../components/resume/Projects';
import { Save, Download, User, FileText, Briefcase, GraduationCap, Wrench, FolderOpen } from 'lucide-react';

const tabs = [
  { id: 'personal',    label: 'Personal',   icon: User },
  { id: 'summary',     label: 'Summary',    icon: FileText },
  { id: 'experience',  label: 'Experience', icon: Briefcase },
  { id: 'education',   label: 'Education',  icon: GraduationCap },
  { id: 'skills',      label: 'Skills',     icon: Wrench },
  { id: 'projects',    label: 'Projects',   icon: FolderOpen },
];

const ResumeEditor = () => {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('personal');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const { data } = await API.get(`/resumes/${id}/`);
      setResume(data);
      setExperiences(data.experiences || []);
      setEducations(data.educations || []);
      setSkills(data.skills || []);
      setProjects(data.projects || []);
    } catch {
      toast.error('Failed to load resume');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setResume({ ...resume, [field]: value });
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      await API.patch(`/resumes/${id}/`, resume);
      toast.success('Saved!');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await API.get(`/export/pdf/${id}/`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume.title || 'resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to export PDF');
    }
  };

  if (loading) return <div className="loading">Loading resume...</div>;
  if (!resume) return <div className="loading">Resume not found</div>;

  return (
    <div className="editor-page">
      <div className="editor-header">
        <h2>{resume.title || 'Resume Editor'}</h2>
        <div className="editor-actions">
          <button className="btn-secondary" onClick={downloadPDF}>
            <Download size={16} /> Export PDF
          </button>
          <button className="btn-primary" onClick={saveResume} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      <div className="editor-tabs">
        {tabs.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            className={`tab-btn ${activeTab === tabId ? 'active' : ''}`}
            onClick={() => setActiveTab(tabId)}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="editor-content">
        {activeTab === 'personal'   && <PersonalInfo data={resume} onChange={handleChange} />}
        {activeTab === 'summary'    && <Summary data={resume} onChange={handleChange} />}
        {activeTab === 'experience' && <Experience resumeId={id} items={experiences} setItems={setExperiences} />}
        {activeTab === 'education'  && <Education  resumeId={id} items={educations}  setItems={setEducations} />}
        {activeTab === 'skills'     && <Skills     resumeId={id} items={skills}      setItems={setSkills} />}
        {activeTab === 'projects'   && <Projects   resumeId={id} items={projects}    setItems={setProjects} />}
      </div>
    </div>
  );
};

export default ResumeEditor;
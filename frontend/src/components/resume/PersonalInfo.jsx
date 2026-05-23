const PersonalInfo = ({ data, onChange }) => {
  const fields = [
    { name: 'title', label: 'Resume Title', placeholder: 'e.g. Software Engineer Resume' },
    { name: 'full_name', label: 'Full Name', placeholder: 'John Doe' },
    { name: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
    { name: 'phone', label: 'Phone', placeholder: '+1 234 567 8900' },
    { name: 'location', label: 'Location', placeholder: 'City, Country' },
    { name: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
  ];

  return (
    <div className="section-form">
      <h3 className="section-title">Personal Info</h3>
      <div className="form-grid">
        {fields.map((f) => (
          <div className="form-group" key={f.name}>
            <label>{f.label}</label>
            <input
              type={f.type || 'text'}
              placeholder={f.placeholder}
              value={data[f.name] || ''}
              onChange={(e) => onChange(f.name, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInfo;
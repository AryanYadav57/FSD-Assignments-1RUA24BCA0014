import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import '../index.css';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    mobile: '',
    agreed: false
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Clear error for field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Field is required';
    if (!formData.username.trim()) newErrors.username = 'Field is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Field is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.mobile.trim()) newErrors.mobile = 'Field is required';
    if (!formData.agreed) newErrors.agreed = 'Check this box if you want to proceed';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      localStorage.setItem('superAppUser', JSON.stringify(formData));
      navigate('/superapp/select-category');
    }
  };

  const inputStyle = (error) => ({
    width: '100%',
    padding: '0.75rem',
    borderRadius: '4px',
    border: `1px solid ${error ? '#FF4B4B' : 'var(--border-color)'}`,
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'var(--text-primary)',
    marginBottom: error ? '0.25rem' : '1rem'
  });

  const errorStyle = {
    color: '#FF4B4B',
    fontSize: '0.75rem',
    marginBottom: '0.75rem',
    display: 'block'
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw' }}>
      {/* Left side banner */}
      <div style={{ 
        flex: 1, 
        position: 'relative',
        backgroundImage: 'url("https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '10%',
          color: 'white',
          fontSize: '3rem',
          fontWeight: 800,
          lineHeight: 1.2
        }}>
          Discover new things on<br />Super App
        </div>
      </div>
      
      {/* Right side form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '400px', width: '100%' }}>
          <h1 style={{ fontFamily: 'var(--font-styled)', fontSize: '2.5rem', color: '#14C38E', textAlign: 'center', marginBottom: '1rem' }}>
            Super App
          </h1>
          <p style={{ textAlign: 'center', marginBottom: '2rem' }}>Create your new account</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
            <input 
              type="text" name="name" placeholder="Name" 
              value={formData.name} onChange={handleChange} 
              style={inputStyle(errors.name)} 
            />
            {errors.name && <span style={errorStyle}>{errors.name}</span>}

            <input 
              type="text" name="username" placeholder="UserName" 
              value={formData.username} onChange={handleChange} 
              style={inputStyle(errors.username)} 
            />
            {errors.username && <span style={errorStyle}>{errors.username}</span>}

            <input 
              type="email" name="email" placeholder="Email" 
              value={formData.email} onChange={handleChange} 
              style={inputStyle(errors.email)} 
            />
            {errors.email && <span style={errorStyle}>{errors.email}</span>}

            <input 
              type="tel" name="mobile" placeholder="Mobile" 
              value={formData.mobile} onChange={handleChange} 
              style={inputStyle(errors.mobile)} 
            />
            {errors.mobile && <span style={errorStyle}>{errors.mobile}</span>}

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: errors.agreed ? '0.25rem' : '1.5rem', fontSize: '0.85rem' }}>
              <input 
                type="checkbox" name="agreed" 
                checked={formData.agreed} onChange={handleChange} 
              />
              Share my registration data with Superapp
            </label>
            {errors.agreed && <span style={errorStyle}>{errors.agreed}</span>}

            <Button 
              type="submit" 
              style={{ backgroundColor: '#14C38E', color: 'white', borderRadius: '24px', padding: '0.75rem', width: '100%', fontSize: '1rem' }}
            >
              SIGN UP
            </Button>
          </form>
          
          <div style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <p>By clicking on Sign up, you agree to Superapp <span style={{ color: '#14C38E' }}>Terms and Conditions of Use</span></p>
            <p>To learn more about how Superapp collects, uses, shares and protects your personal data please head Superapp <span style={{ color: '#14C38E' }}>Privacy Policy</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

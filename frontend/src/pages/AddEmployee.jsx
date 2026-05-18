import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

const AddEmployee = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        skills: '',
        performanceScore: '',
        experience: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Transform skills string to array
        const dataToSubmit = {
            ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
            performanceScore: Number(formData.performanceScore),
            experience: Number(formData.experience)
        };

        try {
            await api.post('/employees', dataToSubmit);
            setSuccess('Employee added successfully!');
            setFormData({ name: '', email: '', department: '', skills: '', performanceScore: '', experience: '' });
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add employee');
        }
    };

    return (
        <div className="container animate-fade-in" style={{ maxWidth: '600px' }}>
            <div className="glass card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <UserPlus color="var(--primary-color)" />
                    <h2>Add New Employee</h2>
                </div>

                {error && <div className="alert alert-error">{error}</div>}
                {success && <div className="alert" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group">
                        <label>Department</label>
                        <input type="text" name="department" value={formData.department} onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group">
                        <label>Skills (comma separated)</label>
                        <input type="text" name="skills" value={formData.skills} onChange={handleChange} required placeholder="e.g., React, Node.js, MongoDB" />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Performance Score (0-100)</label>
                            <input type="number" name="performanceScore" value={formData.performanceScore} onChange={handleChange} min="0" max="100" required />
                        </div>
                        
                        <div className="form-group" style={{ flex: 1 }}>
                            <label>Years of Experience</label>
                            <input type="number" name="experience" value={formData.experience} onChange={handleChange} min="0" required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Save Employee
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployee;

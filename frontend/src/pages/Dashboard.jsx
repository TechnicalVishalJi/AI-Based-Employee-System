import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Search, Filter, Sparkles } from 'lucide-react';

const Dashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState('');
    const [searchDept, setSearchDept] = useState('');
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchEmployees();
    }, [isAuthenticated, navigate]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const res = await api.get('/employees');
            setEmployees(res.data);
        } catch (error) {
            console.error("Error fetching employees", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            let query = '/employees/search?';
            if (searchName) query += `name=${searchName}&`;
            if (searchDept) query += `department=${searchDept}`;
            
            const res = await api.get(query);
            setEmployees(res.data);
        } catch (error) {
            console.error("Error searching employees", error);
        } finally {
            setLoading(false);
        }
    };

    const getAIRecommendations = () => {
        // We will pass the current filtered list to AI
        navigate('/ai-recommendation', { state: { employees } });
    };

    const handleUpdateScore = async (id, currentScore) => {
        const newScore = window.prompt(`Enter new performance score (0-100) for this employee:`, currentScore);
        if (newScore === null || newScore === '') return;
        
        const numScore = Number(newScore);
        if (isNaN(numScore) || numScore < 0 || numScore > 100) {
            alert('Please enter a valid number between 0 and 100.');
            return;
        }

        try {
            await api.put(`/employees/${id}/score`, { performanceScore: numScore });
            // Update local state to reflect change without full reload
            setEmployees(employees.map(emp => emp._id === id ? { ...emp, performanceScore: numScore } : emp));
            alert('Score updated successfully!');
        } catch (error) {
            console.error("Error updating score", error);
            alert(error.response?.data?.error || 'Failed to update score');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this employee?')) return;
        
        try {
            await api.delete(`/employees/${id}`);
            // Remove from local state
            setEmployees(employees.filter(emp => emp._id !== id));
            alert('Employee removed successfully!');
        } catch (error) {
            console.error("Error deleting employee", error);
            alert(error.response?.data?.error || 'Failed to delete employee');
        }
    };

    return (
        <div className="container animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Employee Analytics Dashboard</h2>
                <button onClick={getAIRecommendations} className="btn btn-primary" disabled={employees.length === 0}>
                    <Sparkles size={18} /> Generate AI Insights
                </button>
            </div>

            <div className="glass card" style={{ marginBottom: '2rem' }}>
                <form onSubmit={handleSearch} className="search-container">
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', paddingLeft: '1rem', border: '1px solid rgba(0,0,0,0.1)' }}>
                        <Search size={18} color="var(--text-muted)" />
                        <input 
                            type="text" 
                            placeholder="Search by name..." 
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            style={{ border: 'none', background: 'transparent' }}
                        />
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', paddingLeft: '1rem', border: '1px solid rgba(0,0,0,0.1)' }}>
                        <Filter size={18} color="var(--text-muted)" />
                        <input 
                            type="text" 
                            placeholder="Filter by department..." 
                            value={searchDept}
                            onChange={(e) => setSearchDept(e.target.value)}
                            style={{ border: 'none', background: 'transparent' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-secondary">Search</button>
                    <button type="button" onClick={() => { setSearchName(''); setSearchDept(''); fetchEmployees(); }} className="btn" style={{ background: 'transparent', border: '1px solid var(--text-muted)', color: 'var(--text-muted)' }}>Clear</button>
                </form>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                    <div className="spinner"></div>
                </div>
            ) : employees.length === 0 ? (
                <div className="glass card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p>No employees found.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {employees.map(emp => (
                        <div key={emp._id} className="glass card">
                            <h3 style={{ color: 'var(--primary-color)' }}>{emp.name}</h3>
                            <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{emp.email}</p>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 500 }}>Department:</span>
                                <span>{emp.department}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ fontWeight: 500 }}>Score:</span>
                                <span style={{ color: emp.performanceScore >= 80 ? 'var(--success)' : (emp.performanceScore < 50 ? 'var(--error)' : 'inherit'), fontWeight: 'bold' }}>
                                    {emp.performanceScore}/100
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ fontWeight: 500 }}>Experience:</span>
                                <span>{emp.experience} years</span>
                            </div>
                            
                            <div>
                                <span style={{ fontWeight: 500, display: 'block', marginBottom: '0.5rem' }}>Skills:</span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {emp.skills.map((skill, i) => (
                                        <span key={i} className="badge">{skill}</span>
                                    ))}
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '1rem' }}>
                                <button 
                                    onClick={() => handleUpdateScore(emp._id, emp.performanceScore)} 
                                    className="btn btn-secondary" 
                                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
                                >
                                    Edit Score
                                </button>
                                <button 
                                    onClick={() => handleDelete(emp._id)} 
                                    className="btn" 
                                    style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                                >
                                    Delete
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

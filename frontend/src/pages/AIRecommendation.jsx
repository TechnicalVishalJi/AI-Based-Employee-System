import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit, TrendingUp, BookOpen, AlertCircle } from 'lucide-react';

const AIRecommendation = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    
    const [aiData, setAiData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!state?.employees || state.employees.length === 0) {
            navigate('/');
            return;
        }

        const fetchRecommendations = async () => {
            try {
                // Strip unnecessary fields to save tokens
                const payload = state.employees.map(emp => ({
                    email: emp.email,
                    name: emp.name,
                    department: emp.department,
                    skills: emp.skills,
                    performanceScore: emp.performanceScore,
                    experience: emp.experience
                }));

                const res = await api.post('/ai/recommend', { employees: payload });
                setAiData(res.data);
            } catch (err) {
                console.error("AI Error:", err);
                setError(err.response?.data?.error || "Failed to generate AI recommendations");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [isAuthenticated, navigate, state]);

    if (loading) {
        return (
            <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
                <div className="spinner" style={{ width: '48px', height: '48px', borderWidth: '4px', borderTopColor: 'var(--primary-color)' }}></div>
                <h3 style={{ marginTop: '2rem', color: 'var(--primary-color)' }}>Analyzing Performance Data...</h3>
                <p>Generating AI insights for {state?.employees?.length} employees</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container animate-fade-in">
                <div className="glass card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <AlertCircle color="var(--error)" size={48} style={{ marginBottom: '1rem' }} />
                    <h2 style={{ color: 'var(--error)' }}>AI Generation Failed</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '2rem' }}>Return to Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <BrainCircuit color="var(--primary-color)" size={32} />
                <h2>AI Performance Insights</h2>
            </div>

            {aiData?.ranking && aiData.ranking.length > 0 && (
                <div className="glass card" style={{ marginBottom: '2rem', background: 'rgba(79, 70, 229, 0.05)' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-color)' }}>
                        <TrendingUp size={20} />
                        Top Performers Ranking
                    </h3>
                    <ol style={{ paddingLeft: '1.5rem', marginTop: '1rem', color: 'var(--text-main)' }}>
                        {aiData.ranking.map((email, index) => (
                            <li key={index} style={{ marginBottom: '0.5rem' }}>
                                <strong>{state.employees.find(e => e.email === email)?.name || email}</strong> ({email})
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                {aiData?.recommendations?.map((rec, index) => {
                    const employee = state.employees.find(e => e.email === rec.employeeEmail);
                    return (
                        <div key={index} className="glass card ai-card">
                            <h3 style={{ marginBottom: '0.5rem' }}>{employee?.name || rec.employeeEmail}</h3>
                            <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>{rec.employeeEmail}</p>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                                    <TrendingUp size={18} color="var(--secondary-color)" /> Promotion Recommendation
                                </h4>
                                <p style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '8px' }}>
                                    {rec.promotionRecommendation}
                                </p>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                                    <BrainCircuit size={18} color="var(--primary-color)" /> AI Feedback
                                </h4>
                                <p style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '8px' }}>
                                    {rec.aiFeedback}
                                </p>
                            </div>

                            <div>
                                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                                    <BookOpen size={18} color="var(--success)" /> Training Suggestions
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {rec.trainingSuggestions?.map((skill, i) => (
                                        <span key={i} className="badge" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button onClick={() => navigate('/')} className="btn btn-secondary">Back to Dashboard</button>
            </div>
        </div>
    );
};

export default AIRecommendation;

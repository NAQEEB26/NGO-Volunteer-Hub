import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/Alert';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'volunteer',
        phone: '',
        // NGO fields
        organizationName: '',
        organizationDescription: '',
        // Volunteer fields
        skills: '',
        availability: 'flexible'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleRoleChange = (role) => {
        setFormData({
            ...formData,
            role
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            // Prepare data based on role
            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                phone: formData.phone
            };

            if (formData.role === 'ngo') {
                userData.organizationName = formData.organizationName;
                userData.organizationDescription = formData.organizationDescription;
            } else {
                userData.skills = formData.skills.split(',').map(s => s.trim()).filter(s => s);
                userData.availability = formData.availability;
            }

            const user = await register(userData);

            // Redirect based on role
            if (user.role === 'ngo') {
                navigate('/ngo/dashboard');
            } else {
                navigate('/volunteer/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card" style={{ maxWidth: '550px' }}>
                <div className="auth-header">
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join our volunteer community today</p>
                </div>

                {error && <Alert type="error" message={error} onClose={() => setError('')} />}

                <form className="auth-form" onSubmit={handleSubmit}>
                    {/* Role Selection */}
                    <div className="form-group">
                        <label className="form-label">I want to register as:</label>
                        <div className="role-selector">
                            <label
                                className={`role-option ${formData.role === 'volunteer' ? 'selected' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="volunteer"
                                    checked={formData.role === 'volunteer'}
                                    onChange={() => handleRoleChange('volunteer')}
                                />
                                <div className="role-icon">🙋</div>
                                <div className="role-label">Volunteer</div>
                            </label>

                            <label
                                className={`role-option ${formData.role === 'ngo' ? 'selected' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name="role"
                                    value="ngo"
                                    checked={formData.role === 'ngo'}
                                    onChange={() => handleRoleChange('ngo')}
                                />
                                <div className="role-icon">🏢</div>
                                <div className="role-label">NGO</div>
                            </label>
                        </div>
                    </div>

                    {/* Common Fields */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-control"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="phone">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="form-control"
                            placeholder="Enter your phone number"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>

                    {/* NGO Specific Fields */}
                    {formData.role === 'ngo' && (
                        <>
                            <div className="form-group">
                                <label className="form-label" htmlFor="organizationName">Organization Name</label>
                                <input
                                    type="text"
                                    id="organizationName"
                                    name="organizationName"
                                    className="form-control"
                                    placeholder="Enter your organization name"
                                    value={formData.organizationName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="organizationDescription">Organization Description</label>
                                <textarea
                                    id="organizationDescription"
                                    name="organizationDescription"
                                    className="form-control"
                                    placeholder="Brief description of your organization"
                                    value={formData.organizationDescription}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                        </>
                    )}

                    {/* Volunteer Specific Fields */}
                    {formData.role === 'volunteer' && (
                        <>
                            <div className="form-group">
                                <label className="form-label" htmlFor="skills">Skills (comma separated)</label>
                                <input
                                    type="text"
                                    id="skills"
                                    name="skills"
                                    className="form-control"
                                    placeholder="e.g., Teaching, First Aid, Photography"
                                    value={formData.skills}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" htmlFor="availability">Availability</label>
                                <select
                                    id="availability"
                                    name="availability"
                                    className="form-control form-select"
                                    value={formData.availability}
                                    onChange={handleChange}
                                >
                                    <option value="weekdays">Weekdays</option>
                                    <option value="weekends">Weekends</option>
                                    <option value="both">Both Weekdays & Weekends</option>
                                    <option value="flexible">Flexible</option>
                                </select>
                            </div>
                        </>
                    )}

                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-control"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-control"
                                placeholder="Confirm password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-lg"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login">Sign in here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Avatar from '../components/common/Avatar';
import { AvailabilityBadge } from '../components/common/Badge';

const Profile = ({ onShowToast }) => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    experience: 2,
    availability: 'Available',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        department: user.department || '',
        designation: user.designation || '',
        experience: user.experience ?? 2,
        availability: user.availability || 'Available',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      if (onShowToast) onShowToast('Passwords do not match', 'error');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: formData.name,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        experience: formData.experience,
        availability: formData.availability,
      };

      if (formData.password) {
        payload.password = formData.password;
      }

      const res = await api.put('/auth/profile', payload);
      if (res.data && res.data.user) {
        updateUser(res.data.user);
        if (onShowToast) onShowToast('Profile updated successfully', 'success');
        setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4" style={{ maxWidth: '850px' }}>
      {/* Header */}
      <div>
        <h2 className="fs-4 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
          My Account Profile
        </h2>
        <p className="text-secondary mb-0" style={{ fontSize: '0.88rem' }}>
          Manage your organizational contact details, job role, and account credentials.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="saas-card p-4">
        <div className="d-flex flex-column flex-sm-row align-items-center gap-3">
          <Avatar name={user?.name || 'User'} size="lg" />
          <div className="text-center text-sm-start flex-grow-1">
            <div className="d-flex flex-column flex-sm-row align-items-center gap-2">
              <h4 className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>
                {user?.name}
              </h4>
              <AvailabilityBadge availability={user?.availability} />
            </div>
            <p className="text-secondary mb-0 mt-1" style={{ fontSize: '0.86rem' }}>
              {user?.designation} • {user?.department} •{' '}
              <span className="text-primary fw-semibold" style={{ textTransform: 'capitalize' }}>
                {user?.role} Role
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Edit Form Card */}
      <div className="saas-card p-4">
        <h5 className="saas-card-title mb-3">Edit Profile Information</h5>

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="profName">
                Full Name
              </label>
              <input
                id="profName"
                type="text"
                className="saas-form-control"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="profEmail">
                Email Address (Read-only)
              </label>
              <input
                id="profEmail"
                type="email"
                className="saas-form-control text-muted"
                value={formData.email}
                disabled
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="profPhone">
                Phone Number
              </label>
              <input
                id="profPhone"
                type="text"
                className="saas-form-control"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="profDept">
                Department
              </label>
              <input
                id="profDept"
                type="text"
                className="saas-form-control"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="profDesig">
                Designation
              </label>
              <input
                id="profDesig"
                type="text"
                className="saas-form-control"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="profAvail">
                Current Availability
              </label>
              <select
                id="profAvail"
                className="saas-form-select"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              >
                <option value="Available">Available</option>
                <option value="Partially Allocated">Partially Allocated</option>
                <option value="Fully Allocated">Fully Allocated</option>
              </select>
            </div>

            {/* Change Password Sub-Section */}
            <div className="col-12 mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
              <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                Change Password (Optional)
              </h6>
              <p className="text-secondary mb-3" style={{ fontSize: '0.78rem' }}>
                Leave empty to retain your current password.
              </p>

              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="saas-form-label" htmlFor="profPass">
                    New Password
                  </label>
                  <input
                    id="profPass"
                    type="password"
                    className="saas-form-control"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>

                <div className="col-12 col-md-6">
                  <label className="saas-form-label" htmlFor="profConfirmPass">
                    Confirm New Password
                  </label>
                  <input
                    id="profConfirmPass"
                    type="password"
                    className="saas-form-control"
                    placeholder="Repeat new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="col-12 text-end mt-4">
              <button
                type="submit"
                className="btn-saas-primary"
                disabled={loading}
              >
                {loading ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

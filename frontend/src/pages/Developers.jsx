import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { developerService } from '../services/developerService';
import { skillService } from '../services/skillService';
import Avatar from '../components/common/Avatar';
import { AvailabilityBadge, SkillBadge } from '../components/common/Badge';
import Modal from '../components/common/Modal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const PROFICIENCY_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
const DEPARTMENTS = ['Full Stack Engineering', 'Backend Engineering', 'Frontend Engineering', 'UI/UX Engineering', 'Data & Backend Systems', 'Quality Assurance', 'DevOps & Cloud'];

const Developers = ({ onShowToast }) => {
  const [developers, setDevelopers] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDev, setEditingDev] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingDev, setDeletingDev] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    department: 'Full Stack Engineering',
    designation: 'Software Engineer',
    experience: 2,
    availability: 'Available',
    skills: [], // Array of { skill: skillId, proficiency: 'Intermediate' }
  });

  useEffect(() => {
    fetchDevelopers();
    fetchSkills();
  }, [availabilityFilter]);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (availabilityFilter !== 'All') params.availability = availabilityFilter;

      const res = await developerService.getDevelopers(params);
      if (res.success && res.data) {
        setDevelopers(res.data);
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const res = await skillService.getSkills();
      if (res.success && res.data) {
        setSkillsList(res.data);
      }
    } catch (err) {
      console.error('Failed to load skills library', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDevelopers();
  };

  const handleOpenAddModal = () => {
    setEditingDev(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      department: 'Full Stack Engineering',
      designation: 'Software Engineer',
      experience: 2,
      availability: 'Available',
      skills: [],
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (dev) => {
    setEditingDev(dev);
    setFormData({
      name: dev.name || '',
      email: dev.email || '',
      password: '',
      phone: dev.phone || '',
      department: dev.department || 'Full Stack Engineering',
      designation: dev.designation || 'Software Engineer',
      experience: dev.experience ?? 2,
      availability: dev.availability || 'Available',
      skills: (dev.skills || []).map((s) => ({
        skill: s.skill?._id || s.skill,
        proficiency: s.proficiency || 'Intermediate',
      })),
    });
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (dev) => {
    setDeletingDev(dev);
    setIsDeleteModalOpen(true);
  };

  const handleToggleSkill = (skillId) => {
    setFormData((prev) => {
      const exists = prev.skills.find((s) => s.skill === skillId);
      if (exists) {
        return { ...prev, skills: prev.skills.filter((s) => s.skill !== skillId) };
      } else {
        return {
          ...prev,
          skills: [...prev.skills, { skill: skillId, proficiency: 'Intermediate' }],
        };
      }
    });
  };

  const handleProficiencyChange = (skillId, proficiency) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.map((s) => (s.skill === skillId ? { ...s, proficiency } : s)),
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      if (onShowToast) onShowToast('Name and email are required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (editingDev) {
        await developerService.updateDeveloper(editingDev._id, formData);
        if (onShowToast) onShowToast(`Developer ${formData.name} updated successfully`, 'success');
      } else {
        await developerService.createDeveloper(formData);
        if (onShowToast) onShowToast(`Developer ${formData.name} added successfully`, 'success');
      }
      setIsFormModalOpen(false);
      fetchDevelopers();
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDev) return;
    try {
      setSubmitting(true);
      await developerService.deleteDeveloper(deletingDev._id);
      if (onShowToast) onShowToast(`Developer ${deletingDev.name} deleted successfully`, 'success');
      setIsDeleteModalOpen(false);
      setDeletingDev(null);
      fetchDevelopers();
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header & Action Button */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div>
          <h2 className="fs-4 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Developers
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: '0.88rem' }}>
            Manage team members, technical capabilities, and workload availability.
          </p>
        </div>
        <button type="button" className="btn-saas-primary" onClick={handleOpenAddModal}>
          <i className="bi bi-person-plus-fill"></i> Add Developer
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="saas-card p-3">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-6 col-lg-7">
            <form onSubmit={handleSearchSubmit} className="position-relative">
              <input
                type="text"
                className="saas-form-control ps-5"
                placeholder="Search developers by name, email, department, or title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i
                className="bi bi-search position-absolute text-muted"
                style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              ></i>
            </form>
          </div>

          <div className="col-12 col-md-6 col-lg-5 d-flex gap-2 justify-content-md-end">
            <div className="d-flex align-items-center gap-2 w-100">
              <label className="saas-form-label mb-0 text-nowrap" style={{ fontSize: '0.82rem' }}>
                Availability:
              </label>
              <select
                className="saas-form-select"
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
              >
                <option value="All">All Availabilities</option>
                <option value="Available">Available</option>
                <option value="Partially Allocated">Partially Allocated</option>
                <option value="Fully Allocated">Fully Allocated</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Developers Table */}
      <div className="saas-card">
        <div className="saas-table-wrapper">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Developer</th>
                <th>Role & Department</th>
                <th>Experience</th>
                <th>Skills & Proficiency</th>
                <th>Availability</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-4">
                    <LoadingSkeleton count={4} height="52px" />
                  </td>
                </tr>
              ) : developers.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <EmptyState
                      icon="bi-people"
                      title="No developers found"
                      description="Add your first developer or adjust your search filter to see matching team members."
                      actionText="Add Developer"
                      onAction={handleOpenAddModal}
                    />
                  </td>
                </tr>
              ) : (
                developers.map((dev) => (
                  <tr key={dev._id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <Avatar name={dev.name} size="md" />
                        <div>
                          <Link to={`/developers/${dev._id}`} className="fw-semibold text-primary">
                            {dev.name}
                          </Link>
                          <div className="text-secondary" style={{ fontSize: '0.76rem' }}>
                            {dev.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium" style={{ color: 'var(--text-primary)', fontSize: '0.86rem' }}>
                        {dev.designation}
                      </div>
                      <div className="text-secondary" style={{ fontSize: '0.76rem' }}>
                        {dev.department}
                      </div>
                    </td>
                    <td>
                      <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                        {dev.experience}
                      </span>{' '}
                      <span className="text-secondary" style={{ fontSize: '0.78rem' }}>
                        yr{dev.experience > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '280px' }}>
                        {dev.skills?.length > 0 ? (
                          dev.skills.slice(0, 3).map((item) => (
                            <span key={item.skill?._id || item._id} className="badge-skill">
                              {item.skill?.name || 'Skill'}{' '}
                              <span className="text-muted" style={{ fontSize: '0.68rem' }}>
                                ({item.proficiency})
                              </span>
                            </span>
                          ))
                        ) : (
                          <span className="text-muted" style={{ fontSize: '0.76rem' }}>
                            No skills assigned
                          </span>
                        )}
                        {dev.skills?.length > 3 && (
                          <span className="badge bg-secondary-subtle text-secondary" style={{ fontSize: '0.7rem' }}>
                            +{dev.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <AvailabilityBadge availability={dev.availability} />
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <Link
                          to={`/developers/${dev._id}`}
                          className="btn-icon"
                          title="View Profile Details"
                        >
                          <i className="bi bi-eye"></i>
                        </Link>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Edit Developer"
                          onClick={() => handleOpenEditModal(dev)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          className="btn-icon text-danger"
                          title="Delete Developer"
                          onClick={() => handleOpenDeleteModal(dev)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Developer Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingDev ? `Edit Developer: ${editingDev.name}` : 'Add New Developer'}
        subtitle="Specify personal details, organizational department, and technical skill proficiencies"
        maxWidth="740px"
        footer={
          <>
            <button
              type="button"
              className="btn-saas-secondary"
              onClick={() => setIsFormModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-saas-primary"
              disabled={submitting}
              onClick={handleFormSubmit}
            >
              {submitting ? 'Saving...' : editingDev ? 'Save Changes' : 'Create Developer'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit}>
          <div className="row g-3">
            {/* Name */}
            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="devName">
                Full Name *
              </label>
              <input
                id="devName"
                type="text"
                className="saas-form-control"
                placeholder="e.g. Rahul Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="devEmail">
                Email Address *
              </label>
              <input
                id="devEmail"
                type="email"
                className="saas-form-control"
                placeholder="e.g. rahul@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Password (Optional for edit) */}
            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="devPassword">
                {editingDev ? 'New Password (leave blank to keep current)' : 'Password (default: dev123)'}
              </label>
              <input
                id="devPassword"
                type="password"
                className="saas-form-control"
                placeholder={editingDev ? '••••••••' : 'dev123'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            {/* Phone */}
            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="devPhone">
                Phone Number
              </label>
              <input
                id="devPhone"
                type="text"
                className="saas-form-control"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            {/* Department */}
            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="devDepartment">
                Department
              </label>
              <select
                id="devDepartment"
                className="saas-form-select"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="devDesignation">
                Designation / Job Title
              </label>
              <input
                id="devDesignation"
                type="text"
                className="saas-form-control"
                placeholder="e.g. Full Stack Developer"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              />
            </div>

            {/* Experience */}
            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="devExp">
                Experience (Years)
              </label>
              <input
                id="devExp"
                type="number"
                min="0"
                max="40"
                className="saas-form-control"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>

            {/* Availability */}
            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="devAvail">
                Workload Availability Status
              </label>
              <select
                id="devAvail"
                className="saas-form-select"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              >
                <option value="Available">Available</option>
                <option value="Partially Allocated">Partially Allocated</option>
                <option value="Fully Allocated">Fully Allocated</option>
              </select>
            </div>

            {/* Technical Skills Selection & Proficiencies */}
            <div className="col-12 mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
              <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                Technical Skills & Proficiency Ratings
              </h6>
              <p className="text-secondary mb-3" style={{ fontSize: '0.78rem' }}>
                Select the developer's core competencies used by the matching engine.
              </p>

              <div className="row g-2">
                {skillsList.map((skill) => {
                  const isSelected = formData.skills.some((s) => s.skill === skill._id);
                  const currentProficiency =
                    formData.skills.find((s) => s.skill === skill._id)?.proficiency || 'Intermediate';

                  return (
                    <div key={skill._id} className="col-12 col-sm-6">
                      <div
                        className={`p-2 rounded-3 border d-flex align-items-center justify-content-between transition-all ${
                          isSelected ? 'border-primary' : ''
                        }`}
                        style={{
                          backgroundColor: isSelected ? 'var(--primary-subtle)' : 'var(--bg-secondary-surface)',
                          borderColor: isSelected ? 'var(--primary)' : 'var(--border-color)',
                        }}
                      >
                        <div className="form-check mb-0">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`skill_${skill._id}`}
                            checked={isSelected}
                            onChange={() => handleToggleSkill(skill._id)}
                          />
                          <label
                            className="form-check-label fw-medium ms-1"
                            htmlFor={`skill_${skill._id}`}
                            style={{ fontSize: '0.84rem', cursor: 'pointer', color: 'var(--text-primary)' }}
                          >
                            {skill.name}
                          </label>
                        </div>

                        {isSelected && (
                          <select
                            className="saas-form-select form-select-sm py-0 px-2"
                            style={{ width: '120px', fontSize: '0.75rem', height: '28px' }}
                            value={currentProficiency}
                            onChange={(e) => handleProficiencyChange(skill._id, e.target.value)}
                          >
                            {PROFICIENCY_LEVELS.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Developer"
        maxWidth="480px"
        footer={
          <>
            <button
              type="button"
              className="btn-saas-secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-saas-danger"
              disabled={submitting}
              onClick={handleDeleteConfirm}
            >
              {submitting ? 'Deleting...' : 'Delete Developer'}
            </button>
          </>
        }
      >
        <div className="d-flex align-items-start gap-3">
          <div className="stat-icon-wrapper bg-danger-subtle text-danger flex-shrink-0">
            <i className="bi bi-exclamation-triangle-fill fs-5"></i>
          </div>
          <div>
            <h6 className="fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Are you sure you want to remove {deletingDev?.name}?
            </h6>
            <p className="text-secondary mb-0" style={{ fontSize: '0.84rem' }}>
              This will remove the developer account and unassign them from any active tasks. This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Developers;

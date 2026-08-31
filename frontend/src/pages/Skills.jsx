import React, { useState, useEffect } from 'react';
import { skillService } from '../services/skillService';
import Modal from '../components/common/Modal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';

const CATEGORIES = ['Programming', 'Frontend', 'Backend', 'Database', 'Architecture', 'DevOps & Cloud', 'Testing & QA', 'General'];

const Skills = ({ onShowToast }) => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingSkill, setDeletingSkill] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Programming',
    description: '',
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      const res = await skillService.getSkills(params);
      if (res.success && res.data) {
        setSkills(res.data);
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSkills();
  };

  const handleOpenAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Programming',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name || '',
      category: skill.category || 'Programming',
      description: skill.description || '',
    });
    setIsModalOpen(true);
  };

  const handleOpenDeleteModal = (skill) => {
    setDeletingSkill(skill);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      if (onShowToast) onShowToast('Skill name is required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (editingSkill) {
        await skillService.updateSkill(editingSkill._id, formData);
        if (onShowToast) onShowToast(`Skill "${formData.name}" updated successfully`, 'success');
      } else {
        await skillService.createSkill(formData);
        if (onShowToast) onShowToast(`Skill "${formData.name}" created successfully`, 'success');
      }
      setIsModalOpen(false);
      fetchSkills();
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingSkill) return;
    try {
      setSubmitting(true);
      await skillService.deleteSkill(deletingSkill._id);
      if (onShowToast) onShowToast(`Skill "${deletingSkill.name}" deleted successfully`, 'success');
      setIsDeleteModalOpen(false);
      setDeletingSkill(null);
      fetchSkills();
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header & Add Button */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div>
          <h2 className="fs-4 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Technical Skills
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: '0.88rem' }}>
            Manage the technologies and competencies used across engineering teams and task matching.
          </p>
        </div>
        <button type="button" className="btn-saas-primary" onClick={handleOpenAddModal}>
          <i className="bi bi-plus-lg"></i> Add Skill
        </button>
      </div>

      {/* Search Bar */}
      <div className="saas-card p-3">
        <form onSubmit={handleSearchSubmit} className="position-relative">
          <input
            type="text"
            className="saas-form-control ps-5"
            placeholder="Search skills by name, description, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <i
            className="bi bi-search position-absolute text-muted"
            style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }}
          ></i>
        </form>
      </div>

      {/* Skills Table */}
      <div className="saas-card">
        <div className="saas-table-wrapper">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Developers with Skill</th>
                <th>Tasks Requiring</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-4">
                    <LoadingSkeleton count={4} height="50px" />
                  </td>
                </tr>
              ) : skills.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    <EmptyState
                      icon="bi-code-slash"
                      title="No skills found"
                      description="Create your organization's technical skill stack to begin matching developers to tasks."
                      actionText="Add First Skill"
                      onAction={handleOpenAddModal}
                    />
                  </td>
                </tr>
              ) : (
                skills.map((skill) => (
                  <tr key={skill._id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="d-flex align-items-center justify-content-center rounded-2"
                          style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: 'var(--primary-subtle)',
                            color: 'var(--primary)',
                            fontSize: '0.85rem',
                          }}
                        >
                          <i className="bi bi-code-square"></i>
                        </div>
                        <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>
                          {skill.name}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary fw-semibold">
                        {skill.category || 'General'}
                      </span>
                    </td>
                    <td>
                      <span className="text-secondary" style={{ fontSize: '0.82rem', maxWidth: '350px', display: 'inline-block' }}>
                        {skill.description || 'No description provided'}
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-primary-subtle text-primary">
                        <i className="bi bi-people me-1"></i>
                        {skill.developerCount || 0} developers
                      </span>
                    </td>
                    <td>
                      <span className="badge bg-info-subtle text-info">
                        <i className="bi bi-list-task me-1"></i>
                        {skill.taskCount || 0} tasks
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          type="button"
                          className="btn-icon"
                          title="Edit Skill"
                          onClick={() => handleOpenEditModal(skill)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          className="btn-icon text-danger"
                          title="Delete Skill"
                          onClick={() => handleOpenDeleteModal(skill)}
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

      {/* Add / Edit Skill Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSkill ? `Edit Skill: ${editingSkill.name}` : 'Add New Skill'}
        subtitle="Define a technical competence and its classification for resource allocation"
        maxWidth="540px"
        footer={
          <>
            <button
              type="button"
              className="btn-saas-secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-saas-primary"
              disabled={submitting}
              onClick={handleFormSubmit}
            >
              {submitting ? 'Saving...' : editingSkill ? 'Save Changes' : 'Create Skill'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit}>
          <div className="d-flex flex-column gap-3">
            <div>
              <label className="saas-form-label" htmlFor="skillName">
                Skill Name *
              </label>
              <input
                id="skillName"
                type="text"
                className="saas-form-control"
                placeholder="e.g. React, Node.js, Python, PostgreSQL"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="saas-form-label" htmlFor="skillCategory">
                Category
              </label>
              <select
                id="skillCategory"
                className="saas-form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="saas-form-label" htmlFor="skillDesc">
                Description
              </label>
              <textarea
                id="skillDesc"
                rows="3"
                className="saas-form-control"
                placeholder="Describe what this technology is used for in projects..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Skill"
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
              {submitting ? 'Deleting...' : 'Delete Skill'}
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
              Are you sure you want to delete {deletingSkill?.name}?
            </h6>
            <p className="text-secondary mb-0" style={{ fontSize: '0.84rem' }}>
              This will remove this skill requirement from any associated tasks and developer profiles.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Skills;

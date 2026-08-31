import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services/projectService';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import Modal from '../components/common/Modal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';

const STATUSES = ['Planning', 'In Progress', 'Completed', 'On Hold'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const Projects = ({ onShowToast }) => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    client: 'Internal',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  useEffect(() => {
    fetchProjects();
  }, [statusFilter, priorityFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;

      const res = await projectService.getProjects(params);
      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData({
      name: '',
      client: 'Internal',
      description: '',
      status: 'Planning',
      priority: 'Medium',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProject(p);
    setFormData({
      name: p.name || '',
      client: p.client || 'Internal',
      description: p.description || '',
      status: p.status || 'Planning',
      priority: p.priority || 'Medium',
      startDate: p.startDate ? new Date(p.startDate).toISOString().split('T')[0] : '',
      endDate: p.endDate ? new Date(p.endDate).toISOString().split('T')[0] : '',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (p) => {
    setDeletingProject(p);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      if (onShowToast) onShowToast('Project name is required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (editingProject) {
        await projectService.updateProject(editingProject._id, formData);
        if (onShowToast) onShowToast(`Project "${formData.name}" updated successfully`, 'success');
      } else {
        await projectService.createProject(formData);
        if (onShowToast) onShowToast(`Project "${formData.name}" created successfully`, 'success');
      }
      setIsFormModalOpen(false);
      fetchProjects();
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProject) return;
    try {
      setSubmitting(true);
      await projectService.deleteProject(deletingProject._id);
      if (onShowToast) onShowToast(`Project "${deletingProject.name}" deleted successfully`, 'success');
      setIsDeleteModalOpen(false);
      setDeletingProject(null);
      fetchProjects();
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header & Add Project Button */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div>
          <h2 className="fs-4 fw-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Projects
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: '0.88rem' }}>
            Track client engagements, task deliverables, and developer team assignments.
          </p>
        </div>
        {isAdmin && (
          <button type="button" className="btn-saas-primary" onClick={handleOpenAddModal}>
            <i className="bi bi-plus-lg"></i> Create Project
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="saas-card p-3">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-md-5">
            <form onSubmit={handleSearchSubmit} className="position-relative">
              <input
                type="text"
                className="saas-form-control ps-5"
                placeholder="Search projects by name, client, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i
                className="bi bi-search position-absolute text-muted"
                style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              ></i>
            </form>
          </div>

          <div className="col-12 col-md-7 d-flex flex-wrap gap-2 justify-content-md-end">
            {/* Status Filter */}
            <div className="d-flex align-items-center gap-2">
              <label className="saas-form-label mb-0 text-nowrap" style={{ fontSize: '0.8rem' }}>
                Status:
              </label>
              <select
                className="saas-form-select"
                style={{ width: '130px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div className="d-flex align-items-center gap-2">
              <label className="saas-form-label mb-0 text-nowrap" style={{ fontSize: '0.8rem' }}>
                Priority:
              </label>
              <select
                className="saas-form-select"
                style={{ width: '120px' }}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All</option>
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <LoadingSkeleton count={3} height="160px" />
      ) : projects.length === 0 ? (
        <EmptyState
          icon="bi-kanban"
          title="No projects found"
          description="Create your first project to organize work tasks and allocate developers."
          actionText={isAdmin ? 'Create First Project' : null}
          onAction={handleOpenAddModal}
        />
      ) : (
        <div className="row g-4">
          {projects.map((project) => (
            <div key={project._id} className="col-12 col-lg-6 col-xl-4">
              <div className="saas-card h-100 d-flex flex-column justify-content-between">
                <div>
                  {/* Card Top Row */}
                  <div className="p-4 pb-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="text-secondary" style={{ fontSize: '0.78rem', fontWeight: 600 }}>
                        CLIENT: {project.client}
                      </div>
                      <div className="d-flex gap-1">
                        <PriorityBadge priority={project.priority} />
                        <StatusBadge status={project.status} />
                      </div>
                    </div>

                    <Link to={`/projects/${project._id}`} className="text-decoration-none">
                      <h5 className="fw-bold mb-2 text-primary" style={{ fontSize: '1.1rem' }}>
                        {project.name}
                      </h5>
                    </Link>

                    <p className="text-secondary mb-3" style={{ fontSize: '0.82rem', lineHeight: '1.5', minHeight: '38px' }}>
                      {project.description || 'Enterprise project deliverable'}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="text-secondary" style={{ fontSize: '0.76rem' }}>
                          Delivery Progress
                        </span>
                        <span className="fw-bold text-primary" style={{ fontSize: '0.78rem' }}>
                          {project.progress}%
                        </span>
                      </div>
                      <div className="saas-progress">
                        <div
                          className="saas-progress-bar bg-primary"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Meta Specs: Tasks, Devs, Start Date */}
                    <div className="d-flex justify-content-between align-items-center pt-2 border-top" style={{ borderColor: 'var(--border-subtle)', fontSize: '0.78rem' }}>
                      <span className="text-secondary">
                        <i className="bi bi-list-check me-1 text-primary"></i>
                        <strong>{project.totalTasks}</strong> Tasks ({project.completedTasks} done)
                      </span>
                      <span className="text-secondary">
                        <i className="bi bi-people me-1 text-success"></i>
                        <strong>{project.developerCount}</strong> Developers
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div
                  className="px-4 py-3 border-top d-flex justify-content-between align-items-center"
                  style={{
                    backgroundColor: 'var(--bg-secondary-surface)',
                    borderColor: 'var(--border-subtle)',
                    borderBottomLeftRadius: 'var(--radius-lg)',
                    borderBottomRightRadius: 'var(--radius-lg)',
                  }}
                >
                  <Link
                    to={`/projects/${project._id}`}
                    className="fw-semibold text-primary"
                    style={{ fontSize: '0.84rem' }}
                  >
                    View Project <i className="bi bi-arrow-right ms-1"></i>
                  </Link>

                  {isAdmin && (
                    <div className="d-flex gap-1">
                      <button
                        type="button"
                        className="btn-icon"
                        style={{ width: '30px', height: '30px' }}
                        title="Edit Project"
                        onClick={() => handleOpenEditModal(project)}
                      >
                        <i className="bi bi-pencil" style={{ fontSize: '0.8rem' }}></i>
                      </button>
                      <button
                        type="button"
                        className="btn-icon text-danger"
                        style={{ width: '30px', height: '30px' }}
                        title="Delete Project"
                        onClick={() => handleOpenDeleteModal(project)}
                      >
                        <i className="bi bi-trash" style={{ fontSize: '0.8rem' }}></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingProject ? `Edit Project: ${editingProject.name}` : 'Create New Project'}
        subtitle="Specify project client, timeline milestones, and priority level"
        maxWidth="640px"
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
              {submitting ? 'Saving...' : editingProject ? 'Save Changes' : 'Create Project'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="saas-form-label" htmlFor="projName">
                Project Name *
              </label>
              <input
                id="projName"
                type="text"
                className="saas-form-control"
                placeholder="e.g. E-Commerce Platform"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="projClient">
                Client / Sponsor
              </label>
              <input
                id="projClient"
                type="text"
                className="saas-form-control"
                placeholder="e.g. ABC Technologies"
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="projPriority">
                Priority Level
              </label>
              <select
                id="projPriority"
                className="saas-form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="projStatus">
                Project Status
              </label>
              <select
                id="projStatus"
                className="saas-form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="projStart">
                Start Date
              </label>
              <input
                id="projStart"
                type="date"
                className="saas-form-control"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="col-12">
              <label className="saas-form-label" htmlFor="projDesc">
                Project Description & Scope
              </label>
              <textarea
                id="projDesc"
                rows="3"
                className="saas-form-control"
                placeholder="Brief summary of requirements, technical objectives, and deliverables..."
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
        title="Delete Project"
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
              {submitting ? 'Deleting...' : 'Delete Project'}
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
              Are you sure you want to delete {deletingProject?.name}?
            </h6>
            <p className="text-secondary mb-0" style={{ fontSize: '0.84rem' }}>
              This will also permanently delete all associated tasks for this project.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;

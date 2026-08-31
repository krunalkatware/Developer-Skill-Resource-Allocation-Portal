import React, { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { skillService } from '../services/skillService';
import { developerService } from '../services/developerService';
import Avatar from '../components/common/Avatar';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import Modal from '../components/common/Modal';
import MatchModal from '../components/matching/MatchModal';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import { useAuth } from '../context/AuthContext';

const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
const STATUSES = ['To Do', 'In Progress', 'Completed'];

const Tasks = ({ onShowToast }) => {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [skillsList, setSkillsList] = useState([]);
  const [developersList, setDevelopersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState(null);
  const [selectedTaskForMatch, setSelectedTaskForMatch] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    project: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
    estimatedHours: 8,
    deadline: '',
    requiredSkills: [], // array of skill IDs
    assignedDeveloper: '',
  });

  useEffect(() => {
    fetchTasks();
    fetchMetadata();
  }, [projectFilter, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (projectFilter !== 'All') params.project = projectFilter;
      if (statusFilter !== 'All') params.status = statusFilter;
      if (priorityFilter !== 'All') params.priority = priorityFilter;

      // If developer, show only their assigned tasks unless specified
      if (!isAdmin) {
        params.assignedDeveloper = user._id;
      }

      const res = await taskService.getTasks(params);
      if (res.success && res.data) {
        setTasks(res.data);
      }
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      const [projRes, skillRes, devRes] = await Promise.all([
        projectService.getProjects(),
        skillService.getSkills(),
        developerService.getDevelopers(),
      ]);
      if (projRes.data) setProjectsList(projRes.data);
      if (skillRes.data) setSkillsList(skillRes.data);
      if (devRes.data) setDevelopersList(devRes.data);
    } catch (err) {
      console.error('Failed to load metadata', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      project: projectsList[0]?._id || '',
      description: '',
      priority: 'Medium',
      status: 'To Do',
      estimatedHours: 8,
      deadline: '',
      requiredSkills: [],
      assignedDeveloper: '',
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (t) => {
    setEditingTask(t);
    setFormData({
      title: t.title || '',
      project: t.project?._id || t.project || '',
      description: t.description || '',
      priority: t.priority || 'Medium',
      status: t.status || 'To Do',
      estimatedHours: t.estimatedHours ?? 8,
      deadline: t.deadline ? new Date(t.deadline).toISOString().split('T')[0] : '',
      requiredSkills: (t.requiredSkills || []).map((s) => s._id || s),
      assignedDeveloper: t.assignedDeveloper?._id || t.assignedDeveloper || '',
    });
    setIsFormModalOpen(true);
  };

  const handleToggleRequiredSkill = (skillId) => {
    setFormData((prev) => {
      const exists = prev.requiredSkills.includes(skillId);
      if (exists) {
        return { ...prev, requiredSkills: prev.requiredSkills.filter((id) => id !== skillId) };
      } else {
        return { ...prev, requiredSkills: [...prev.requiredSkills, skillId] };
      }
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.project) {
      if (onShowToast) onShowToast('Task title and Project selection are required', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        assignedDeveloper: formData.assignedDeveloper || null,
      };

      if (editingTask) {
        await taskService.updateTask(editingTask._id, payload);
        if (onShowToast) onShowToast(`Task "${formData.title}" updated successfully`, 'success');
      } else {
        await taskService.createTask(payload);
        if (onShowToast) onShowToast(`Task "${formData.title}" created successfully`, 'success');
      }
      setIsFormModalOpen(false);
      fetchTasks();
    } catch (err) {
      if (onShowToast) onShowToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTask) return;
    try {
      setSubmitting(true);
      await taskService.deleteTask(deletingTask._id);
      if (onShowToast) onShowToast(`Task deleted successfully`, 'success');
      setIsDeleteModalOpen(false);
      setDeletingTask(null);
      fetchTasks();
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
            Tasks & Work Items
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: '0.88rem' }}>
            Track project deliverables, evaluate skill match compatibility, and allocate developers.
          </p>
        </div>
        {isAdmin && (
          <button type="button" className="btn-saas-primary" onClick={handleOpenAddModal}>
            <i className="bi bi-plus-lg"></i> Create Task
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="saas-card p-3">
        <div className="row g-3 align-items-center">
          <div className="col-12 col-lg-4">
            <form onSubmit={handleSearchSubmit} className="position-relative">
              <input
                type="text"
                className="saas-form-control ps-5"
                placeholder="Search tasks by title or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <i
                className="bi bi-search position-absolute text-muted"
                style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              ></i>
            </form>
          </div>

          <div className="col-12 col-lg-8 d-flex flex-wrap gap-2 justify-content-lg-end">
            {/* Project Filter */}
            <div className="d-flex align-items-center gap-2">
              <label className="saas-form-label mb-0 text-nowrap" style={{ fontSize: '0.8rem' }}>
                Project:
              </label>
              <select
                className="saas-form-select"
                style={{ maxWidth: '160px' }}
                value={projectFilter}
                onChange={(e) => setProjectFilter(e.target.value)}
              >
                <option value="All">All Projects</option>
                {projectsList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="d-flex align-items-center gap-2">
              <label className="saas-form-label mb-0 text-nowrap" style={{ fontSize: '0.8rem' }}>
                Status:
              </label>
              <select
                className="saas-form-select"
                style={{ width: '120px' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
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
                style={{ width: '115px' }}
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="All">All Priorities</option>
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

      {/* Tasks Table */}
      <div className="saas-card">
        <div className="saas-table-wrapper">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Project</th>
                <th>Required Skills</th>
                <th>Priority</th>
                <th>Assigned Developer</th>
                <th>Deadline</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-4">
                    <LoadingSkeleton count={4} height="52px" />
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <EmptyState
                      icon="bi-list-task"
                      title="No tasks found"
                      description="Create a task to specify technical skill requirements and match developer bandwidth."
                      actionText={isAdmin ? 'Create Task' : null}
                      onAction={handleOpenAddModal}
                    />
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr key={task._id}>
                    <td>
                      <div className="fw-semibold" style={{ color: 'var(--text-primary)' }}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-secondary" style={{ fontSize: '0.74rem', maxWidth: '240px' }}>
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="fw-medium text-primary">{task.project?.name || 'Project'}</span>
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1" style={{ maxWidth: '200px' }}>
                        {task.requiredSkills?.length > 0 ? (
                          task.requiredSkills.map((sk) => (
                            <span key={sk._id || sk} className="badge-skill">
                              {sk.name || 'Skill'}
                            </span>
                          ))
                        ) : (
                          <span className="text-muted" style={{ fontSize: '0.72rem' }}>
                            Universal
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <PriorityBadge priority={task.priority} />
                    </td>
                    <td>
                      {task.assignedDeveloper ? (
                        <div className="d-flex align-items-center gap-2">
                          <Avatar name={task.assignedDeveloper.name} size="sm" />
                          <span style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                            {task.assignedDeveloper.name}
                          </span>
                        </div>
                      ) : (
                        <span className="badge bg-warning-subtle text-warning" style={{ fontSize: '0.74rem' }}>
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem' }}>
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        {/* Core Match Button */}
                        {isAdmin && (
                          <button
                            type="button"
                            className="btn-saas-primary btn-sm py-1 px-2"
                            style={{ fontSize: '0.76rem' }}
                            title="Find Suitable Developer via Skill Matching"
                            onClick={() => setSelectedTaskForMatch(task)}
                          >
                            <i className="bi bi-cpu me-1"></i> Match
                          </button>
                        )}

                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              className="btn-icon"
                              title="Edit Task"
                              onClick={() => handleOpenEditModal(task)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn-icon text-danger"
                              title="Delete Task"
                              onClick={() => {
                                setDeletingTask(task);
                                setIsDeleteModalOpen(true);
                              }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Task Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingTask ? `Edit Task: ${editingTask.title}` : 'Create New Work Task'}
        subtitle="Define task details, timeline, and select required technical skills for automated matching"
        maxWidth="680px"
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
              {submitting ? 'Saving...' : editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </>
        }
      >
        <form onSubmit={handleFormSubmit}>
          <div className="row g-3">
            <div className="col-12">
              <label className="saas-form-label" htmlFor="taskTitle">
                Task Title *
              </label>
              <input
                id="taskTitle"
                type="text"
                className="saas-form-control"
                placeholder="e.g. Build Product Dashboard, Create REST API"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                autoFocus
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="taskProject">
                Associated Project *
              </label>
              <select
                id="taskProject"
                className="saas-form-select"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                required
              >
                <option value="">Select Project</option>
                {projectsList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.client})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="taskPriority">
                Priority Level
              </label>
              <select
                id="taskPriority"
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
              <label className="saas-form-label" htmlFor="taskHours">
                Estimated Hours
              </label>
              <input
                id="taskHours"
                type="number"
                min="1"
                max="500"
                className="saas-form-control"
                value={formData.estimatedHours}
                onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="taskDeadline">
                Deadline Date
              </label>
              <input
                id="taskDeadline"
                type="date"
                className="saas-form-control"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="saas-form-label" htmlFor="taskStatus">
                Task Status
              </label>
              <select
                id="taskStatus"
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
              <label className="saas-form-label" htmlFor="taskAssignDev">
                Direct Assigned Developer (Optional)
              </label>
              <select
                id="taskAssignDev"
                className="saas-form-select"
                value={formData.assignedDeveloper}
                onChange={(e) => setFormData({ ...formData, assignedDeveloper: e.target.value })}
              >
                <option value="">-- Unassigned (Find via Matcher) --</option>
                {developersList.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.availability})
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="saas-form-label" htmlFor="taskDesc">
                Task Scope & Description
              </label>
              <textarea
                id="taskDesc"
                rows="2"
                className="saas-form-control"
                placeholder="Specific technical tasks, API schemas, design mockups..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Required Skills Selection */}
            <div className="col-12 mt-3 pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
              <label className="saas-form-label mb-1">
                Required Technical Skills (Used by Matching Algorithm)
              </label>
              <p className="text-secondary mb-2" style={{ fontSize: '0.78rem' }}>
                Select all technologies required for this task. The matching algorithm computes match percentages based on these requirements.
              </p>

              <div className="d-flex flex-wrap gap-2">
                {skillsList.map((skill) => {
                  const isChecked = formData.requiredSkills.includes(skill._id);
                  return (
                    <button
                      key={skill._id}
                      type="button"
                      className={`btn btn-sm ${
                        isChecked ? 'btn-primary text-white' : 'btn-outline-secondary'
                      }`}
                      style={{ fontSize: '0.8rem' }}
                      onClick={() => handleToggleRequiredSkill(skill._id)}
                    >
                      {isChecked && <i className="bi bi-check2 me-1"></i>}
                      {skill.name}
                    </button>
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
        title="Delete Task"
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
              {submitting ? 'Deleting...' : 'Delete Task'}
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
              Are you sure you want to delete this task?
            </h6>
            <p className="text-secondary mb-0" style={{ fontSize: '0.84rem' }}>
              Task "{deletingTask?.title}" will be permanently removed.
            </p>
          </div>
        </div>
      </Modal>

      {/* Skill Matching Modal */}
      {selectedTaskForMatch && (
        <MatchModal
          isOpen={!!selectedTaskForMatch}
          onClose={() => setSelectedTaskForMatch(null)}
          task={selectedTaskForMatch}
          onAssignmentSuccess={fetchTasks}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};

export default Tasks;

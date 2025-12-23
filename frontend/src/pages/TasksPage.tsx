import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Plus, Search, MoreVertical, Trash2, Edit, CheckCircle2, Circle, Clock, Loader2, Calendar, X, ArrowLeft } from 'lucide-react';
import type { CreateTaskRequest, Task, UpdateTaskRequest } from '../types/task.types';
import { useTasks } from '../hooks/useTasks';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject } from '../hooks/useProject';
// ============================================================================
// SKELETON LOADING
// ============================================================================
const SkeletonCard: React.FC = () => (
  <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 overflow-hidden">
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="mt-1 w-6 h-6 bg-slate-700 rounded-full animate-pulse" />
          <div className="flex-1">
            <div className="h-6 w-48 bg-slate-700 rounded animate-pulse mb-1" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-slate-700/70 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-slate-700/70 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="w-5 h-5 bg-slate-700 rounded animate-pulse" />
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
        </div>
        <div className="h-3 w-16 bg-slate-700 rounded animate-pulse" />
      </div>
    </div>
  </div>
);
const LoadingSkeleton: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
    <ThreeBackground />
   
    <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-12 w-64 bg-slate-700 rounded-lg mb-2 animate-pulse" />
            <div className="h-6 w-48 bg-slate-700/70 rounded animate-pulse" />
          </div>
         
          <div className="h-14 w-40 bg-slate-700 rounded-xl animate-pulse" />
        </div>
        <div className="flex gap-4 mb-8">
          <div className="flex-1 h-14 bg-slate-800/50 border border-slate-700/50 rounded-xl animate-pulse" />
          <div className="flex gap-2">
            <div className="h-14 w-20 bg-slate-800/50 border border-slate-700/50 rounded-xl animate-pulse" />
            <div className="h-14 w-24 bg-slate-800/50 border border-slate-700/50 rounded-xl animate-pulse" />
            <div className="h-14 w-32 bg-slate-800/50 border border-slate-700/50 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="relative">
              <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
                <div className="h-4 w-24 bg-slate-700 rounded mb-2 animate-pulse" />
                <div className="h-10 w-16 bg-slate-700 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
        <div className="mb-8">
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 w-16 bg-slate-700 rounded animate-pulse" />
              <div className="h-6 w-12 bg-slate-700 rounded animate-pulse" />
            </div>
           
            <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1/2 bg-slate-600 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  </div>
);
// ============================================================================
// TASK MODAL COMPONENT
// ============================================================================
interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>;
  task?: Task | null;
}
const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, task = null }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setDueDate(task.dueDate || '');
      } else {
        setTitle('');
        setDescription('');
        setDueDate('');
      }
      setError(null);
    }
  }, [task, isOpen]);
  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save task');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
     
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-600/50 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/50 rounded-lg text-rose-400 text-sm">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-2">
              Task Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              placeholder="Enter task title"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-300 mb-2">
              Description (optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none"
              placeholder="Enter task description"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-slate-300 mb-2">
              Due Date (optional)
            </label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg font-medium transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// ============================================================================
// TASK CARD COMPONENT
// ============================================================================
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggle: (taskId: number, completed: boolean) => Promise<void>;
}
const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onToggle }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  const getBorderColor = (): string => {
    if (task.completed) return 'border-emerald-500/50';
    if (isOverdue) return 'border-rose-500/50';
    return 'border-slate-700/50';
  };
  return (
    <div
      className={`group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border ${getBorderColor()} hover:border-violet-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/20 overflow-visible`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-violet-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-all duration-700 rounded-2xl pointer-events-none" />
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none" />
     
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-4 flex-1">
            <button
              onClick={() => onToggle(task.id, !task.completed)}
              className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                task.completed
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 border-emerald-600'
                  : 'border-slate-500 hover:border-violet-500'
              }`}
            >
              {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
            </button>
            <div className="flex-1">
              <h3 className={`text-lg font-bold mb-1 transition-all ${
                task.completed ? 'line-through text-slate-500' : 'text-white group-hover:text-violet-300'
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className={`text-sm line-clamp-2 ${task.completed ? 'text-slate-600' : 'text-slate-400'}`}>
                  {task.description}
                </p>
              )}
            </div>
          </div>
         
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
            >
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
           
            {showMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[1000]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-slate-300 hover:bg-violet-600/20 hover:text-white transition-colors duration-200 flex items-center gap-3"
                >
                  <Edit className="w-4 h-4" />
                  Edit Task
                </button>
                {!task.completed && (
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await onToggle(task.id, true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-3 text-left text-emerald-400 hover:bg-emerald-600/20 transition-colors duration-200 flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Complete
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-rose-400 hover:bg-rose-600/20 transition-colors duration-200 flex items-center gap-3"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Task
                </button>
              </div>
            )}
          </div>
        </div>
        {task.dueDate && (
          <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
            <div className={`flex items-center gap-2 text-sm ${
              isOverdue ? 'text-rose-400' : task.completed ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(task.dueDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
            {isOverdue && (
              <div className="flex items-center gap-1 text-xs text-rose-400 font-semibold">
                <Clock className="w-3 h-3" />
                Overdue
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
// ============================================================================
// THREE.JS BACKGROUND
// ============================================================================
const ThreeBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mountRef.current) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
   
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
   
    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }
   
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
   
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.15,
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
   
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    const shapes: THREE.Mesh[] = [];
    const geometries = [
      new THREE.TorusGeometry(2, 0.5, 16, 100),
      new THREE.OctahedronGeometry(2),
      new THREE.IcosahedronGeometry(2)
    ];
    for (let i = 0; i < 3; i++) {
      const material = new THREE.MeshPhongMaterial({
        color: i === 0 ? 0x8b5cf6 : i === 1 ? 0xec4899 : 0x3b82f6,
        transparent: true,
        opacity: 0.1,
        wireframe: true
      });
     
      const mesh = new THREE.Mesh(geometries[i], material);
      mesh.position.set(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 30
      );
      shapes.push(mesh);
      scene.add(mesh);
    }
    const light1 = new THREE.PointLight(0x8b5cf6, 2, 100);
    light1.position.set(10, 10, 10);
    scene.add(light1);
    const light2 = new THREE.PointLight(0xec4899, 2, 100);
    light2.position.set(-10, -10, -10);
    scene.add(light2);
    camera.position.z = 30;
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);
    const animate = () => {
      requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;
      shapes.forEach((shape, i) => {
        shape.rotation.x += 0.001 * (i + 1);
        shape.rotation.y += 0.002 * (i + 1);
      });
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    animate();
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);
  return <div ref={mountRef} className="fixed inset-0 -z-10" />;
};
// ============================================================================
// MAIN COMPONENT
// ============================================================================
const TasksPage: React.FC = () => {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    const numericProjectId = parseInt(projectId || '0', 10);
 
  const { tasks, loading, error, createTask, updateTask, deleteTask, toggleCompletion, updateFilters } = useTasks(numericProjectId, 0, 20, {});
  const { project, loading: projectLoading, error: projectError } = useProject(numericProjectId);
 
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompleted, setFilterCompleted] = useState<boolean | undefined>(undefined);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  // Debounced filter update
  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters({ search: searchQuery, completed: filterCompleted });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, filterCompleted, updateFilters]);
  const handleCreateTask = async (data: CreateTaskRequest): Promise<void> => {
    await createTask(data);
  };
  const handleUpdateTask = async (data: UpdateTaskRequest): Promise<void> => {
    if (editingTask) {
      await updateTask(editingTask.id, data);
    }
  };
  const handleEditTask = (task: Task): void => {
    setEditingTask(task);
    setShowTaskModal(true);
  };
  const handleDeleteTask = async (task: Task): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      try {
        await deleteTask(task.id);
      } catch (err) {
        alert('Failed to delete task');
      }
    }
  };
  const handleToggleCompletion = async (taskId: number, completed: boolean): Promise<void> => {
    try {
      await toggleCompletion(taskId, true);
    } catch (err) {
      alert('Failed to update task');
    }
  };
  const handleCloseModal = () => {
    setShowTaskModal(false);
    setEditingTask(null);
  };
  const completedCount = tasks.filter(t => t.completed).length;
  const progressPercentage = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  if ((loading && tasks.length === 0) || projectLoading) {
    return <LoadingSkeleton />;
  }
  if ((error && tasks.length === 0) || projectError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-rose-400 text-xl mb-4">{error || projectError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      <ThreeBackground />
     
      <TaskModal
        isOpen={showTaskModal}
        onClose={handleCloseModal}
        onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
        task={editingTask}
      />
     
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/projects')}
                className="p-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl hover:border-violet-500/50 hover:bg-violet-500/10 transition-all duration-300"
                title="Back to Projects"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400 hover:text-violet-400 transition-colors" />
              </button>
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {project?.title || 'Project Tasks'}
                </h1>
                <p className="text-slate-400 text-lg">
                  {project?.description || 'Manage your project tasks efficiently'}
                </p>
              </div>
            </div>
           
            <button
              onClick={() => {
                setEditingTask(null);
                setShowTaskModal(true);
              }}
              className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-semibold hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-3 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Plus className="w-5 h-5 relative z-10" />
              <span className="relative z-10">New Task</span>
            </button>
          </div>
          <div className="flex gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
              />
              {loading && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
                </div>
              )}
            </div>
           
            <div className="flex gap-2">
              <button
                onClick={() => setFilterCompleted(undefined)}
                className={`px-6 py-4 backdrop-blur-xl border rounded-xl font-medium transition-all duration-300 ${
                  filterCompleted === undefined
                    ? 'bg-violet-600/20 border-violet-500/50 text-white'
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-violet-500/50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterCompleted(false)}
                className={`px-6 py-4 backdrop-blur-xl border rounded-xl font-medium transition-all duration-300 ${
                  filterCompleted === false
                    ? 'bg-violet-600/20 border-violet-500/50 text-white'
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-violet-500/50'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterCompleted(true)}
                className={`px-6 py-4 backdrop-blur-xl border rounded-xl font-medium transition-all duration-300 ${
                  filterCompleted === true
                    ? 'bg-violet-600/20 border-violet-500/50 text-white'
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-violet-500/50'
                }`}
              >
                Completed
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total Tasks', value: tasks.length, color: 'from-violet-500 to-purple-500' },
              { label: 'Active', value: tasks.filter(t => !t.completed).length, color: 'from-blue-500 to-cyan-500' },
              { label: 'Completed', value: completedCount, color: 'from-emerald-500 to-teal-500' }
            ].map((stat, i) => (
              <div key={i} className="relative group">
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} rounded-xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50 group-hover:border-violet-500/50 transition-all duration-300">
                  <p className="text-slate-400 text-sm mb-2">{stat.label}</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-8">
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400">Progress</span>
                <span className="text-2xl font-bold text-white">{progressPercentage.toFixed(0)}%</span>
              </div>
              <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
        {tasks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-slate-800/50 rounded-full flex items-center justify-center">
              <Circle className="w-16 h-16 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-400 mb-2">No tasks found</h3>
            <p className="text-slate-500 mb-6">
              {searchQuery || filterCompleted !== undefined
                ? 'Try adjusting your filters'
                : 'Create your first task to get started'}
            </p>
            <button
              onClick={() => {
                setEditingTask(null);
                setShowTaskModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Create Your First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onToggle={handleToggleCompletion}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default TasksPage;
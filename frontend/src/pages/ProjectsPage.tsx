import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { Plus, Search, Filter, MoreVertical, Trash2, Edit, TrendingUp, CheckCircle2, Circle, Clock, LogOut, X } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../hooks/useAuth';
import type { Project, CreateProjectRequest } from '../types/project.types';
// ============================================
// SKELETON LOADING
// ============================================
const SkeletonCard: React.FC = () => (
  <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 overflow-hidden">
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 bg-slate-700 rounded-full animate-pulse" />
            <div className="h-6 w-48 bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-slate-700/70 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-slate-700/70 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-5 h-5 bg-slate-700 rounded animate-pulse" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-16 bg-slate-700 rounded animate-pulse" />
          <div className="h-4 w-12 bg-slate-700 rounded animate-pulse" />
        </div>
       
        <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-slate-600 rounded-full animate-pulse" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-slate-700 rounded-full animate-pulse" />
            <div className="h-4 w-24 bg-slate-700 rounded animate-pulse" />
          </div>
          <div className="w-4 h-4 bg-slate-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);
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
         
          <div className="flex items-center gap-4">
            <div className="h-14 w-40 bg-slate-700 rounded-xl animate-pulse" />
            <div className="h-14 w-14 bg-slate-700 rounded-xl animate-pulse" />
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1 h-14 bg-slate-800/50 border border-slate-700/50 rounded-xl animate-pulse" />
          <div className="w-32 h-14 bg-slate-800/50 border border-slate-700/50 rounded-xl animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="relative">
            <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-xl p-6 border border-slate-700/50">
              <div className="h-4 w-24 bg-slate-700 rounded mb-2 animate-pulse" />
              <div className="h-10 w-16 bg-slate-700 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  </div>
);
// ============================================
// CREATE PROJECT MODAL
// ============================================
interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateProjectRequest) => Promise<void>;
}
const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async () => {
    console.log('[CREATE MODAL] Submitting with title:', title, 'description:', description);
   
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onCreate({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      console.log('[CREATE MODAL] Project created successfully');
      setTitle('');
      setDescription('');
      onClose();
    } catch (err: any) {
      console.error('[CREATE MODAL] Error creating project:', err);
      setError(err.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
     
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            Create New Project
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
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
              Project Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
              placeholder="Enter project title"
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
              placeholder="Enter project description"
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
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// ============================================
// PROJECT CARD
// ============================================
interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onClick: (project: Project) => void;
}
const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete, onClick }) => {
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
  const getProgressColor = (percentage: number): string => {
    if (percentage === 100) return 'from-emerald-500 to-teal-500';
    if (percentage >= 75) return 'from-blue-500 to-cyan-500';
    if (percentage >= 50) return 'from-violet-500 to-purple-500';
    if (percentage >= 25) return 'from-amber-500 to-orange-500';
    return 'from-rose-500 to-pink-500';
  };
  const getStatusIcon = (percentage: number) => {
    if (percentage === 100) return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
    if (percentage >= 50) return <Clock className="w-5 h-5 text-blue-400" />;
    return <Circle className="w-5 h-5 text-amber-400" />;
  };
  return (
    <div
      className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-violet-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/20 cursor-pointer overflow-hidden"
      onClick={() => onClick(project)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-violet-500/10 group-hover:via-purple-500/5 group-hover:to-pink-500/10 transition-all duration-700 rounded-2xl" />
      <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-pink-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-700" />
     
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getStatusIcon(project.progressPercentage)}
              <h3 className="text-xl font-bold text-white group-hover:text-violet-300 transition-colors duration-300">
                {project.title}
              </h3>
            </div>
            <p className="text-slate-400 text-sm line-clamp-2">
              {project.description || 'No description'}
            </p>
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
              <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(project);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-slate-300 hover:bg-violet-600/20 hover:text-white transition-colors duration-200 flex items-center gap-3"
                >
                  <Edit className="w-4 h-4" />
                  Edit Project
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(project);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-rose-400 hover:bg-rose-600/20 transition-colors duration-200 flex items-center gap-3"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Project
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Progress</span>
            <span className="text-white font-bold">{project.progressPercentage}%</span>
          </div>
         
          <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${getProgressColor(project.progressPercentage)} rounded-full transition-all duration-1000 ease-out shadow-lg`}
              style={{ width: `${project.progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-sm text-slate-400">
                {project.completedTasks} / {project.totalTasks} tasks
              </span>
            </div>
            <TrendingUp className="w-4 h-4 text-violet-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
// ============================================
// MAIN PROJECTS PAGE
// ============================================
const ProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects, loading, error, createProject, deleteProject } = useProjects();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  console.log('[PROJECTS PAGE] Render - projects count:', projects.length, 'loading:', loading, 'error:', error);
  console.log('[PROJECTS PAGE] Projects data:', projects);
  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  const handleCreateProject = async (data: CreateProjectRequest): Promise<void> => {
    console.log('[PROJECTS PAGE] handleCreateProject called with:', data);
    await createProject(data);
  };
  const handleEditProject = (project: Project): void => {
    console.log('[PROJECTS PAGE] Edit project:', project);
  };
  const handleDeleteProject = async (project: Project): Promise<void> => {
    if (window.confirm(`Are you sure you want to delete "${project.title}"?`)) {
      try {
        await deleteProject(project.id);
      } catch (err) {
        alert('Failed to delete project');
      }
    }
  };
  const handleProjectClick = (project: Project): void => {
    console.log('[PROJECTS PAGE] Navigate to project:', project);
    navigate(`/projects/${project.id}/tasks`);
  };
  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };
  if (loading) {
    return <LoadingSkeleton />;
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-rose-400 text-xl mb-4">{error}</p>
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
     
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateProject}
      />
     
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Your Projects
              </h1>
              <p className="text-slate-400 text-lg">
                Welcome back, {user?.email || 'User'}
              </p>
            </div>
           
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  console.log('[PROJECTS PAGE] New Project button clicked');
                  setShowCreateModal(true);
                }}
                className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-semibold hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Plus className="w-5 h-5 relative z-10" />
                <span className="relative z-10">New Project</span>
              </button>
             
              <button
                onClick={handleLogout}
                className="p-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl hover:border-rose-500/50 hover:bg-rose-500/10 transition-all duration-300"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-slate-400 hover:text-rose-400 transition-colors" />
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all duration-300"
              />
            </div>
           
            <button className="px-6 py-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-xl hover:border-violet-500/50 transition-all duration-300 flex items-center gap-3">
              <Filter className="w-5 h-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Projects', value: projects.length, color: 'from-violet-500 to-purple-500' },
            { label: 'In Progress', value: projects.filter(p => p.progressPercentage < 100 && p.progressPercentage > 0).length, color: 'from-blue-500 to-cyan-500' },
            { label: 'Completed', value: projects.filter(p => p.progressPercentage === 100).length, color: 'from-emerald-500 to-teal-500' },
            { label: 'Total Tasks', value: projects.reduce((acc, p) => acc + p.totalTasks, 0), color: 'from-amber-500 to-orange-500' }
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
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-slate-800/50 rounded-full flex items-center justify-center">
              <Search className="w-16 h-16 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-400 mb-2">No projects found</h3>
            <p className="text-slate-500 mb-6">
              {projects.length === 0 ? 'Create your first project to get started' : 'Try adjusting your search'}
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Create Your First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEditProject}
                onDelete={handleDeleteProject}
                onClick={handleProjectClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
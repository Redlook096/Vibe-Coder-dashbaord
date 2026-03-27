/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FolderGit2, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Code2, 
  X,
  Command,
  Clock,
  ChevronRight,
  ChevronDown,
  Layers,
  HardDrive,
  Calendar
} from 'lucide-react';

// --- Types ---
interface Project {
  id: string;
  name: string;
  updatedAt: Date;
  tech: string;
  status: 'active' | 'completed';
  size: string;
  modules: number;
  progress?: number;
  currentTask?: string;
}

type ModalConfig = {
  isOpen: boolean;
  mode: 'create' | 'rename';
  projectId?: string;
  initialName?: string;
};

type TabType = 'All' | 'Active' | 'Completed';

// --- Constants ---
const TECH_STACKS = ['React', 'Vue', 'Node.js', 'Python', 'Rust', 'Go', 'WebGL', 'TypeScript'];

const generateId = () => Math.random().toString(36).substr(2, 9);
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const INITIAL_PROJECTS: Project[] = [
  { id: '1', name: 'Core Infrastructure', updatedAt: new Date(), tech: 'Rust', status: 'active', size: '1.2 GB', modules: 14, progress: 68, currentTask: 'Compiling AST...' },
  { id: '2', name: 'Authentication Service', updatedAt: new Date(Date.now() - 86400000 * 2), tech: 'Go', status: 'completed', size: '345 MB', modules: 6 },
  { id: '3', name: 'Data Pipeline', updatedAt: new Date(Date.now() - 86400000 * 5), tech: 'Python', status: 'active', size: '2.8 GB', modules: 27, progress: 34, currentTask: 'Training models...' },
  { id: '4', name: 'Client Portal', updatedAt: new Date(Date.now() - 86400000 * 12), tech: 'React', status: 'active', size: '890 MB', modules: 43, progress: 89, currentTask: 'Bundling assets...' },
];

// --- Animation Config ---
// Snappier, more responsive easing
const snappyEase = [0.16, 1, 0.3, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.98, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: snappyEase } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    filter: 'blur(4px)',
    transition: { duration: 0.2, ease: snappyEase } 
  }
};

const TechIcon = ({ tech }: { tech: string }) => {
  const t = tech.toLowerCase();
  
  if (t === 'react') {
    return (
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="relative flex items-center justify-center w-full h-full group-hover:scale-110 transition-transform duration-500"
      >
        <div className="absolute w-6 h-2.5 border border-white/60 rounded-[50%] rotate-0 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
        <div className="absolute w-6 h-2.5 border border-white/60 rounded-[50%] rotate-60 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
        <div className="absolute w-6 h-2.5 border border-white/60 rounded-[50%] -rotate-60 shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
        <div className="absolute w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
      </motion.div>
    );
  }
  
  if (t === 'node.js' || t === 'node') {
    return (
      <motion.div 
        whileHover={{ rotate: 180 }}
        transition={{ duration: 0.6, ease: snappyEase }}
        className="relative flex items-center justify-center w-full h-full"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-white/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </motion.div>
    );
  }

  if (t === 'python') {
    return (
      <motion.div 
        className="relative flex items-center justify-center w-full h-full group-hover:rotate-12 transition-transform duration-500"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-white/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
          <path d="M12 2c-5.5 0-5.5 2.5-5.5 2.5v3.5h5.5v1.5H6.5C4 9.5 4 12 4 12s0 2.5 2.5 2.5h2v-3.5h5.5c2.5 0 2.5-2.5 2.5-2.5V5c0-2.5-2.5-3-4.5-3z" />
          <path d="M12 22c5.5 0 5.5-2.5 5.5-2.5v-3.5H12v-1.5h5.5c2.5 0 2.5-2.5 2.5-2.5s0-2.5-2.5-2.5h-2v3.5H10c-2.5 0-2.5 2.5-2.5 2.5v3.5c0 2.5 2.5 3 4.5 3z" />
          <circle cx="9" cy="5.5" r="0.5" fill="currentColor" />
          <circle cx="15" cy="18.5" r="0.5" fill="currentColor" />
        </svg>
      </motion.div>
    );
  }

  if (t === 'rust') {
    return (
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="relative flex items-center justify-center w-full h-full"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-white/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
          <circle cx="12" cy="12" r="8" strokeDasharray="4 4" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </motion.div>
    );
  }

  if (t === 'go') {
    return (
      <motion.div 
        className="relative flex items-center justify-center w-full h-full font-black text-white/80 tracking-tighter text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:-translate-y-1 transition-transform duration-300"
      >
        GO
      </motion.div>
    );
  }
  
  if (t === 'typescript' || t === 'ts') {
    return (
      <motion.div 
        className="relative flex items-center justify-center w-full h-full group-hover:scale-110 transition-transform duration-300"
      >
        <div className="border-[1.5px] border-white/80 text-white/80 text-[11px] font-bold px-1.5 py-0.5 rounded-sm shadow-[0_0_8px_rgba(255,255,255,0.2)]">
          TS
        </div>
      </motion.div>
    );
  }

  // Default fallback
  return (
    <motion.div className="flex items-center justify-center w-full h-full group-hover:scale-110 transition-transform duration-300">
      <Code2 className="text-white/80 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" size={20} strokeWidth={1.5} />
    </motion.div>
  );
};

// --- Components ---

const ProjectCard = ({ 
  project, 
  activeMenu, 
  toggleMenu, 
  handleOpenRename, 
  handleDelete 
}: { 
  project: Project; 
  activeMenu: string | null; 
  toggleMenu: (id: string, e: React.MouseEvent) => void;
  handleOpenRename: (project: Project, e: React.MouseEvent) => void;
  handleDelete: (id: string, e: React.MouseEvent) => void;
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      className="group relative bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 backdrop-blur-3xl transition-all shadow-[0_8px_32px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col h-full"
    >
      {/* Interactive Liquid Glow */}
      <div 
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 40%)`
        }}
      />
      
      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] overflow-hidden">
            <TechIcon tech={project.tech} />
          </div>
          
          {/* Context Menu */}
          <div className="relative">
            <button 
              onClick={(e) => toggleMenu(project.id, e)}
              className="p-2 rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-all"
            >
              <MoreVertical size={18} strokeWidth={1.5} />
            </button>
            
            <AnimatePresence>
              {activeMenu === project.id && (
                <motion.div 
                  initial={{ opacity: 0, y: -5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: snappyEase }}
                  // Solid background, no glass effect for better usability
                  className="absolute right-0 top-full mt-2 w-48 bg-[#111111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                >
                  <button 
                    onClick={(e) => handleOpenRename(project, e)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-light text-white/80 hover:bg-white/10 hover:text-white transition-colors text-left"
                  >
                    <Edit2 size={14} strokeWidth={1.5} /> Rename
                  </button>
                  <div className="h-px bg-white/5 w-full" />
                  <button 
                    onClick={(e) => handleDelete(project.id, e)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-light text-white/80 hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
                  >
                    <Trash2 size={14} strokeWidth={1.5} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <h3 className="text-xl font-light tracking-tight mb-6 truncate text-white/90 group-hover:text-white transition-colors">{project.name}</h3>
        
        {/* Project Info */}
        <div className="space-y-4 mb-6 flex-1 mt-2">
          <div className="flex justify-between items-center text-sm group/metric">
            <span className="text-white/40 font-light flex items-center gap-2">
              <HardDrive size={14} className="text-white/20" /> Total Size
            </span>
            <span className="text-white/80 font-medium tracking-wide">{project.size}</span>
          </div>
          <div className="flex justify-between items-center text-sm group/metric">
            <span className="text-white/40 font-light flex items-center gap-2">
              <Calendar size={14} className="text-white/20" /> Last Edited
            </span>
            <span className="text-white/80 font-medium tracking-wide text-right">
              {project.updatedAt.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} at {project.updatedAt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Agentic Progress Bar */}
        {project.status === 'active' && (
          <div className="mb-6">
            <div className="flex justify-between items-end mb-2">
              <div className="flex items-center gap-2 text-[10px] text-white/60 font-mono uppercase tracking-wider">
                <span className="truncate max-w-[180px]">{'{Task}'}</span>
              </div>
              <span className="text-[10px] font-mono text-white/80">{Math.floor(project.progress || 0)}%</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                initial={{ width: `${project.progress || 0}%` }}
                animate={{ width: `${project.progress || 0}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-5 border-t border-white/[0.05] mt-auto">
          <div className="flex items-center gap-2 text-[10px] text-white/40 font-mono uppercase tracking-widest">
            {project.status === 'active' ? (
              <motion.span
                className="bg-[linear-gradient(110deg,#404040,35%,#fff,50%,#404040,75%,#404040)] bg-[length:200%_100%] bg-clip-text text-transparent"
                initial={{ backgroundPosition: "200% 0" }}
                animate={{ backgroundPosition: "-200% 0" }}
                transition={{
                  repeat: Infinity,
                  duration: 4,
                  ease: "linear",
                }}
              >
                In Progress
              </motion.span>
            ) : (
              <>
                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span>Completed</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-white/50 font-mono uppercase tracking-widest group-hover:text-white transition-colors">
            {project.tech}
            <ChevronRight size={12} strokeWidth={1.5} className="opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [modal, setModal] = useState<ModalConfig>({ isOpen: false, mode: 'create' });
  const [inputValue, setInputValue] = useState('');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isAgentConsoleOpen, setIsAgentConsoleOpen] = useState(true);
  const filterRef = useRef<HTMLDivElement>(null);

  // Agent Simulation Hook
  useEffect(() => {
    const tasks = [
      "Analyzing dependencies...",
      "Optimizing AST...",
      "Generating type definitions...",
      "Running test suite...",
      "Refactoring legacy modules...",
      "Resolving merge conflicts...",
      "Synthesizing new components...",
      "Deploying to edge...",
      "Compiling WebAssembly..."
    ];

    const interval = setInterval(() => {
      setProjects(currentProjects => 
        currentProjects.map(p => {
          if (p.status !== 'active') return p;
          
          let newProgress = (p.progress || 0) + (Math.random() * 5);
          let newStatus = p.status;
          let newTask = p.currentTask;

          if (newProgress >= 100) {
            newProgress = 100;
            newStatus = 'completed';
            newTask = 'Task completed successfully.';
          } else if (Math.random() > 0.6) {
            newTask = tasks[Math.floor(Math.random() * tasks.length)];
          }

          return {
            ...p,
            progress: newProgress,
            status: newStatus,
            currentTask: newTask
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      setActiveMenu(null);
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || p.status.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  // --- Handlers ---
  const handleOpenCreate = () => {
    setInputValue('');
    setModal({ isOpen: true, mode: 'create' });
  };

  const handleOpenRename = (project: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setInputValue(project.name);
    setModal({ isOpen: true, mode: 'rename', projectId: project.id, initialName: project.name });
    setActiveMenu(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjects(prev => prev.filter(p => p.id !== id));
    setActiveMenu(null);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    if (modal.mode === 'create') {
      const newProject: Project = {
        id: generateId(),
        name: inputValue.trim(),
        updatedAt: new Date(),
        tech: getRandomItem(TECH_STACKS),
        status: 'active',
        branch: 'main',
        aiContext: '0 tokens',
        lastCommit: 'Initial commit',
      };
      setProjects([newProject, ...projects]);
    } else if (modal.mode === 'rename' && modal.projectId) {
      setProjects(prev => prev.map(p => 
        p.id === modal.projectId ? { ...p, name: inputValue.trim(), updatedAt: new Date() } : p
      ));
    }
    setModal({ isOpen: false, mode: 'create' });
  };

  const toggleMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30 relative overflow-hidden flex flex-col">
      {/* Liquid Glass Ambient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
        {/* Slow moving liquid orbs */}
        <motion.div 
          animate={{ 
            rotate: 360, 
            scale: [1, 1.1, 1],
            x: ['-5%', '5%', '-5%'],
            y: ['-5%', '5%', '-5%']
          }} 
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }} 
          className="absolute w-[80vw] h-[80vw] rounded-full bg-white/[0.02] blur-[100px]" 
        />
        <motion.div 
          animate={{ 
            rotate: -360, 
            scale: [1, 1.2, 1],
            x: ['5%', '-5%', '5%'],
            y: ['5%', '-5%', '5%']
          }} 
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }} 
          className="absolute w-[60vw] h-[60vw] rounded-full bg-white/[0.015] blur-[80px]" 
        />
        {/* Noise overlay for realism */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Header (Full Width) */}
      <header className="relative z-20 h-20 px-8 md:px-12 flex items-center justify-between border-b border-white/[0.05] bg-black/40 backdrop-blur-2xl">
        {/* Left - Logo */}
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] bg-white/[0.02]">
            <Command size={14} strokeWidth={2} />
          </div>
          <span className="font-medium tracking-widest text-sm uppercase hidden sm:block">VibeCoder</span>
        </div>
        
        {/* Center - Search */}
        <div className="flex-1 flex justify-center max-w-md w-full mx-4">
          <div className="relative w-full group focus-within:scale-[1.02] transition-all duration-300 ease-out">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white/70 transition-colors duration-300" size={16} strokeWidth={1.5} />
            <input 
              type="text" 
              placeholder="Search repository..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/[0.05] rounded-full py-2.5 pl-11 pr-10 text-sm font-light text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:bg-white/[0.06] focus:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-300"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80 transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <X size={14} strokeWidth={2} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Right - Actions */}
        <div className="flex items-center justify-end gap-4 flex-1">
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
          >
            <Plus size={16} strokeWidth={2} />
            <span className="hidden sm:inline tracking-wide">New Project</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto p-8 md:p-12 flex flex-col min-h-full">
          
          {/* User Friendly Filter */}
          <div className="flex items-center justify-between mb-8 relative z-30">
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-3 text-2xl md:text-3xl font-light text-white tracking-tight hover:opacity-80 transition-opacity group"
              >
                {activeTab === 'All' ? 'Everything' : activeTab === 'Active' ? 'In Progress' : 'Completed'}
                <div className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
                  <ChevronDown size={16} className={`transition-transform duration-300 ease-out ${isFilterOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10, scale: 0.95, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -10, scale: 0.95, filter: 'blur(10px)' }}
                    transition={{ duration: 0.2, ease: snappyEase }}
                    className="absolute left-0 top-full mt-4 w-56 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden py-2 origin-top-left"
                  >
                    {(['All', 'Active', 'Completed'] as TabType[]).map((tab) => {
                      const label = tab === 'All' ? 'Everything' : tab === 'Active' ? 'In Progress' : 'Completed';
                      const count = tab === 'All' ? projects.length : tab === 'Active' ? projects.filter(p => p.status === 'active').length : projects.filter(p => p.status === 'completed').length;
                      return (
                        <button
                          key={tab}
                          onClick={() => { setActiveTab(tab); setIsFilterOpen(false); }}
                          className={`w-full flex items-center justify-between px-5 py-3 text-sm transition-colors ${activeTab === tab ? 'bg-white/10 text-white font-medium' : 'text-white/50 hover:bg-white/5 hover:text-white/90'}`}
                        >
                          <span>{label}</span>
                          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{count}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Project Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {/* "Create New" Card injected into the grid for better UX */}
              {activeTab !== 'Completed' && !searchQuery && filteredProjects.length > 0 && (
                <motion.button
                  variants={itemVariants}
                  onClick={handleOpenCreate}
                  className="group relative bg-transparent border border-dashed border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[280px] hover:bg-white/[0.02] hover:border-white/40 transition-all active:scale-[0.98]"
                >
                  <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ease-out">
                    <Plus size={24} className="text-white/60 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-white/60 font-light tracking-wide group-hover:text-white transition-colors">Initialize New Project</span>
                </motion.button>
              )}

              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  activeMenu={activeMenu}
                  toggleMenu={toggleMenu}
                  handleOpenRename={handleOpenRename}
                  handleDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
              animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
              transition={{ duration: 0.5, ease: snappyEase }}
              className="flex-1 flex flex-col items-center justify-center text-white/20 py-24"
            >
              <div className="relative flex items-center justify-center mb-10">
                {/* Animated rings */}
                <motion.div 
                  animate={{ rotate: 360, scale: [1, 1.05, 1] }} 
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute w-32 h-32 rounded-full border border-dashed border-white/10"
                />
                <motion.div 
                  animate={{ rotate: -360, scale: [1, 1.1, 1] }} 
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute w-48 h-48 rounded-full border border-dashed border-white/[0.05]"
                />
                {/* Central Icon */}
                <div className="w-20 h-20 rounded-full bg-white/[0.02] border border-white/[0.08] flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.05),inset_0_1px_2px_rgba(255,255,255,0.1)] backdrop-blur-md z-10">
                  {searchQuery ? <Search size={32} strokeWidth={1} className="text-white/60" /> : <FolderGit2 size={32} strokeWidth={1} className="text-white/60" />}
                </div>
              </div>
              
              <h3 className="text-2xl font-light text-white/90 mb-3 tracking-tight">
                {searchQuery ? 'No matches found' : activeTab === 'Completed' ? 'No completed projects' : 'Workspace is empty'}
              </h3>
              <p className="font-light text-sm text-white/40 mb-10 max-w-md text-center leading-relaxed">
                {searchQuery 
                  ? `We couldn't find any projects matching "${searchQuery}". Try adjusting your search terms or filters.` 
                  : activeTab === 'Completed' 
                    ? 'Projects you complete will appear here for safekeeping.'
                    : 'You have no active projects in your workspace. Initialize a new repository to begin coding.'}
              </p>
              
              {searchQuery ? (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-2.5 rounded-full text-sm font-medium tracking-wide bg-white/[0.05] text-white hover:bg-white/10 transition-all border border-white/10 hover:border-white/20"
                >
                  Clear Search
                </button>
              ) : activeTab !== 'Completed' ? (
                <button 
                  onClick={handleOpenCreate}
                  className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full text-sm font-medium hover:bg-white/90 transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)]"
                >
                  <Plus size={18} strokeWidth={2} />
                  Initialize Project
                </button>
              ) : null}
            </motion.div>
          )}
        </div>
      </main>

      {/* Liquid Glass Modal */}
      <AnimatePresence>
        {modal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setModal({ isOpen: false, mode: 'create' })}
              className="absolute inset-0 bg-black/60"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.85, y: 30, filter: 'blur(12px)' }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.85, y: 20, filter: 'blur(12px)' }}
              transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/[0.08] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden"
            >
              <div className="p-8 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-light tracking-tight text-white/90">
                    {modal.mode === 'create' ? 'Initialize Project' : 'Rename Project'}
                  </h2>
                  <button 
                    onClick={() => setModal({ isOpen: false, mode: 'create' })}
                    className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                  >
                    <X size={18} strokeWidth={1.5} />
                  </button>
                </div>

                <form onSubmit={handleModalSubmit}>
                  <div className="mb-10">
                    <label className="block text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-3">
                      Project Identifier
                    </label>
                    <input
                      autoFocus
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="e.g. core-engine-v2"
                      className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-5 py-3.5 text-white font-light placeholder:text-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)]"
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setModal({ isOpen: false, mode: 'create' })}
                      className="px-5 py-2.5 rounded-full text-sm font-medium tracking-wide text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="px-6 py-2.5 rounded-full text-sm font-medium tracking-wide bg-white text-black hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                    >
                      {modal.mode === 'create' ? 'Deploy' : 'Confirm'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Autonomous Agent Console (Floating Bottom Right) */}
      <AnimatePresence>
        {projects.some(p => p.status === 'active') && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-8 right-8 z-40 w-80 bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] overflow-hidden flex flex-col"
          >
            {/* Console Header (Clickable) */}
            <button 
              onClick={() => setIsAgentConsoleOpen(!isAgentConsoleOpen)}
              className="w-full px-4 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors cursor-pointer outline-none"
            >
              <div className="flex items-center gap-3">
                {/* Morphing Square */}
                <motion.div
                  className="w-3 h-3 bg-white"
                  animate={{
                    borderRadius: ["6%", "50%", "6%"],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/80 font-medium">
                  Agent Network
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
                  {projects.filter(p => p.status === 'active').length} Active
                </span>
                <motion.div
                  animate={{ rotate: isAgentConsoleOpen ? 0 : 180 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-white/40"
                >
                  <ChevronDown size={14} />
                </motion.div>
              </div>
            </button>
            
            {/* Active Tasks List (Collapsible) */}
            <AnimatePresence initial={false}>
              {isAgentConsoleOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                      {projects.filter(p => p.status === 'active').map(project => (
                        <motion.div 
                          key={project.id}
                          layout
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="p-3 rounded-xl hover:bg-white/[0.02] transition-colors group/task"
                        >
                          <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                            <span className="text-white/40 truncate max-w-[140px]">{'{project name}'}</span>
                            <span className="text-white/40">{Math.floor(project.progress || 0)}%</span>
                          </div>
                          <div className="flex items-start gap-3">
                            <motion.div 
                              animate={{ rotate: 360 }} 
                              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                              className="w-3.5 h-3.5 mt-0.5 border-[1px] border-white/20 border-t-white/80 border-r-white/40 rounded-full shrink-0"
                            />
                            <div className="flex-1">
                              <span className="text-xs text-white/80 font-light leading-tight block">
                                {'{task name}'}
                              </span>
                              {/* Mini progress bar */}
                              <div className="h-[2px] w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                                <motion.div 
                                  className="h-full bg-white/60"
                                  initial={{ width: `${project.progress || 0}%` }}
                                  animate={{ width: `${project.progress || 0}%` }}
                                  transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


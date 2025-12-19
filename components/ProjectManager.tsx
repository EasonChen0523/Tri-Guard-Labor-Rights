
import React from 'react';
import { ReportProject } from '../types';
import { FolderOpen, Plus, Trash2, Calendar, Building2, ChevronRight, X, LayoutDashboard, Clock } from 'lucide-react';

interface ProjectManagerProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ReportProject[];
  onLoadProject: (project: ReportProject) => void;
  onDeleteProject: (id: string) => void;
  onNewProject: () => void;
  currentProjectId: string | null;
}

const ProjectManager: React.FC<ProjectManagerProps> = ({ 
  isOpen, 
  onClose, 
  projects, 
  onLoadProject, 
  onDeleteProject, 
  onNewProject,
  currentProjectId 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">我的檢舉專案</h2>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Project Dashboard</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        {/* Action Button */}
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={() => { onNewProject(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 border-2 border-dashed border-indigo-200 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 hover:border-indigo-300 transition-all"
          >
            <Plus className="w-5 h-5" /> 建立全新專案
          </button>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 opacity-60">
              <FolderOpen className="w-12 h-12 mb-2" />
              <p className="text-sm font-medium">尚無存檔專案</p>
            </div>
          ) : (
            projects.sort((a, b) => b.updatedAt - a.updatedAt).map((project) => (
              <div 
                key={project.id}
                className={`group relative p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${
                  currentProjectId === project.id 
                    ? 'border-indigo-500 bg-indigo-50/30' 
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                }`}
                onClick={() => { onLoadProject(project); onClose(); }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className={`w-4 h-4 ${currentProjectId === project.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <h3 className="font-bold text-slate-800 truncate">{project.name || "未命名公司"}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-full ${project.reports ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {project.reports ? '文案已生成' : '草稿中'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('確定要刪除此專案嗎？')) onDeleteProject(project.id);
                      }}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Info */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 text-center">
          專案資料儲存於您的瀏覽器本機快取 (LocalStorage)<br/>
          清除瀏覽器快取將導致資料遺失，請及時匯出。
        </div>
      </div>
    </div>
  );
};

export default ProjectManager;

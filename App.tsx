
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import IncidentForm from './components/IncidentForm';
import ReportViewer from './components/ReportViewer';
import IdentityGuide from './components/IdentityGuide';
import MindsetGuide from './components/MindsetGuide';
import SuccessStories from './components/SuccessStories';
import AIChatAssistant from './components/AIChatAssistant';
import BrandingGenerator from './components/BrandingGenerator';
import ProjectManager from './components/ProjectManager';
import { generateReports } from './services/geminiService';
import { CaseDetails, ReportResult, ReportStatus, ReportProject, Message } from './types';
import { LayoutDashboard, Save } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<ReportStatus>(ReportStatus.IDLE);
  const [reports, setReports] = useState<ReportResult | null>(null);
  const [currentDetails, setCurrentDetails] = useState<CaseDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isIdentityGuideOpen, setIsIdentityGuideOpen] = useState(false);
  const [isMindsetGuideOpen, setIsMindsetGuideOpen] = useState(false);
  
  // Project Management State
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState(false);
  const [projects, setProjects] = useState<ReportProject[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [saveToast, setSaveToast] = useState(false);

  // Global scratchpad history when no project is selected
  const [globalChatHistory, setGlobalChatHistory] = useState<Message[]>([]);

  // Load projects from localStorage on init
  useEffect(() => {
    const savedProjects = localStorage.getItem('triguard_projects');
    if (savedProjects) {
      try {
        setProjects(JSON.parse(savedProjects));
      } catch (e) {
        console.error("Failed to parse saved projects", e);
      }
    }
  }, []);

  // Save projects to localStorage whenever projects state changes
  useEffect(() => {
    localStorage.setItem('triguard_projects', JSON.stringify(projects));
  }, [projects]);

  const saveCurrentProject = (details: CaseDetails, result: ReportResult | null = null) => {
    const now = Date.now();
    let updatedProjects = [...projects];
    let activeId = currentProjectId;

    if (activeId) {
      // Update existing
      updatedProjects = updatedProjects.map(p => 
        p.id === activeId 
          ? { ...p, name: details.companyName, updatedAt: now, data: details, reports: result || p.reports }
          : p
      );
    } else {
      // Create new
      activeId = `proj_${now}`;
      const newProject: ReportProject = {
        id: activeId,
        name: details.companyName || "未命名專案",
        createdAt: now,
        updatedAt: now,
        data: details,
        reports: result,
        chatHistory: [] // Initialize empty chat for new project
      };
      updatedProjects.push(newProject);
      setCurrentProjectId(activeId);
    }

    setProjects(updatedProjects);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleUpdateChatHistory = (newHistory: Message[]) => {
    if (currentProjectId) {
      setProjects(prev => prev.map(p => 
        p.id === currentProjectId ? { ...p, chatHistory: newHistory, updatedAt: Date.now() } : p
      ));
    } else {
      setGlobalChatHistory(newHistory);
    }
  };

  const handleFormSubmit = async (data: CaseDetails) => {
    setStatus(ReportStatus.GENERATING);
    setErrorMsg(null);
    setCurrentDetails(data);
    
    try {
      const result = await generateReports(data);
      setReports(result);
      setStatus(ReportStatus.COMPLETED);
      
      // Auto-save when completed
      saveCurrentProject(data, result);

      // Smooth scroll to reports
      setTimeout(() => {
        const reportElement = document.getElementById('report-section');
        if (reportElement) {
          reportElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);

    } catch (error) {
      console.error(error);
      setStatus(ReportStatus.ERROR);
      setErrorMsg("生成失敗，請檢查 API Key 或網路連線，稍後再試。");
    }
  };

  const loadProject = (project: ReportProject) => {
    setCurrentProjectId(project.id);
    setCurrentDetails(project.data);
    setReports(project.reports);
    setStatus(project.reports ? ReportStatus.COMPLETED : ReportStatus.IDLE);
    
    // If it was already completed, scroll to reports
    if (project.reports) {
      setTimeout(() => {
        const reportElement = document.getElementById('report-section');
        if (reportElement) {
          reportElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (currentProjectId === id) {
      createNewProject();
    }
  };

  const createNewProject = () => {
    setCurrentProjectId(null);
    setCurrentDetails(null);
    setReports(null);
    setStatus(ReportStatus.IDLE);
  };

  const currentProject = projects.find(p => p.id === currentProjectId);
  const activeChatHistory = currentProject ? currentProject.chatHistory : globalChatHistory;

  return (
    <div className="min-h-screen pb-12 flex flex-col bg-slate-50">
      <Header 
        onOpenIdentityGuide={() => setIsIdentityGuideOpen(true)} 
        onOpenMindsetGuide={() => setIsMindsetGuideOpen(true)}
      />

      {/* Persistent Dashboard Trigger */}
      <div className="fixed top-24 right-4 z-40 flex flex-col gap-2 print:hidden">
        <button
          onClick={() => setIsProjectManagerOpen(true)}
          className="bg-slate-800 text-white p-3 rounded-full shadow-xl hover:bg-slate-700 transition-all group relative"
          title="開啟我的專案"
        >
          <LayoutDashboard className="w-6 h-6" />
          <span className="absolute right-full mr-3 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">我的專案庫</span>
          {projects.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-bold">
              {projects.length}
            </span>
          )}
        </button>
      </div>

      {/* Save Success Toast */}
      {saveToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[110] bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <Save className="w-4 h-4 text-green-400" />
          <span className="text-sm font-bold">專案進度已儲存</span>
        </div>
      )}
      
      <IdentityGuide 
        isOpen={isIdentityGuideOpen} 
        onClose={() => setIsIdentityGuideOpen(false)} 
      />

      <MindsetGuide 
        isOpen={isMindsetGuideOpen} 
        onClose={() => setIsMindsetGuideOpen(false)} 
      />

      <ProjectManager
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
        projects={projects}
        onLoadProject={loadProject}
        onDeleteProject={deleteProject}
        onNewProject={createNewProject}
        currentProjectId={currentProjectId}
      />
      
      <main className="flex-grow">
        <IncidentForm 
          key={currentProjectId || 'new'}
          onSubmit={handleFormSubmit} 
          isGenerating={status === ReportStatus.GENERATING} 
          initialData={currentDetails}
        />

        {status !== ReportStatus.COMPLETED && (
          <>
            <SuccessStories />
            <BrandingGenerator />
          </>
        )}

        {status === ReportStatus.ERROR && (
           <div className="max-w-4xl mx-auto mt-8 px-4">
             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">發生錯誤：</strong>
                <span className="block sm:inline"> {errorMsg}</span>
             </div>
           </div>
        )}

        {(status === ReportStatus.COMPLETED && reports) && (
          <div id="report-section" className="animate-fade-in-up">
             <div className="max-w-4xl mx-auto mt-12 mb-4 px-4 flex items-center justify-center">
                <span className="bg-slate-200 h-px flex-grow"></span>
                <span className="px-4 text-slate-400 font-medium tracking-widest uppercase text-sm">Generated Reports</span>
                <span className="bg-slate-200 h-px flex-grow"></span>
             </div>
             <ReportViewer reports={reports} />
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-slate-400 text-sm border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4">
          <p className="mb-2">本工具致力於提升勞工數位救濟能力，所有資料均在您的瀏覽器與 AI 間加密傳輸。</p>
          <p>&copy; {new Date().getFullYear()} 勞權三線守護基地 | Power by Google Gemini 2.5/3.0</p>
        </div>
      </footer>

      <AIChatAssistant 
        projectId={currentProjectId}
        projectName={currentDetails?.companyName || null}
        projectData={currentDetails}
        projectReports={reports}
        history={activeChatHistory}
        onUpdateHistory={handleUpdateChatHistory}
      />
    </div>
  );
};

export default App;
